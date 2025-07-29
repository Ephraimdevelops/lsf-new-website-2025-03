
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface AdminLoginProps {
  isLocked: boolean;
  onLogin?: (email: string, password: string) => boolean;
}

const AdminLogin = ({ isLocked, onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

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
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (onLogin && onLogin(email, password)) {
        // Hardcoded login succeeded, redirect to admin
        navigate('/admin');
        return;
      }
      const res = await api.post('/auth/login', { email, password });
      const { session, user } = res.data;
      localStorage.setItem('auth-token', session.access_token);
      localStorage.setItem('user-role', user.user_metadata?.role || '');
      localStorage.setItem('user-email', user.email);
      // Redirect based on role
      if (user.user_metadata?.role === 'admin') {
        navigate('/admin');
      } else if (user.user_metadata?.role === 'staff') {
        navigate('/dashboard/staff');
      } else if (user.user_metadata?.role === 'paralegal') {
        navigate('/dashboard/paralegal');
      } else if (user.user_metadata?.role === 'stakeholder') {
        navigate('/dashboard/stakeholder');
      } else {
        setError('Unknown user role.');
      }
    } catch (error) {
      let message = 'Invalid credentials. Please try again.';
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={isLoading}
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded font-semibold"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default AdminLogin;
