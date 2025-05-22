
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Publication {
  id: string;
  title: string;
  type: string;
  date: string;
  downloadUrl: string;
}

const AdminPublications = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample publications data
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "annual-report-2023",
      title: "Annual Report 2023: Impact and Progress in Legal Aid Delivery",
      type: "Report",
      date: "2023-03-15",
      downloadUrl: "/publications/annual-report-2023.pdf"
    },
    {
      id: "womens-land-rights",
      title: "Women's Land Rights in Tanzania: Challenges and Opportunities",
      type: "Research",
      date: "2023-01-20",
      downloadUrl: "/publications/womens-land-rights.pdf"
    },
    {
      id: "digital-legal-services",
      title: "Digital Legal Services: Best Practices and Lessons Learned",
      type: "Guide",
      date: "2022-11-10",
      downloadUrl: "/publications/digital-legal-services.pdf"
    },
    {
      id: "policy-brief-climate-justice",
      title: "Policy Brief: Climate Justice and Legal Empowerment",
      type: "Brief",
      date: "2022-10-05",
      downloadUrl: "/publications/policy-brief-climate-justice.pdf"
    },
    {
      id: "legal-aid-handbook",
      title: "Legal Aid Handbook for Community Paralegals",
      type: "Manual",
      date: "2022-08-22",
      downloadUrl: "/publications/legal-aid-handbook.pdf"
    }
  ]);

  const filteredPublications = publications.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(item => item.id !== id));
    toast({
      title: "Publication Deleted",
      description: "The publication has been deleted successfully.",
    });
  };

  const handleEditPublication = (id: string) => {
    // In a real application, this would open an edit form
    toast({
      title: "Edit Publication",
      description: `Editing publication: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold font-panton">Publications Management</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search publications..."
              className="pl-8 font-calibri"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="shrink-0 gap-1 font-calibri">
            <Plus size={16} /> Add Publication
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPublications.length > 0 ? (
              filteredPublications.map(publication => (
                <div key={publication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium font-calibri">{publication.title}</h3>
                    <p className="text-sm text-gray-500 font-calibri">
                      {publication.type} • Published: {new Date(publication.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(publication.downloadUrl, '_blank')}
                    >
                      <Download size={14} className="mr-1" /> Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPublication(publication.id)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeletePublication(publication.id)}
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 font-calibri">
                No publications found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPublications;
