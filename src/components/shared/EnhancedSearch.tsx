
import { useState, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'news' | 'publication' | 'program';
  excerpt: string;
  url: string;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  value: string;
  onChange: (value: string) => void;
  showSuggestions?: boolean;
  isLoading?: boolean;
  className?: string;
}

const EnhancedSearch = ({ 
  placeholder = "Search...", 
  onSearch, 
  value, 
  onChange,
  showSuggestions = true,
  isLoading = false,
  className 
}: EnhancedSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions] = useState<string[]>([
    "Legal aid services",
    "Women's rights",
    "Land rights",
    "Access to justice",
    "Community empowerment"
  ]);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim()) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent searches:', error);
      }
      onChange(searchTerm);
      setIsFocused(false);
    }
  }, [recentSearches, onChange]);

  const clearSearch = () => {
    onChange('');
    setIsFocused(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn(
        "relative transition-all duration-300",
        isFocused ? 'transform scale-105' : ''
      )}>
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="animate-spin text-gray-400" size={20} />
          ) : (
            <Search className="text-gray-400 transition-colors duration-200" size={20} />
          )}
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          className={cn(
            "pl-14 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 shadow-lg bg-white text-lg",
            isFocused 
              ? 'border-primary ring-4 ring-primary/20 shadow-xl' 
              : 'border-gray-200 hover:border-gray-300'
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(value);
            }
          }}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={clearSearch}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden animate-fade-in">
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Recent Searches</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Popular Searches</span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                  onClick={() => handleSearch(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
