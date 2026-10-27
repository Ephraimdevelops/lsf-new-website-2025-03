import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const configure = require('../mobile/app.config.js');
const keys = ['EAS_BUILD_PROFILE', 'EXPO_RELEASE_CHECK', 'EXPO_PUBLIC_CONVEX_URL', 'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY', 'EXPO_PUBLIC_EAS_PROJECT_ID'];
function withEnv(values, run) {
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  try {
    for (const key of keys) { if (values[key] === undefined) delete process.env[key]; else process.env[key] = values[key]; }
    return run();
  } finally {
    for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
  }
}
const production = { EAS_BUILD_PROFILE: 'production', EXPO_PUBLIC_CONVEX_URL: 'https://synthetic-production.convex.cloud', EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_live_synthetic', EXPO_PUBLIC_EAS_PROJECT_ID: '12345678-1234-1234-1234-123456789012' };
test('production cannot inherit local development credentials', () => withEnv({ EAS_BUILD_PROFILE: 'production' }, () => assert.throws(() => configure({ config: {} }), /Production build blocked/)));
test('production rejects test authentication and invalid project identity', () => {
  for (const overrides of [{ EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_synthetic' }, { EXPO_PUBLIC_EAS_PROJECT_ID: 'placeholder' }, { EXPO_PUBLIC_CONVEX_URL: 'http://localhost:3000' }]) {
    withEnv({ ...production, ...overrides }, () => assert.throws(() => configure({ config: {} }), /Production build blocked/));
  }
});
test('production publishes one EAS identity for native tooling and push registration', () => withEnv(production, () => {
  const result = configure({ config: { name: 'Haki Yangu', extra: { retained: true, eas: { other: true } } } });
  assert.equal(result.extra.eas.projectId, production.EXPO_PUBLIC_EAS_PROJECT_ID);
  assert.equal(result.extra.easProjectId, result.extra.eas.projectId);
  assert.equal(result.extra.retained, true);
  assert.equal(result.extra.eas.other, true);
  assert.equal(result.extra.clerkPublishableKey, production.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
}));
test('explicit release inspection enforces production rules outside EAS', () => withEnv({ EXPO_RELEASE_CHECK: 'true' }, () => assert.throws(() => configure({ config: {} }), /Production build blocked/)));
