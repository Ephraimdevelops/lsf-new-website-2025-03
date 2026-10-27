export function dashboardPath(roles: readonly string[] = []): string {
  if (roles.includes('admin')) return '/admin';
  if (roles.includes('supervisor')) return '/dashboard/supervisor';
  if (roles.includes('staff')) return '/dashboard/staff';
  if (roles.includes('safeguarding_officer')) return '/dashboard/safeguarding';
  if (roles.includes('content_editor')) return '/dashboard/editorial';
  if (roles.includes('provider_staff')) return '/dashboard/provider';
  if (roles.includes('paralegal')) return '/dashboard/paralegal';
  if (roles.some(role => ['stakeholder', 'donor'].includes(role))) return '/dashboard/stakeholder';
  return '/dashboard/user';
}
