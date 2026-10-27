// Explicit development CLI provisioning. No public auth bypass or new backend endpoint.
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const readEnv = file => fs.existsSync(file) ? Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).flatMap(line => {
  const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
  return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]] : [];
})) : {};
const env = { ...readEnv(path.join(root, '.env.local')), ...process.env };
const mobileEnv = readEnv(path.join(root, 'mobile/.env.local'));
const create = process.argv.includes('--create');
const provision = process.argv.includes('--provision');
const deployment = 'joyous-spaniel-5';
const region = 'Dar es Salaam';
const district = 'Ilala';
const output = path.join(root, 'development-role-test-credentials.local');
const definitions = [
  ['user', 'beneficiary', 'Beneficiary', '/dashboard/user'],
  ['paralegal', 'paralegal', 'Paralegal', '/dashboard/paralegal'],
  ['provider_staff', 'provider', 'Provider', '/dashboard/paralegal'],
  ['staff', 'staff', 'Staff', '/dashboard/staff'],
  ['supervisor', 'supervisor', 'Supervisor', '/dashboard/staff'],
  ['safeguarding_officer', 'safeguarding', 'Safeguarding', '/dashboard/safeguarding'],
  ['content_editor', 'editor', 'Editor', '/dashboard/editorial'],
  ['stakeholder', 'stakeholder', 'Stakeholder', '/dashboard/stakeholder'],
  ['donor', 'donor', 'Donor', '/dashboard/stakeholder'],
  ['admin', 'admin', 'Admin', '/admin'],
].map(([role, slug, label, landing]) => ({ role, email: `haki-qa-${slug}+clerk_test@example.com`, name: `QA ${label}`, landing }));

function assertDevelopment() {
  if (env.CONVEX_DEPLOYMENT !== `dev:${deployment}` || !env.VITE_CONVEX_URL?.includes(`${deployment}.convex.cloud`)) throw new Error('Expected the named Haki development deployment.');
  if (!env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) throw new Error('A Clerk Development public key is required.');
  if (mobileEnv.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY !== env.VITE_CLERK_PUBLISHABLE_KEY || mobileEnv.EXPO_PUBLIC_CONVEX_URL !== env.VITE_CONVEX_URL) throw new Error('Web and mobile must use the same development backend and Clerk instance.');
  if (create && !env.CLERK_SECRET_KEY?.startsWith('sk_test_')) throw new Error('Add the Clerk Development CLERK_SECRET_KEY to .env.local before using --create.');
}
function cli(args) {
  try {
    return execFileSync(process.execPath, [path.join(root, 'node_modules/convex/bin/main.js'), ...args, '--deployment-name', deployment], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 });
  } catch (error) {
    throw new Error(`Development CLI ${args[0]} failed: ${String(error.stderr || error.message).replace(/sk_(test|live)_\S+/g, '[redacted]').slice(0, 1500)}`);
  }
}
function data(table) {
  const raw = cli(['data', table, '--format', 'json', '--limit', '1000']).trim();
  const rows = raw ? JSON.parse(raw) : [];
  if (rows.length >= 1000) throw new Error(`Cannot safely inspect the complete ${table} table.`);
  return rows;
}
const identity = user => ({ subject: user.clerkId, email: user.email, name: user.name });
const run = (fn, args, user) => {
  const raw = cli(['run', fn, JSON.stringify(args), '--identity', JSON.stringify(identity(user))]).trim();
  return raw ? JSON.parse(raw) : null;
};
function append(table, rows) {
  if (!rows.length) return;
  const file = path.join(root, `.qa-${table}-${randomBytes(8).toString('hex')}.local`);
  try {
    fs.writeFileSync(file, JSON.stringify(rows), { mode: 0o600 });
    // Append only. Existing documents are never replaced by the fixture importer.
    cli(['import', '--table', table, '--format', 'jsonArray', '--append', file]);
  } finally { fs.rmSync(file, { force: true }); }
}
async function clerk(route, body, method = body ? 'POST' : 'GET') {
  const result = await fetch(`https://api.clerk.com/v1${route}`, {
    method, headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000),
  });
  const json = await result.json();
  if (!result.ok) throw new Error(`Clerk ${result.status}: ${json.errors?.map(item => item.code).join(', ') || 'request failed'}`);
  return json;
}

