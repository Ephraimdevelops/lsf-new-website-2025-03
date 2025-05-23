
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

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  is_open: boolean;
  deadline?: string;
  organization?: string;
  location?: string;
  created_at: string;
  application_url?: string;
}

const AdminOpportunities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'job',
      status: 'open',
      deadline: '',
      organization: '',
      location: '',
      application_url: ''
    }
  });

  // Sample opportunities data
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Legal Officer Position',
      description: 'Join our team as a Legal Officer to provide direct legal assistance to communities in need.',
      type: 'job',
      status: 'open',
      is_open: true,
      deadline: '2024-02-15',
      organization: 'Legal Services Facility',
      location: 'Dar es Salaam',
      created_at: '2024-01-01',
      application_url: 'mailto:jobs@lsf.or.tz'
    },
    {
      id: '2',
      title: 'Community Paralegal Training Grant',
      description: 'Grant opportunity for organizations interested in training community paralegals.',
      type: 'grant',
      status: 'open',
      is_open: true,
      deadline: '2024-03-01',
      organization: 'LSF Grant Program',
      location: 'Tanzania-wide',
      created_at: '2024-01-10',
      application_url: 'mailto:grants@lsf.or.tz'
    }
  ]);

  const filteredOpportunities = opportunities.filter(opportunity => 
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    if (editingOpportunity) {
      // Update existing opportunity
      setOpportunities(opportunities.map(opp => 
        opp.id === editingOpportunity.id 
          ? { 
              ...opp, 
              ...data, 
              is_open: data.status === 'open' 
            }
          : opp
      ));
      toast({
        title: "Opportunity Updated",
        description: "The opportunity has been updated successfully.",
      });
    } else {
      // Create new opportunity
      const newOpportunity: Opportunity = {
        id: Date.now().toString(),
        ...data,
        is_open: data.status === 'open',
        created_at: new Date().toISOString().split('T')[0]
      };
      setOpportunities([...opportunities, newOpportunity]);
      toast({
        title: "Opportunity Created",
        description: "New opportunity has been created successfully.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingOpportunity(null);
    form.reset();
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
      application_url: opportunity.application_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
    toast({
      title: "Opportunity Deleted",
      description: "The opportunity has been deleted successfully.",
    });
  };

  const handleNewOpportunity = () => {
    setEditingOpportunity(null);
    form.reset();
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
                              <SelectItem value="internship">Internship</SelectItem>
                              <SelectItem value="volunteer">Volunteer</SelectItem>
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
                              <SelectItem value="draft">Draft</SelectItem>
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
                      name="application_url"
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
                  <TableRow key={opportunity.id}>
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
                      <span className={`text-xs px-2 py-1 rounded ${
                        opportunity.status === 'open' 
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
                          onClick={() => handleDelete(opportunity.id)}
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
