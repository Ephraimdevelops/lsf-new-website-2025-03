import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabaseService';
import { useToast } from './useToast';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  type: 'team' | 'board';
  order?: number;
}

interface UseTeamMembersResult {
  teamMembers: TeamMember[];
  boardMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTeamMembers(): UseTeamMembersResult {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [boardMembers, setBoardMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getAllTeamMembers();
      
      // Separate team members and board members
      const team = data.filter((member: TeamMember) => member.type === 'team');
      const board = data.filter((member: TeamMember) => member.type === 'board');
      
      setTeamMembers(team);
      setBoardMembers(board);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
      toast({
        title: 'Error',
        description: 'Failed to fetch team members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    boardMembers,
    loading,
    error,
    refetch: fetchTeamMembers,
  };
}
