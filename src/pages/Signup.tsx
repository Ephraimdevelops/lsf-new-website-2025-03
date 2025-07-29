import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/signup', {
        email,
        password,
        role: 'stakeholder', // Default role
      });
      toast({
        title: 'Signup successful!',
        description: 'Please check your email to confirm your account.',
      });
      navigate('/login');
    } catch (err: unknown) {
      let message = 'Signup failed.';
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.data?.error) {
        message = (err as any).response.data.error;
      }
      setError(message);
      toast({
        title: 'Signup failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
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
      <div className="mb-4">
        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
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
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup; 