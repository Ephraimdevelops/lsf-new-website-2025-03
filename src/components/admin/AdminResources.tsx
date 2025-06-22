
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, Search, Edit, Trash, Download, FileText, Users, 
  Calendar, Tag, MoreHorizontal, Upload, Link as LinkIcon 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  type: 'publication' | 'guide' | 'toolkit' | 'form' | 'template';
  category: string;
  description: string;
  fileSize?: string;
  downloadCount: number;
  uploadDate: string;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
}

const AdminResources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sample resources data
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Legal Aid Service Delivery Manual',
      type: 'guide',
      category: 'Legal Aid',
      description: 'Comprehensive guide for legal aid providers on service delivery standards.',
      fileSize: '2.5 MB',
      downloadCount: 234,
      uploadDate: '2023-11-15',
      status: 'published',
      tags: ['manual', 'service delivery', 'legal aid']
    },
    {
      id: '2',
      title: 'Community Paralegal Training Toolkit',
      type: 'toolkit',
      category: 'Capacity Building',
      description: 'Complete training materials for community paralegal certification.',
      fileSize: '15.8 MB',
      downloadCount: 189,
      uploadDate: '2023-10-20',
      status: 'published',
      tags: ['training', 'paralegal', 'community']
    },
    {
      id: '3',
      title: 'Gender Justice Assessment Framework',
      type: 'template',
      category: 'Gender Justice',
      description: 'Framework for assessing gender justice initiatives in communities.',
      fileSize: '1.2 MB',
      downloadCount: 156,
      uploadDate: '2023-09-08',
      status: 'published',
      tags: ['assessment', 'gender', 'framework']
    },
    {
      id: '4',
      title: 'Climate Justice Policy Brief Template',
      type: 'template',
      category: 'Climate Justice',
      description: 'Template for creating policy briefs on climate justice issues.',
      fileSize: '856 KB',
      downloadCount: 98,
      uploadDate: '2023-08-14',
      status: 'draft',
      tags: ['policy', 'climate', 'template']
    }
  ]);

  const categories = ['all', 'Legal Aid', 'Capacity Building', 'Gender Justice', 'Climate Justice'];
  const types = ['all', 'publication', 'guide', 'toolkit', 'form', 'template'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    toast({
      title: "Resource Deleted",
      description: "The resource has been deleted successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      publication: 'bg-blue-100 text-blue-800',
      guide: 'bg-green-100 text-green-800',
      toolkit: 'bg-purple-100 text-purple-800',
      form: 'bg-orange-100 text-orange-800',
      template: 'bg-pink-100 text-pink-800'
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-panton">Resource Management</h2>
          <p className="text-sm text-gray-600 font-calibri">
            Manage downloadable resources, guides, and documents
          </p>
        </div>
        <Button className="shrink-0 gap-2 font-calibri">
          <Plus size={16} /> Add Resource
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-calibri">Total Resources</p>
                <p className="text-2xl font-bold">{resources.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-calibri">Total Downloads</p>
                <p className="text-2xl font-bold">
                  {resources.reduce((sum, r) => sum + r.downloadCount, 0).toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-secondary-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-calibri">Published</p>
                <p className="text-2xl font-bold">
                  {resources.filter(r => r.status === 'published').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-secondary-teal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-calibri">Categories</p>
                <p className="text-2xl font-bold">
                  {new Set(resources.map(r => r.category)).size}
                </p>
              </div>
              <Tag className="h-8 w-8 text-secondary-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8 font-calibri"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md font-calibri"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-md font-calibri"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">
            Resources ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold font-calibri">Title</TableHead>
                  <TableHead className="font-semibold font-calibri">Type</TableHead>
                  <TableHead className="font-semibold font-calibri">Category</TableHead>
                  <TableHead className="font-semibold font-calibri">Downloads</TableHead>
                  <TableHead className="font-semibold font-calibri">Status</TableHead>
                  <TableHead className="font-semibold font-calibri">Date</TableHead>
                  <TableHead className="text-right font-semibold font-calibri">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium font-calibri">{resource.title}</div>
                          <div className="text-sm text-gray-500 font-calibri line-clamp-1">
                            {resource.description}
                          </div>
                          <div className="flex gap-1">
                            {resource.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs font-calibri">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(resource.type)}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {resource.category}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span className="font-calibri">{resource.downloadCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(resource.status)}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {new Date(resource.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="font-calibri">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-calibri">
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Get Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-calibri">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-600 font-calibri"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <span className="text-gray-500 font-calibri">No resources found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResources;
