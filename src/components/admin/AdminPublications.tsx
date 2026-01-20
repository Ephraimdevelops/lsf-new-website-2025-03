
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
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
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Publication {
  _id: Id<"publications">;
  title: string;
  description: string;
  type: string;
  publishedDate: string;
  pdfUrl: string;
  coverImageUrl: string;
  category: string;
  authors?: string[];
  featured?: boolean;
  views?: number;
  downloadCount?: number;
}

type SortField = 'title' | 'type' | 'date' | 'author';
type SortDirection = 'asc' | 'desc';

const AdminPublications = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedItems, setSelectedItems] = useState<Id<"publications">[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const publications = useQuery(api.publications.get) || [];
  const deletePublication = useMutation(api.publications.remove);

  // Get unique values for filters
  const types = ['all', ...Array.from(new Set(publications.map(pub => pub.type)))];
  const categories = ['all', ...Array.from(new Set(publications.map(pub => pub.category).filter(Boolean)))];

  // Filtering and sorting logic
  const filteredAndSortedPublications = publications
    .filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors?.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || pub.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
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
          aValue = new Date(a.publishedDate).getTime();
          bValue = new Date(b.publishedDate).getTime();
          break;
        case 'author':
          aValue = a.authors?.[0] || '';
          bValue = b.authors?.[0] || '';
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
      setSelectedItems(filteredAndSortedPublications.map(pub => pub._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: Id<"publications">, checked: boolean) => {
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

  const handleDeletePublication = async (id: Id<"publications">) => {
    try {
      await deletePublication({ id });
      setSelectedItems(selectedItems.filter(item => item !== id));
      toast({
        title: "Publication Deleted",
        description: "The publication has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete publication.",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedItems.map(id => deletePublication({ id })));
      setSelectedItems([]);
      toast({
        title: "Publications Deleted",
        description: `${selectedItems.length} publications have been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some publications.",
        variant: "destructive"
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
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
                  placeholder="Search publications, authors..."
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
                  <TableHead className="font-semibold font-calibri">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('views' as any)}
                    >
                      Views
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold font-calibri">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                      onClick={() => handleSort('downloads' as any)}
                    >
                      Downloads
                    </Button>
                  </TableHead>
                  <TableHead className="text-right font-semibold font-calibri">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPublications.length > 0 ? (
                  filteredAndSortedPublications.map((publication) => (
                    <TableRow key={publication._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(publication._id)}
                          onCheckedChange={(checked) => handleSelectItem(publication._id, checked as boolean)}
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-calibri">
                          {publication.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-calibri">
                        {publication.authors?.join(', ') || 'Unknown'}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {new Date(publication.publishedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {publication.views || 0}
                      </TableCell>
                      <TableCell className="font-calibri">
                        {publication.downloadCount || 0}
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
                              onClick={() => window.open(publication.pdfUrl, '_blank')}
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePublication(publication._id)}
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
                    <TableCell colSpan={6} className="text-center py-8">
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
        onSubmit={() => setShowForm(false)}
        publication={editingPublication}
        mode={formMode}
      />
    </div>
  );
};

export default AdminPublications;