async function main() {
  assertDevelopment();
  let users = data('users');
  const admin = users.find(user => user.role === 'admin' && !user.isDeleted && !user.email.startsWith('haki-qa-'));
  if (provision && !admin) throw new Error('An existing development administrator is needed for fixture audit attribution.');
  if (create) {
    const anchor = users.find(user => user.email === definitions[0].email);
    if (!anchor) throw new Error('The known beneficiary development identity is required to verify the Clerk instance before creation.');
    const reference = await clerk(`/users/${anchor.clerkId}`);
    if (reference.id !== anchor.clerkId || !reference.email_addresses?.some(item => item.email_address === anchor.email)) throw new Error('Clerk secret belongs to a different instance.');
  }
  const previous = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')) : { accounts: [] };
  const accounts = [];
  for (const definition of definitions) {
    const saved = previous.accounts?.find(item => item.email === definition.email);
    let user = users.find(item => item.email === definition.email);
    let password = saved?.password ?? null;
    let clerkId = user?.clerkId;
    if (create) {
      const found = await clerk(`/users?email_address=${encodeURIComponent(definition.email)}`);
      if (found.length > 1) throw new Error(`Duplicate Clerk identity for ${definition.role}.`);
      let record = found[0];
      if (!record) {
        password = `HY!Aa1${randomBytes(18).toString('base64url')}`;
        record = await clerk('/users', { email_address: [definition.email], password, first_name: 'QA', last_name: definition.name.slice(3), private_metadata: { testAccount: true, region, district } });
      }
      clerkId = record.id;
      if (!password) {
        // Only these explicitly named development test identities can receive a new password.
        password = `HY!Aa1${randomBytes(18).toString('base64url')}`;
        // Store before the update so an interrupted request can safely be retried.
        fs.writeFileSync(output, JSON.stringify({ accounts: [...accounts, { ...definition, clerkId, password }, ...previous.accounts.filter(old => old.email !== definition.email && !accounts.some(next => next.email === old.email))] }, null, 2) + '\n', { mode: 0o600 });
        await clerk(`/users/${clerkId}`, { password }, 'PATCH');
      }
      if (user && user.clerkId !== clerkId) throw new Error(`Identity mismatch for ${definition.role}.`);
    }
    const account = { ...definition, clerkId, password, verificationCode: '424242', loginMethod: 'password', loginVerified: saved?.loginVerified ?? false, state: clerkId ? 'identity_exists' : 'not_created' };
    accounts.push(account);
    // Persist immediately so retries never lose passwords after partial success.
    if (create) fs.writeFileSync(output, JSON.stringify({ environment: 'Development', deployment, region, district, accounts: [...accounts, ...previous.accounts.filter(old => !accounts.some(next => next.email === old.email))] }, null, 2) + '\n', { mode: 0o600 });
    if (create && password) {
      const verified = await clerk(`/users/${clerkId}/verify_password`, { password });
      if (!verified.verified) throw new Error(`Password verification failed for ${definition.role}.`);
      account.passwordVerified = true;
    }
    if (provision && clerkId) {
      if (user?.isDeleted) throw new Error(`The ${definition.role} test user has been deactivated.`);
      const actor = { clerkId, email: definition.email, name: definition.name };
      run('users:syncUser', { clerkId, name: definition.name }, actor);
      run('users:updateProfile', { name: definition.name, bio: `Synthetic development test account. ${district}, ${region}, Tanzania.` }, actor);
    }
  }
  if (provision) {
    users = data('users');
    const assignments = data('role_assignments');
    let organizations = data('justice_service_organizations');
    const organizationDefinitions = [
      { name: 'QA LSF — Dar es Salaam', organizationType: 'lsf' },
      { name: 'QA Provider — Dar es Salaam', organizationType: 'legal_aid_provider' },
    ];
    append('justice_service_organizations', organizationDefinitions.filter(item => !organizations.some(org => org.name === item.name)).map(item => ({ ...item, verificationStatus: 'verified', referralAgreementStatus: 'active', safeguardingReady: true, dataSharingAgreementVersion: 'synthetic-development-fixture', notes: `Synthetic development fixture only. ${district}, ${region}.`, createdBy: admin._id, createdAt: Date.now(), updatedAt: Date.now() })));
    organizations = data('justice_service_organizations');
    const grants = [];
    for (const account of accounts.filter(item => item.clerkId)) {
      const user = users.find(item => item.clerkId === account.clerkId);
      if (!user || user.email !== account.email) throw new Error(`Missing synced ${account.role} user.`);
      const extra = assignments.filter(item => item.userId === user._id && item.status === 'active' && !['user', account.role].includes(item.role));
      if (extra.length || !['user', account.role].includes(user.role)) throw new Error(`Unexpected extra role on ${account.role}; review before reusing this account.`);
      if (account.role !== 'user' && !assignments.some(item => item.userId === user._id && item.role === account.role && item.status === 'active')) {
        const provider = ['paralegal', 'provider_staff', 'stakeholder', 'donor'].includes(account.role);
        const organization = organizations.find(item => item.name === organizationDefinitions[provider ? 1 : 0].name);
        if (!organization || organization.verificationStatus !== 'verified' || organization.referralAgreementStatus !== 'active') throw new Error('Expected the synthetic verified development organisation.');
        grants.push({ userId: user._id, role: account.role, organizationId: organization._id, status: 'active', grantedBy: admin._id, grantedAt: Date.now() });
      }
    }
    append('role_assignments', grants);
    append('audit_logs', grants.map(grant => ({ action: 'development.test_account_provisioned', entityType: 'user', entityId: grant.userId, userId: admin._id, timestamp: Date.now(), metadata: { role: grant.role, organizationId: grant.organizationId, region, district, synthetic: true } })));
    for (const account of accounts.filter(item => item.clerkId)) {
      const access = run('users:currentAccess', {}, { clerkId: account.clerkId, email: account.email, name: account.name });
      if (!access?.roles.includes(account.role)) throw new Error(`Role verification failed for ${account.role}.`);
      account.roles = access.roles;
      account.state = 'backend_role_verified';
    }
  }
  const report = { checkedAt: new Date().toISOString(), environment: 'Development', deployment, region, district, accounts };
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
  fs.chmodSync(output, 0o600);
  for (const { role, email, state } of accounts) console.log(`${role}: ${email} — ${state}`);
  console.log(`Private login list: ${output}`);
  if (accounts.some(account => !account.clerkId)) process.exitCode = 2;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
