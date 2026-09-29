export function dashboardPath(roles: readonly string[] = []): string {
  if (roles.includes('admin')) return '/admin';
  if (roles.some(role => ['staff', 'supervisor'].includes(role))) return '/dashboard/staff';
  if (roles.some(role => ['paralegal', 'provider_staff'].includes(role))) return '/dashboard/paralegal';
  if (roles.some(role => ['stakeholder', 'donor'].includes(role))) return '/dashboard/stakeholder';
  return '/dashboard/user';
}
