import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, UserPlus, Shield, Ban, Trash2, Edit, Eye, Mail } from 'lucide-react';
import api from '@/lib/axios';

interface User {
  id: string;
  email: string;
  role: string;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  deleted_at: string | null;
}

interface UserStats {
  total: number;
  confirmed: number;
  unconfirmed: number;
  banned: number;
  deleted: number;
  byRole: {
    admin: number;
    staff: number;
    paralegal: number;
    stakeholder: number;
    user: number;
  };
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('stakeholder');
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { value: 'staff', label: 'Staff', color: 'bg-blue-100 text-blue-800' },
    { value: 'paralegal', label: 'Paralegal', color: 'bg-green-100 text-green-800' },
    { value: 'stakeholder', label: 'Stakeholder', color: 'bg-purple-100 text-purple-800' },
    { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-800' },
  ];

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users.');
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setSaving(userId);
      await api.patch(`/users/${userId}/role`, { role: newRole });
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to update role:', err);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      setSaving(userId);
      const banned_until = ban ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null; // 24 hours
      
      await api.patch(`/users/${userId}/ban`, { banned_until });
      
      setUsers(users.map(u => u.id === userId ? { ...u, banned_until } : u));
      
      toast({
        title: "Success",
        description: ban ? "User banned successfully" : "User unbanned successfully",
      });
      
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to ban user:', err);
      toast({
        title: "Error",
        description: "Failed to ban/unban user",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(userId);
      await api.delete(`/users/${userId}`);
      
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setInviting(true);
      await api.post('/users/invite', { email: inviteEmail, role: inviteRole });
      
      setInviteEmail('');
      setInviteRole('stakeholder');
      
      toast({
        title: "Success",
        description: "User invited successfully",
      });
      
      fetchUsers(); // Refresh users list
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Failed to invite user:', err);
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation email to a new user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleInviteUser} 
                disabled={inviting}
                className="w-full"
              >
                {inviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.banned}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byRole.admin}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      disabled={saving === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.email_confirmed_at ? (
                        <Badge variant="default">Confirmed</Badge>
                      ) : (
                        <Badge variant="secondary">Unconfirmed</Badge>
                      )}
                      {user.banned_until && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={user.banned_until ? "default" : "outline"}
                        onClick={() => handleBanUser(user.id, !user.banned_until)}
                        disabled={saving === user.id}
                      >
                        {user.banned_until ? "Unban" : "Ban"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={saving === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement; 