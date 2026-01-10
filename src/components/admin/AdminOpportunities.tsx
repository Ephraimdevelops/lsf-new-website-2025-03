
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Opportunity {
  _id: Id<"opportunities">;
  title: string;
  description: string;
  type: "job" | "grant" | "tender" | "consultancy" | "other";
  status: "open" | "closed";
  deadline: string;
  location: string;
  organization?: string; // Not in schema but in UI
  applicationLink?: string;
  category: string;
  department: string;
  duration: string;
  salary: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
}

const AdminOpportunities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const opportunities = useQuery(api.opportunities.get) || [];
  const createOpportunity = useMutation(api.opportunities.create);
  const updateOpportunity = useMutation(api.opportunities.update);
  const deleteOpportunity = useMutation(api.opportunities.remove);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'job',
      status: 'open',
      deadline: '',
      organization: '',
      location: '',
      applicationLink: '',
      category: 'General',
      department: 'General',
      duration: 'N/A',
      salary: 'Competitive',
      requirements: '',
      responsibilities: '',
      benefits: ''
    }
  });

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: any) => {
    try {
      // Parse arrays from textarea (one item per line)
      const parseLines = (text: string) =>
        text.split('\n').map(s => s.trim()).filter(s => s.length > 0);

      const payload = {
        title: data.title,
        description: data.description,
        type: data.type as "job" | "grant" | "tender" | "consultancy" | "other",
        status: data.status as "open" | "closed",
        deadline: data.deadline,
        location: data.location,
        applicationLink: data.applicationLink || undefined,
        category: data.category,
        department: data.department,
        duration: data.duration,
        salary: data.salary,
        requirements: data.requirements ? parseLines(data.requirements) : undefined,
        responsibilities: data.responsibilities ? parseLines(data.responsibilities) : undefined,
        benefits: data.benefits ? parseLines(data.benefits) : undefined,
      };

      if (editingOpportunity) {
        await updateOpportunity({
          id: editingOpportunity._id,
          ...payload
        });
        toast({ title: 'Opportunity Updated' });
      } else {
        await createOpportunity(payload);
        toast({ title: 'Opportunity Created' });
      }
      setIsDialogOpen(false);
      setEditingOpportunity(null);
      form.reset();
    } catch (err) {
      console.error('Save opportunity error:', err);
      toast({ title: 'Failed to save opportunity', variant: 'destructive' });
    }
  };

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    form.reset({
      title: opportunity.title,
      description: opportunity.description,
      type: opportunity.type,
      status: opportunity.status,
      deadline: opportunity.deadline || '',
      organization: opportunity.organization || '',
      location: opportunity.location || '',
      applicationLink: opportunity.applicationLink || '',
      category: opportunity.category || 'General',
      department: opportunity.department || 'General',
      duration: opportunity.duration || 'N/A',
      salary: opportunity.salary || 'Competitive',
      requirements: (opportunity.requirements || []).join('\n'),
      responsibilities: (opportunity.responsibilities || []).join('\n'),
      benefits: (opportunity.benefits || []).join('\n')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"opportunities">) => {
    try {
      await deleteOpportunity({ id });
      toast({ title: 'Opportunity Deleted' });
    } catch (err) {
      console.error('Delete opportunity error:', err);
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleNewOpportunity = () => {
    setEditingOpportunity(null);
    form.reset({
      title: '',
      description: '',
      type: 'job',
      status: 'open',
      deadline: '',
      organization: '',
      location: '',
      applicationLink: '',
      category: 'General',
      department: 'General',
      duration: 'N/A',
      salary: 'Competitive',
      requirements: '',
      responsibilities: '',
      benefits: ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold font-panton">Opportunities Management</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search opportunities..."
              className="pl-8 font-calibri"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewOpportunity} className="shrink-0 gap-1 font-calibri">
                <Plus size={16} /> Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Opportunity title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Opportunity description" rows={4} {...field} />
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
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="job">Job</SelectItem>
                              <SelectItem value="grant">Grant</SelectItem>
                              <SelectItem value="tender">Tender</SelectItem>
                              <SelectItem value="consultancy">Consultancy</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicationLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Application link or email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Employment" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Legal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Array Fields Section */}
                  <div className="space-y-4 border-t pt-4 mt-4">
                    <h4 className="font-medium text-sm text-gray-500">Requirements, Responsibilities & Benefits (one per line)</h4>

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter each requirement on a new line, e.g:&#10;3+ years experience&#10;Bachelor's degree&#10;Strong communication skills"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="responsibilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsibilities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter each responsibility on a new line, e.g:&#10;Lead the legal team&#10;Draft policy documents&#10;Coordinate with stakeholders"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="benefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Benefits</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter each benefit on a new line, e.g:&#10;Competitive salary&#10;Health insurance&#10;Professional development"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingOpportunity ? 'Update' : 'Create'} Opportunity
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map(opportunity => (
                  <TableRow key={opportunity._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{opportunity.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {opportunity.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {opportunity.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${opportunity.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : opportunity.status === 'closed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {opportunity.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {opportunity.deadline ? (
                        <div className="flex items-center text-sm">
                          <Calendar size={14} className="mr-1" />
                          {opportunity.deadline}
                        </div>
                      ) : (
                        <span className="text-gray-400">No deadline</span>
                      )}
                    </TableCell>
                    <TableCell>{opportunity.location || 'Not specified'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(opportunity)}
                        >
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(opportunity._id)}
                        >
                          <Trash size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No opportunities found matching your search.
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

export default AdminOpportunities;
