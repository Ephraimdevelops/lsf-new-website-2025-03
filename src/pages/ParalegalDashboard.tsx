import { useEffect, useState } from 'react';
import axios from 'axios';

const ParalegalDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('auth-token');
        const res = await axios.get('/dashboard/paralegal', {
          headers: { Authorization: `Bearer ${token}` },
        });
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
                <td className="border px-4 py-2">{c.case_title}</td>
                <td className="border px-4 py-2">{c.case_status}</td>
                <td className="border px-4 py-2">{c.opened_at}</td>
                <td className="border px-4 py-2">{c.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParalegalDashboard; 