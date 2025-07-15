import { useEffect, useState } from 'react';
import axios from 'axios';

const StakeholderDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('auth-token');
        const res = await axios.get('/dashboard/stakeholder', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setProjects(res.data.projects || []);
      } catch (err) {
        setError('Failed to load stakeholder dashboard.');
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
      <h1 className="text-2xl font-bold mb-4">Stakeholder Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Projects</h2>
      {projects.length === 0 ? (
        <p>No projects assigned.</p>
      ) : (
        <table className="min-w-full border mt-2">
          <thead>
            <tr>
              <th className="border px-4 py-2">Project Name</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="border px-4 py-2">{p.project_name}</td>
                <td className="border px-4 py-2">{p.role}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2">{p.start_date}</td>
                <td className="border px-4 py-2">{p.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StakeholderDashboard; 