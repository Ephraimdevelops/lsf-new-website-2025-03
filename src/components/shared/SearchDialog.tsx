
import { useState } from 'react';
import { Search, X, FileText, Users, BookOpen, MapPin, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced search suggestions with focus areas and approaches
  const searchSuggestions = [
    { icon: <Users className="h-4 w-4" />, title: 'Legal Aid Services', description: 'Get free legal assistance', href: '/legal-help', category: 'Services' },
    { icon: <BookOpen className="h-4 w-4" />, title: 'What We Do', description: 'Our strategic approach to justice', href: '/what-we-do', category: 'About' },
    { icon: <FileText className="h-4 w-4" />, title: 'Grant Making', description: 'Results-driven funding for justice', href: '/what-we-do/grant-making', category: 'Approaches' },
    { icon: <Users className="h-4 w-4" />, title: 'Capacity Building', description: 'Strengthening legal aid providers', href: '/what-we-do/capacity-building', category: 'Approaches' },
    { icon: <Zap className="h-4 w-4" />, title: 'Accessible Legal Aid', description: 'Quality legal services for all', href: '/focus-areas/accessible-legal-aid', category: 'Focus Areas' },
    { icon: <Users className="h-4 w-4" />, title: 'Empowered Communities', description: 'Legal empowerment programs', href: '/focus-areas/empowered-communities', category: 'Focus Areas' },
    { icon: <MapPin className="h-4 w-4" />, title: 'Climate Justice', description: 'Environmental rights advocacy', href: '/focus-areas/climate-justice', category: 'Focus Areas' },
    { icon: <Zap className="h-4 w-4" />, title: 'Digital Transformation', description: 'Technology solutions for justice', href: '/focus-areas/digital-transformation', category: 'Focus Areas' },
    { icon: <BookOpen className="h-4 w-4" />, title: 'Success Stories', description: 'Real impact, real lives', href: '/heroes', category: 'Impact' },
    { icon: <FileText className="h-4 w-4" />, title: 'Publications', description: 'Research and reports', href: '/publications', category: 'Resources' },
    { icon: <Users className="h-4 w-4" />, title: 'Policy & Advocacy', description: 'Systemic change initiatives', href: '/what-we-do/policy-advocacy', category: 'Approaches' },
    { icon: <MapPin className="h-4 w-4" />, title: 'Learning & Research', description: 'Evidence-based solutions', href: '/learning-research', category: 'Approaches' },
  ];

  const filteredSuggestions = searchQuery 
    ? searchSuggestions.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions.slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsOpen(false);
  };

  const handleSuggestionClick = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 rounded-full text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-200 transform hover:scale-110"
          aria-label="Search"
        >
          <Search size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">Search LSF</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Input */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for programs, services, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 text-base border-2 border-gray-200 focus:border-primary rounded-lg transition-all duration-200"
                autoFocus
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Search Suggestions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {searchQuery ? 'Search Results' : 'Quick Access'}
            </h4>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    onClick={handleSuggestionClick}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-primary/5 hover:scale-[1.02] transition-all duration-200 border border-gray-100 group"
                  >
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                        {item.title}
                      </h5>
                      <p className="text-sm text-gray-600 truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                        {item.category}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-2">Try searching for legal aid, programs, or resources</p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Links */}
          {!searchQuery && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Popular</h4>
              <div className="flex flex-wrap gap-2">
                {['Legal Aid', 'Grant Making', 'Success Stories', 'Climate Justice', 'Digital Transformation', 'Publications', 'Contact'].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
