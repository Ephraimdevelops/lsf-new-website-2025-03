import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const StakeholderDashboard = () => {
  // Reusing the same query for now. In a real app, this would be a specific query.
  const data = useQuery(api.users.getDashboardData);
  const loading = data === undefined;
  const error = data === null;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load stakeholder dashboard.</div>;

  const { user } = data;
  // Mock projects for now
  const projects = [
    {
      id: "1",
      title: "Community Outreach Program",
      description: "Funding and oversight for Q4 outreach.",
      status: "Active",
      startDate: "2023-10-01",
      endDate: "2023-12-31"
    },
    {
      id: "2",
      title: "Legal Aid Clinic Expansion",
      description: "Planning phase for new clinics in rural areas.",
      status: "Planning",
      startDate: "2024-01-15"
    }
  ];

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
                <td className="border px-4 py-2">{p.title}</td>
                <td className="border px-4 py-2">{p.description}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2">{p.startDate}</td>
                <td className="border px-4 py-2">{p.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StakeholderDashboard; 