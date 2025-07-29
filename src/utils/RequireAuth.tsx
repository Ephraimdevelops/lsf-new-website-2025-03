import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth-token');
}

export function getUserRole(): string | null {
  return localStorage.getItem('user-role');
}

export function logout(): void {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-role');
  localStorage.removeItem('user-email');
}

export function RequireAuth({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const location = useLocation();
  const token = localStorage.getItem('auth-token');
  const role = localStorage.getItem('user-role');
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
