import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'stakeholder', label: 'Stakeholder' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paralegal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError('Please fill all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('/auth/signup', { email, password, role });
      toast({
        title: 'Registration Successful',
        description: 'You can now log in.',
      });
      navigate('/login');
    } catch (err: unknown) {
      let message = 'Registration failed. Please try again.';
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.data?.error) {
        message = (err as any).response.data.error;
      }
      setError(message);
      toast({
        title: 'Registration Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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
        <label className="block mb-1">Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={isLoading}
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded font-semibold"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup;
