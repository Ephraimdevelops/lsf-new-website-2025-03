import { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('auth-token');
        const res = await axios.get('/dashboard/staff', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError('Failed to load staff dashboard.');
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
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="min-w-full border mt-2">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">{task.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffDashboard; 