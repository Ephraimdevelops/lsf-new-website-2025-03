import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Download, Calendar, Search, FileText, BookOpen, Eye, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { usePublications } from '@/hooks/usePublications';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import CinematicHero from '@/components/shared/CinematicHero';

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { publications, loading, error } = usePublications(searchTerm, selectedType);

  // Derive types from hardcoded list or assume 'all' is enough if backend filtering handles it.
  // Original code derived from 'publications' (which was all). Now 'publications' is filtered result.
  // To keep filter buttons working, we need a static list of types, or fetch standard types.
  // Common types: Report, Research, Guide, Brief.
  const types = ['all', 'Report', 'Research', 'Guide', 'Policy', 'Brief', 'Annual Report'];

  const handleDownload = (publication: any) => {
    window.open(publication.file || publication.fileUrl, '_blank');
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'report': return 'bg-primary text-white';
      case 'research': return 'bg-secondary-teal text-white';
      case 'guide': return 'bg-secondary-orange text-white';
      case 'brief': return 'bg-secondary-yellow text-black';
      default: return 'bg-neutral-500 text-white';
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <CinematicHero
        title="Publications & Research"
        badge="Knowledge Base"
        description="Explore our comprehensive collection of reports, policy briefs, and resources driving justice reform across Tanzania."
        backgroundImage="/lovable-uploads/LSf-enabel-un-signing.jpeg"
        brandPattern="/lovable-uploads/brand-pattern.png"
      />

      {/* Search & Filters */}
      <section className="py-8 bg-neutral-50 border-b border-neutral-200 sticky top-0 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <Input
                type="search"
                placeholder="Search publications..."
                className="pl-12 pr-4 py-3 rounded-full border-2 border-neutral-200 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedType === type
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {publications.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl">
              <BookOpen className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">No Publications Found</h3>
              <p className="text-neutral-600 mb-8">
                {searchTerm || selectedType !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Check back soon for new publications.'
                }
              </p>
              {(searchTerm || selectedType !== 'all') && (
                <Button onClick={() => { setSearchTerm(''); setSelectedType('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-neutral-600">
                  Showing <strong>{publications.length}</strong> publication{publications.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publications.map((publication) => (
                  <article key={publication.id} className="group">
                    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-primary/30 hover:-translate-y-2 h-full flex flex-col">
                      {publication.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={publication.image}
                            alt={publication.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(publication.type)}`}>
                              {publication.type}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-neutral-500 text-sm mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(publication.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>

                        <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {publication.title}
                        </h3>

                        <p className="text-neutral-600 text-sm mb-6 line-clamp-3 flex-grow">
                          {publication.excerpt}
                        </p>

                        <div className="flex gap-2 mt-auto">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(publication)}
                            className="flex-1 bg-primary hover:bg-primary-dark rounded-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Link to={`/publications/${publication.id}`}>
                            <Button size="sm" variant="outline" className="rounded-full">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
