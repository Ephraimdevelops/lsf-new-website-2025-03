import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const roles = ['admin', 'staff', 'paralegal', 'stakeholder'];

const AdminUserManagement = () => {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/users');
        setUsers(res.data.users);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleSave = async (id: string, role: string) => {
    setSaving(id);
    try {
      await api.patch(`/users/${id}/role`, { role });
    } catch (err) {
      alert('Failed to update role.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role || ''}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-primary text-white px-3 py-1 rounded"
                  onClick={() => handleSave(user.id, user.role)}
                  disabled={saving === user.id}
                >
                  {saving === user.id ? 'Saving...' : 'Save'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement; 