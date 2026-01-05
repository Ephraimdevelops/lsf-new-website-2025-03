import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const StaffDashboard = () => {
  const data = useQuery(api.users.getDashboardData);
  const loading = data === undefined;
  const error = data === null; // In case of null return (though our query throws)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load staff dashboard.</div>;

  const { user, tasks } = data;

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
                <td className="border px-4 py-2">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffDashboard; 