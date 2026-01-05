import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const ParalegalDashboard = () => {
  // Reusing the same query for now. In a real app, this would be a specific query.
  const data = useQuery(api.users.getDashboardData);
  const loading = data === undefined;
  const error = data === null;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load paralegal dashboard.</div>;

  const { user } = data;
  // Mock cases for now since we don't have them in the query yet
  const cases = [
    {
      id: "1",
      title: "Land Dispute - Case #123",
      description: "Dispute over boundary lines in Village A.",
      status: "Open",
      clientName: "John Doe",
      dateOpened: "2023-11-15"
    },
    {
      id: "2",
      title: "Family Law - Case #124",
      description: "Child custody assistance.",
      status: "In Progress",
      clientName: "Jane Smith",
      dateOpened: "2023-11-20"
    }
  ];

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