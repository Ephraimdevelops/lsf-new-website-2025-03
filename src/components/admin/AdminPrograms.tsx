
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

const AdminPrograms = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample programs data
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: "legal-empowerment",
      title: "Legal Empowerment",
      description: "Supporting communities through free legal assistance and paralegal training",
      status: "active"
    },
    {
      id: "gender-justice",
      title: "Gender Justice",
      description: "Supporting women to access justice and secure their legal rights",
      status: "active"
    },
    {
      id: "climate-justice",
      title: "Climate Justice",
      description: "Addressing climate change impacts through legal frameworks",
      status: "active"
    },
    {
      id: "digital-transformation",
      title: "Digital Transformation",
      description: "Leveraging technology to improve access to justice",
      status: "active"
    }
  ]);

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter(program => program.id !== id));
    toast({
      title: "Program Deleted",
      description: "The program has been deleted successfully.",
    });
  };

  const handleEditProgram = (id: string) => {
    // In a real application, this would open an edit form
    toast({
      title: "Edit Program",
      description: `Editing program: ${id}`,
    });
  };

  const handleToggleStatus = (id: string) => {
    setPrograms(programs.map(program => 
      program.id === id 
        ? { ...program, status: program.status === 'active' ? 'inactive' : 'active' } 
        : program
    ));
    
    const program = programs.find(p => p.id === id);
    const newStatus = program?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `Program ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `The program has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`,
    });
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
          <Button className="shrink-0 gap-1 font-calibri">
            <Plus size={16} /> Add Program
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map(program => (
                <div key={program.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium font-calibri">{program.title}</h3>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-calibri mt-1">{program.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleStatus(program.id)}
                    >
                      {program.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProgram(program.id)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteProgram(program.id)}
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 font-calibri">
                No programs found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrograms;
