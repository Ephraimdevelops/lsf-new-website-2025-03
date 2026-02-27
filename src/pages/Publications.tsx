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
import { forceDownload } from '@/utils/download';

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { publications, loading, error } = usePublications(searchTerm, selectedType);

  // Derive types from hardcoded list or assume 'all' is enough if backend filtering handles it.
  // Original code derived from 'publications' (which was all). Now 'publications' is filtered result.
  // To keep filter buttons working, we need a static list of types, or fetch standard types.
  // Common types: Report, Research, Guide, Brief.
  const types = ['all', 'Report', 'Research', 'Guide', 'Policy', 'Brief', 'Annual Report'];

  const handleDownloadClick = async (publication: any) => {
    const url = publication.pdfUrl || publication.downloadUrl || publication.file || publication.fileUrl;
    if (url) {
      await forceDownload(url, `${publication.title}.pdf`);
    }
  };

  const handlePreview = (publication: any) => {
    const url = publication.pdfUrl || publication.downloadUrl || publication.file || publication.fileUrl;
    if (url) {
      window.open(url, '_blank');
    }
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
                  <article key={publication.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 hover:-translate-y-1">

                    <div className="relative h-56 overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={publication.image || "/lovable-uploads/placeholder.svg"}
                        alt={publication.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${getTypeColor(publication.type)} shadow-sm`}>
                          {publication.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="block">
                        <div className="flex items-center text-gray-500 text-xs font-medium mb-3">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {new Date(publication.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                        <h3 className="text-[18px] font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {publication.title}
                        </h3>

                        <p className="text-gray-600 text-[14px] leading-relaxed mb-6 line-clamp-3 flex-grow">
                          {publication.excerpt}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-4 border-t border-gray-50">
                        {publication.pdfUrl && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownloadClick(publication);
                            }}
                            className="w-full flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          >
                            <Download size={16} />
                            <span>Download PDF</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePreview(publication);
                          }}
                          className="w-full flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        >
                          <Eye size={16} />
                          <span>Preview</span>
                        </button>
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
