import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash, Linkedin, Mail, Twitter, Users, Crown, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface TeamMember {
    _id: Id<"team_members">;
    name: string;
    position: string;
    bio: string;
    image: string;
    quote?: string;
    linkedin?: string;
    email?: string;
    twitter?: string;
    type: "team" | "board";
    order?: number;
}

const AdminTeam = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'team' | 'board'>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const teamMembers = useQuery(api.team.get) || [];
    const createMember = useMutation(api.team.create);
    const updateMember = useMutation(api.team.update);
    const deleteMember = useMutation(api.team.remove);

    const form = useForm({
        defaultValues: {
            name: '',
            position: '',
            bio: '',
            image: '',
            quote: '',
            linkedin: '',
            email: '',
            twitter: '',
            type: 'team' as 'team' | 'board',
            order: 1
        }
    });

    // Filter and search
    const filteredMembers = teamMembers
        .filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.position.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || member.type === filterType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => (a.order || 99) - (b.order || 99));

    const teamCount = teamMembers.filter(m => m.type === 'team').length;
    const boardCount = teamMembers.filter(m => m.type === 'board').length;

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                position: data.position,
                bio: data.bio,
                image: data.image || '/lovable-uploads/placeholder.svg',
                quote: data.quote || undefined,
                linkedin: data.linkedin || undefined,
                email: data.email || undefined,
                twitter: data.twitter || undefined,
                type: data.type as 'team' | 'board',
                order: Number(data.order) || 1
            };

            if (editingMember) {
                await updateMember({ id: editingMember._id, ...payload });
                toast({ title: 'Team member updated successfully' });
            } else {
                await createMember(payload);
                toast({ title: 'Team member created successfully' });
            }

            setIsDialogOpen(false);
            setEditingMember(null);
            form.reset();
        } catch (err) {
            console.error('Save team member error:', err);
            toast({ title: 'Failed to save team member', variant: 'destructive' });
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        form.reset({
            name: member.name,
            position: member.position,
            bio: member.bio,
            image: member.image,
            quote: member.quote || '',
            linkedin: member.linkedin || '',
            email: member.email || '',
            twitter: member.twitter || '',
            type: member.type,
            order: member.order || 1
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: Id<"team_members">) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            await deleteMember({ id });
            toast({ title: 'Team member deleted' });
        } catch (err) {
            console.error('Delete team member error:', err);
            toast({ title: 'Failed to delete', variant: 'destructive' });
        }
    };

    const handleNewMember = () => {
        setEditingMember(null);
        form.reset({
            name: '',
            position: '',
            bio: '',
            image: '',
            quote: '',
            linkedin: '',
            email: '',
            twitter: '',
            type: 'team',
            order: teamMembers.length + 1
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                    <p className="text-gray-500">Manage your team members and board of directors</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 items-center bg-primary/10 text-primary px-4 py-2 rounded-lg">
                        <Users size={18} />
                        <span className="font-medium">{teamCount} Staff</span>
                    </div>
                    <div className="flex gap-2 items-center bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-lg">
                        <Crown size={18} />
                        <span className="font-medium">{boardCount} Board</span>
                    </div>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search by name or position..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={(val: 'all' | 'team' | 'board') => setFilterType(val)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="team">Staff Only</SelectItem>
                        <SelectItem value="board">Board Only</SelectItem>
                    </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleNewMember} className="gap-2">
                            <Plus size={16} />
                            Add Team Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dr. John Doe" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position/Title *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Executive Director" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Biography *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief biography describing their role and experience..."
                                                    rows={4}
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://... or /lovable-uploads/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quote"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personal Quote (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="An inspirational quote from this team member that will appear on their profile page..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Member Type *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="team">Staff Member</SelectItem>
                                                        <SelectItem value="board">Board Member</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Order</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={1} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Social Links */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-700 mb-4">Social Links (Optional)</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Mail size={14} /> Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="john@lsftz.org" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="linkedin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Linkedin size={14} /> LinkedIn
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="linkedin.com/in/..." {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="twitter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Twitter size={14} /> Twitter
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="@handle" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingMember ? 'Update Member' : 'Add Member'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Team Members Table */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users size={20} />
                        Team Members ({filteredMembers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        <ArrowUpDown size={14} /> Order
                                    </div>
                                </TableHead>
                                <TableHead>Socials</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map(member => (
                                    <TableRow key={member._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={member.image} alt={member.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-gray-900">{member.name}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                                                        {member.bio.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{member.position}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${member.type === 'board'
                                                ? 'bg-secondary-orange/10 text-secondary-orange'
                                                : 'bg-primary/10 text-primary'
                                                }`}>
                                                {member.type === 'board' ? <Crown size={12} /> : <Users size={12} />}
                                                {member.type === 'board' ? 'Board' : 'Staff'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-600">{member.order || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {member.email && (
                                                    <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-primary transition-colors">
                                                        <Mail size={16} />
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Linkedin size={16} />
                                                    </a>
                                                )}
                                                {member.twitter && (
                                                    <a href={`https://twitter.com/${member.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors">
                                                        <Twitter size={16} />
                                                    </a>
                                                )}
                                                {!member.email && !member.linkedin && !member.twitter && (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                                                    <Edit size={14} className="mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleDelete(member._id)}
                                                >
                                                    <Trash size={14} className="mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                        <Users size={40} className="mx-auto mb-3 text-gray-300" />
                                        <p>No team members found</p>
                                        <p className="text-sm">Click "Add Team Member" to get started</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminTeam;
