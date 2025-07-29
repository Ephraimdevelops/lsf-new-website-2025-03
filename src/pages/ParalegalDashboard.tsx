import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const ParalegalDashboard = () => {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
  }

  interface Case {
    id: string;
    title: string;
    description: string;
    status: string;
    clientName: string;
    dateOpened: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/dashboard/paralegal');
        setUser(res.data.user);
        setCases(res.data.cases || []);
      } catch (err) {
        setError('Failed to load paralegal dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Paralegal Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Cases</h2>
      {cases.length === 0 ? (
        <p>No cases assigned.</p>
      ) : (
        <table className="min-w-full border mt-2">
          <thead>
            <tr>
              <th className="border px-4 py-2">Case Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Opened At</th>
              <th className="border px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td className="border px-4 py-2">{c.title}</td>
                <td className="border px-4 py-2">{c.status}</td>
                <td className="border px-4 py-2">{c.dateOpened}</td>
                <td className="border px-4 py-2">{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParalegalDashboard; 