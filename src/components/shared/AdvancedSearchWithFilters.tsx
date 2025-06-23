
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Calendar, Tag, FileText, Users, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchFilter {
  type?: 'all' | 'news' | 'publications' | 'programs' | 'opportunities';
  category?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter) => void;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const AdvancedSearchWithFilters = ({
  onSearch,
  value,
  onChange,
  className,
  placeholder = "Search across all content..."
}: AdvancedSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    type: 'all',
    tags: []
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useDebounce(value, 300);

  // Sample suggestions based on content
  const availableSuggestions = [
    'legal aid services',
    'women\'s rights',
    'land rights',
    'climate justice',
    'access to justice',
    'community empowerment',
    'paralegal training',
    'mobile legal clinics',
    'gender equality',
    'environmental law'
  ];

  const availableTags = [
    'Human Rights',
    'Gender Justice',
    'Climate Change',
    'Land Rights',
    'Legal Aid',
    'Capacity Building',
    'Research',
    'Policy',
    'Community'
  ];

  useEffect(() => {
    if (debouncedSearch) {
      onSearch(debouncedSearch, filters);
      // Generate suggestions based on search term
      const filtered = availableSuggestions.filter(s => 
        s.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, filters, onSearch]);

  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (debouncedSearch) {
      onSearch(debouncedSearch, newFilters);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = filters.tags || [];
    if (!currentTags.includes(tag)) {
      handleFilterChange('tags', [...currentTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = filters.tags || [];
    handleFilterChange('tags', currentTags.filter(t => t !== tag));
  };

  const clearFilters = () => {
    setFilters({ type: 'all', tags: [] });
    if (debouncedSearch) {
      onSearch(debouncedSearch, { type: 'all', tags: [] });
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v && v !== 'all' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 pr-24 py-4 text-lg border-2 border-gray-200 focus:border-primary rounded-2xl shadow-lg"
        />
        
        {/* Filter Toggle */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X size={16} />
            </Button>
          )}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 relative",
                  activeFiltersCount > 0 && "bg-primary text-white"
                )}
              >
                <Filter size={16} />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-secondary-orange">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Content Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="publications">Publications</SelectItem>
                      <SelectItem value="programs">Programs</SelectItem>
                      <SelectItem value="opportunities">Opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(filters.tags || []).map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X size={12} className="ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.filter(tag => !(filters.tags || []).includes(tag)).map(tag => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => addTag(tag)}
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Suggestions</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => {
                    onChange(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Search size={14} className="inline mr-2 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.type && filters.type !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              <FileText size={12} className="mr-1" />
              {filters.type}
            </Badge>
          )}
          {(filters.tags || []).map(tag => (
            <Badge key={tag} variant="secondary">
              <Tag size={12} className="mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchWithFilters;
