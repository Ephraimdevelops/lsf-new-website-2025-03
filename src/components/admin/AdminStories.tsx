
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    FileText,
    MoreHorizontal,
    MapPin,
    User
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
import StoryForm from './StoryForm';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Story {
    _id: Id<"success_stories">;
    title: string;
    story: string;
    personName: string;
    location: string;
    imageUrl: string;
    programId?: string;
    featured?: boolean;
}

type SortField = 'title' | 'personName' | 'location';
type SortDirection = 'asc' | 'desc';

const AdminStories = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('title');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedItems, setSelectedItems] = useState<Id<"success_stories">[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStory, setEditingStory] = useState<Story | undefined>();
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const stories = useQuery(api.stories.get) || [];
    const deleteStory = useMutation(api.stories.remove);

    // Filtering and sorting logic
    const filteredAndSortedStories = stories
        .filter(story => {
            const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.location.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            let aValue: string = '';
            let bValue: string = '';

            switch (sortField) {
                case 'title':
                    aValue = a.title;
                    bValue = b.title;
                    break;
                case 'personName':
                    aValue = a.personName;
                    bValue = b.personName;
                    break;
                case 'location':
                    aValue = a.location;
                    bValue = b.location;
                    break;
                default:
                    return 0;
            }

            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(filteredAndSortedStories.map(story => story._id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: Id<"success_stories">, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(item => item !== id));
        }
    };

    // Action handlers
    const handleCreateStory = () => {
        setEditingStory(undefined);
        setFormMode('create');
        setShowForm(true);
    };

    const handleEditStory = (story: Story) => {
        setEditingStory(story);
        setFormMode('edit');
        setShowForm(true);
    };

    const handleDeleteStory = async (id: Id<"success_stories">) => {
        try {
            await deleteStory({ id });
            setSelectedItems(selectedItems.filter(item => item !== id));
            toast({
                title: "Story Deleted",
                description: "The story has been deleted successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete story.",
                variant: "destructive"
            });
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedItems.map(id => deleteStory({ id })));
            setSelectedItems([]);
            toast({
                title: "Stories Deleted",
                description: `${selectedItems.length} stories have been deleted.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete some stories.",
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
                    <h2 className="text-2xl font-bold font-panton">Success Stories / Our Heroes</h2>
                    <p className="text-sm text-gray-600 font-calibri">
                        Manage testimonials and success stories from the field
                    </p>
                </div>
                <Button onClick={handleCreateStory} className="shrink-0 gap-2 font-calibri">
                    <Plus size={16} /> Add Story
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-panton">Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search stories, people, locations..."
                            className="pl-8 font-calibri"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

            {/* Stories Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-panton">
                            Stories ({filteredAndSortedStories.length})
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
                                            checked={selectedItems.length === filteredAndSortedStories.length && filteredAndSortedStories.length > 0}
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
                                            onClick={() => handleSort('personName')}
                                        >
                                            Person {getSortIcon('personName')}
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="h-auto p-0 font-semibold font-calibri hover:bg-transparent"
                                            onClick={() => handleSort('location')}
                                        >
                                            Location {getSortIcon('location')}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="font-semibold font-calibri">Featured</TableHead>
                                    <TableHead className="text-right font-semibold font-calibri">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedStories.length > 0 ? (
                                    filteredAndSortedStories.map((story) => (
                                        <TableRow key={story._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.includes(story._id)}
                                                    onCheckedChange={(checked) => handleSelectItem(story._id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium font-calibri line-clamp-1">
                                                        {story.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-calibri line-clamp-2">
                                                        {story.story}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-calibri">
                                                    <User className="h-3 w-3 text-gray-400" />
                                                    {story.personName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-calibri">
                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                    {story.location}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {story.featured && (
                                                    <Badge variant="secondary" className="font-calibri">Featured</Badge>
                                                )}
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
                                                            onClick={() => handleEditStory(story)}
                                                            className="font-calibri"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteStory(story._id)}
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
                                                <span className="text-gray-500 font-calibri">No stories found</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Story Form Modal */}
            <StoryForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={() => setShowForm(false)}
                story={editingStory}
                mode={formMode}
            />
        </div>
    );
};

export default AdminStories;
