
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface Program {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  startDate?: string;
  endDate?: string;
  location?: string[];
  objectives?: string[];
  approach?: string;
  beneficiaries?: {
    total?: number;
    women?: number;
    children?: number;
    disputes?: number;
  };
  geographicCoverage?: string[];
  results?: {
    title: string;
    value: string;
  }[];
  donors?: string[];
  partners?: string[];
  bestPractices?: string[];
}

const AdminPrograms = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      image: '',
      startDate: '',
      endDate: '',
      approach: '',
      beneficiaries: {
        total: 0,
        women: 0,
        children: 0,
        disputes: 0
      }
    }
  });

  const [locations, setLocations] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [geographicCoverage, setGeographicCoverage] = useState<string[]>([]);
  const [results, setResults] = useState<{title: string, value: string}[]>([]);
  const [donors, setDonors] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [bestPractices, setBestPractices] = useState<string[]>([]);

  // Sample programs data
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: "legal-empowerment",
      title: "Legal Empowerment",
      description: "Supporting communities through free legal assistance and paralegal training",
      status: "active",
      image: "/lovable-uploads/background with mother umage .png",
      startDate: "2020-01-01",
      endDate: "2025-12-31",
      location: ["Dar es Salaam", "Mwanza", "Arusha"],
      objectives: [
        "Train community paralegals in all 184 districts",
        "Establish legal aid centers in rural areas"
      ],
      approach: "Community-driven approach focusing on building local capacity",
      beneficiaries: {
        total: 150000,
        women: 90000,
        children: 45000,
        disputes: 12500
      },
      geographicCoverage: ["Dar es Salaam", "Mwanza", "Arusha"],
      results: [
        { title: "People Reached", value: "150,000+" },
        { title: "Paralegals Trained", value: "500+" }
      ],
      donors: ["USAID", "EU"],
      partners: ["Legal and Human Rights Centre"],
      bestPractices: ["Community-driven approach to legal empowerment"]
    }
  ]);

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
    }
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const addResult = (title: string, value: string) => {
    if (title.trim() && value.trim()) {
      setResults(prev => [...prev, { title: title.trim(), value: value.trim() }]);
    }
  };

  const removeResult = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    form.reset();
    setLocations([]);
    setObjectives([]);
    setGeographicCoverage([]);
    setResults([]);
    setDonors([]);
    setPartners([]);
    setBestPractices([]);
  };

  const onSubmit = (data: any) => {
    const programData: Program = {
      ...data,
      id: editingProgram?.id || Date.now().toString(),
      location: locations,
      objectives,
      geographicCoverage,
      results,
      donors,
      partners,
      bestPractices
    };

    if (editingProgram) {
      setPrograms(programs.map(prog => 
        prog.id === editingProgram.id ? programData : prog
      ));
      toast({
        title: "Program Updated",
        description: "The program has been updated successfully.",
      });
    } else {
      setPrograms([...programs, programData]);
      toast({
        title: "Program Created",
        description: "New program has been created successfully.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingProgram(null);
    resetForm();
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    form.reset({
      title: program.title,
      description: program.description,
      status: program.status,
      image: program.image || '',
      startDate: program.startDate || '',
      endDate: program.endDate || '',
      approach: program.approach || '',
      beneficiaries: program.beneficiaries || { total: 0, women: 0, children: 0, disputes: 0 }
    });
    setLocations(program.location || []);
    setObjectives(program.objectives || []);
    setGeographicCoverage(program.geographicCoverage || []);
    setResults(program.results || []);
    setDonors(program.donors || []);
    setPartners(program.partners || []);
    setBestPractices(program.bestPractices || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPrograms(programs.filter(program => program.id !== id));
    toast({
      title: "Program Deleted",
      description: "The program has been deleted successfully.",
    });
  };

  const handleNewProgram = () => {
    setEditingProgram(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold font-panton">Programs Management</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search programs..."
              className="pl-8 font-calibri"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProgram} className="shrink-0 gap-1 font-calibri">
                <Plus size={16} /> Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Program title" {...field} />
                            </FormControl>
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
                            <FormControl>
                              <select 
                                {...field} 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Program description" rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Locations</h3>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add location"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem(setLocations, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem(setLocations, input.value);
                          input.value = '';
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                          {location}
                          <X size={14} className="cursor-pointer" onClick={() => removeArrayItem(setLocations, index)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Objectives</h3>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add objective"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem(setObjectives, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem(setObjectives, input.value);
                          input.value = '';
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {objectives.map((objective, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                          <span className="text-sm">{objective}</span>
                          <X size={14} className="cursor-pointer text-red-500" onClick={() => removeArrayItem(setObjectives, index)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Beneficiaries */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Beneficiaries</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="beneficiaries.total"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="beneficiaries.women"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Women</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="beneficiaries.children"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Children</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="beneficiaries.disputes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disputes Resolved</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProgram ? 'Update' : 'Create'} Program
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
          <CardTitle className="text-lg font-panton">Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Beneficiaries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map(program => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{program.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {program.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        program.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {program.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {program.startDate && program.endDate ? (
                          <>
                            <div>{program.startDate}</div>
                            <div className="text-gray-500">to {program.endDate}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {program.beneficiaries?.total ? (
                        <div className="text-sm">
                          <div className="font-medium">{program.beneficiaries.total.toLocaleString()}</div>
                          <div className="text-gray-500">total beneficiaries</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(program)}
                        >
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No programs found matching your search.
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

export default AdminPrograms;
