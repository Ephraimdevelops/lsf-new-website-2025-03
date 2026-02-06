import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  type: 'team' | 'board' | 'agm';
  order?: number;
}

interface UseTeamMembersResult {
  teamMembers: TeamMember[];
  boardMembers: TeamMember[];
  agmMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTeamMembers(): UseTeamMembersResult {
  const teamData = useQuery(api.team.get);

  const allMembers = (teamData || []).map((item: any) => ({ ...item, id: item._id }));

  const teamMembers = allMembers.filter((m: TeamMember) => m.type === 'team');
  const boardMembers = allMembers.filter((m: TeamMember) => m.type === 'board');
  const agmMembers = allMembers.filter((m: TeamMember) => m.type === 'agm');

  const loading = teamData === undefined;

  return {
    teamMembers,
    boardMembers,
    agmMembers,
    loading,
    error: null,
    refetch: async () => { },
  };
}

