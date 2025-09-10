// Helper to check for admin role in user_metadata or app_metadata
function isAdminUser(user: any): boolean {
  if (!user) return false;
  // Check user_metadata
  if (user.user_metadata && user.user_metadata.role === 'admin') return true;
  // Check app_metadata
  if (user.app_metadata && user.app_metadata.role === 'admin') return true;
  // Check custom claims (optional, for advanced setups)
  if (user.role === 'admin') return true;
  return false;
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { useAuth } from '@/providers/AuthProvider';

interface AdminLoginProps {
  onLogin?: (email: string, password: string) => boolean;
  isLocked: boolean;
}

const AdminLogin = ({ isLocked, onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast({
        title: "Login Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call server endpoint that sets HttpOnly cookies
      const res = await api.post('/auth/login-cookie', { email, password });

      // Let AuthProvider fetch the user from cookie and populate context/localStorage
      await auth.setToken(undefined);

      toast({
        title: 'Success',
        description: `Logged in successfully as ${res.data.user?.email || email}`,
      });

      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        setError('Login failed. Please try again.');
        toast({
          title: "Error",
          description: "Login failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading || isLocked}
          required
          autoComplete="username"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading || isLocked}
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isLocked}
        className={`w-full bg-primary text-white py-2 rounded font-semibold ${
          (isLoading || isLocked) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default AdminLogin;