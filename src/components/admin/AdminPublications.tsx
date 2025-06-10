
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Download, 
  Filter, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Copy,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import PublicationForm from './PublicationForm';

interface Publication {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  downloadUrl: string;
  fileSize?: string;
  tags?: string[];
  author?: string;
  language?: string;
  category?: string;
  status?: 'published' | 'draft' | 'archived';
}

type SortField = 'title' | 'type' | 'date' | 'author';
type SortDirection = 'asc' | 'desc';

const AdminPublications = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  // Sample publications data with enhanced fields
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "annual-report-2023",
      title: "Annual Report 2023: Impact and Progress in Legal Aid Delivery",
      description: "A comprehensive report detailing LSF's activities, achievements, and impact across Tanzania during the 2023 fiscal year.",
      type: "Report",
      date: "2023-03-15",
      downloadUrl: "/publications/annual-report-2023.pdf",
      fileSize: "3.2 MB",
      author: "LSF Research Team",
      category: "Legal Aid",
      tags: ["annual report", "impact", "Tanzania"],
      status: "published" as const,
      language: "English"
    },
    {
      id: "womens-land-rights",
      title: "Women's Land Rights in Tanzania: Challenges and Opportunities",
      description: "A research study examining the status of women's land rights in Tanzania, identifying key challenges and proposing strategies for improvement.",
      type: "Research",
      date: "2023-01-20",
      downloadUrl: "/publications/womens-land-rights.pdf",
      fileSize: "2.8 MB",
      author: "Dr. Amina Hassan",
      category: "Gender Justice",
      tags: ["women rights", "land rights", "research"],
      status: "published" as const,
      language: "English"
    },
    {
      id: "digital-legal-services",
      title: "Digital Legal Services: Best Practices and Lessons Learned",
      description: "A guide exploring effective approaches to implementing digital legal services in rural and underserved communities based on LSF's experience.",
      type: "Guide",
      date: "2022-11-10",
      downloadUrl: "/publications/digital-legal-services.pdf",
      fileSize: "4.5 MB",
      author: "Technology Team",
      category: "Digital Innovation",
      tags: ["digital services", "technology", "best practices"],
      status: "published" as const,
      language: "English"
    },
    {
      id: "policy-brief-climate-justice",
      title: "Policy Brief: Climate Justice and Legal Empowerment",
      description: "A concise policy brief outlining key recommendations for integrating climate justice considerations into legal empowerment initiatives.",
      type: "Brief",
      date: "2022-10-05",
      downloadUrl: "/publications/policy-brief-climate-justice.pdf",
      fileSize: "1.5 MB",
      author: "Policy Team",
      category: "Climate Justice",
      tags: ["climate justice", "policy", "environment"],
      status: "published" as const,
      language: "English"
    },
    {
      id: "legal-aid-handbook",
      title: "Legal Aid Handbook for Community Paralegals",
      description: "A comprehensive manual providing guidance and resources for community paralegals working in rural and underserved areas of Tanzania.",
      type: "Manual",
      date: "2022-08-22",
      downloadUrl: "/publications/legal-aid-handbook.pdf",
      fileSize: "5.1 MB",
      author: "Training Department",
      category: "Capacity Building",
      tags: ["training", "paralegals", "manual"],
      status: "published" as const,
      language: "English"
    }
  ]);

  // Get unique values for filters
  const types = ['all', ...Array.from(new Set(publications.map(pub => pub.type)))];
  const categories = ['all', ...Array.from(new Set(publications.map(pub => pub.category).filter(Boolean)))];
  const statuses = ['all', 'published', 'draft', 'archived'];

  // Filtering and sorting logic
  const filteredAndSortedPublications = publications
    .filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || pub.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (sortField) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'author':
          aValue = a.author || '';
          bValue = b.author || '';
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredAndSortedPublications.map(pub => pub.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  // Action handlers
  const handleCreatePublication = () => {
    setEditingPublication(undefined);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
    setSelectedItems(selectedItems.filter(item => item !== id));
    toast({
      title: "Publication Deleted",
      description: "The publication has been deleted successfully.",
    });
  };

  const handleBulkDelete = () => {
    setPublications(publications.filter(pub => !selectedItems.includes(pub.id)));
    setSelectedItems([]);
    toast({
      title: "Publications Deleted",
      description: `${selectedItems.length} publications have been deleted.`,
    });
  };

  const handleBulkArchive = () => {
    setPublications(publications.map(pub => 
      selectedItems.includes(pub.id) ? { ...pub, status: 'archived' as const } : pub
    ));
    setSelectedItems([]);
    toast({
      title: "Publications Archived",
      description: `${selectedItems.length} publications have been archived.`,
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFormSubmit = (publicationData: Publication) => {
    if (formMode === 'create') {
      setPublications([...publications, publicationData]);
    } else {
      setPublications(publications.map(pub => 
        pub.id === publicationData.id ? publicationData : pub
      ));
    }
    setShowForm(false);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-panton">Publications Management</h2>
          <p className="text-sm text-gray-600 font-calibri">
            Manage and organize your publication library
          </p>
        </div>
        <Button onClick={handleCreatePublication} className="shrink-0 gap-2 font-calibri">
          <Plus size={16} /> Add Publication
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search publications, authors, tags..."
                  className="pl-8 font-calibri"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="font-calibri">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type} className="font-calibri">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="font-calibri">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="font-calibri">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="font-calibri">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} className="font-calibri">
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium font-calibri">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkArchive}
                  className="font-calibri"
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50 font-calibri"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-panton">
              Publications ({filteredAndSortedPublications.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredAndSortedPublications.length && filteredAndSortedPublications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('title')}
                    >
                      Title {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('type')}
                    >
                      Type {getSortIcon('type')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('author')}
                    >
                      Author {getSortIcon('author')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('date')}
                    >
                      Date {getSortIcon('date')}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold font-calibri">Status</TableHead>
                  <TableHead className="font-semibold font-calibri">Tags</TableHead>
                  <TableHead className="text-right font-semibold font-calibri">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPublications.length > 0 ? (
                  filteredAndSortedPublications.map((publication) => (
                    <TableRow key={publication.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(publication.id)}
                          onCheckedChange={(checked) => handleSelectItem(publication.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium font-calibri line-clamp-1">
                            {publication.title}
                          </div>
                          <div className="text-sm text-gray-500 font-calibri line-clamp-2">
                            {publication.description}
                          </div>
                          {publication.fileSize && (
                            <div className="text-xs text-gray-400 font-calibri">
                              {publication.fileSize}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-calibri">
                          {publication.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-calibri">
                        {publication.author || 'Unknown'}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {new Date(publication.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(publication.status || 'published')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {publication.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs font-calibri">
                              {tag}
                            </Badge>
                          ))}
                          {publication.tags && publication.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs font-calibri">
                              +{publication.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="font-calibri">Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => window.open(publication.downloadUrl, '_blank')}
                              className="font-calibri"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditPublication(publication)}
                              className="font-calibri"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-calibri">
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePublication(publication.id)}
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
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <span className="text-gray-500 font-calibri">No publications found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Publication Form Modal */}
      <PublicationForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        publication={editingPublication}
        mode={formMode}
      />
    </div>
  );
};

export default AdminPublications;
