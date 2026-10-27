export function isWorkspacePath(path: string) {
  return path === '/admin' || path.startsWith('/admin/') || path.startsWith('/dashboard/') || ['/profile', '/notifications', '/join', '/sara/train'].includes(path);
}
