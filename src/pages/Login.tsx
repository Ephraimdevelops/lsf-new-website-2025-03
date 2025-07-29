import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      const { session, user } = res.data;
      localStorage.setItem('auth-token', session.access_token);
      localStorage.setItem('user-role', user.user_metadata?.role || '');
      navigate('/admin');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-900">Login</h2>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-900 to-red-800 text-white py-2 rounded-lg font-semibold hover:from-red-800 hover:to-red-700 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
