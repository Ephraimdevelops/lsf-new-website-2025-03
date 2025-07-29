// Session management utilities (no JSX)
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
