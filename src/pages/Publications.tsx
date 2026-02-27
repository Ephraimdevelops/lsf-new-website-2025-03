import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Download, Calendar, Search, BookOpen, Eye, X, Pause, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { usePublications } from '@/hooks/usePublications';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import CinematicHero from '@/components/shared/CinematicHero';
import { useFileDownloader } from '@/hooks/useFileDownloader';
import { Progress } from "@/components/ui/progress";

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { publications, loading, error } = usePublications(searchTerm, selectedType);
  const downloader = useFileDownloader();

  // Static list of commonly used publication categories/types
  const types = ['all', 'report', 'research', 'guide', 'policy', 'brief', 'manual', 'toolkit'];

  const handleDownloadClick = async (publication: any) => {
    const url = publication.pdfUrl || publication.downloadUrl;
    if (url) {
      downloader.startDownload(url, `${publication.title}.pdf`);
    }
  };

  const handlePreview = (publication: any) => {
    const url = publication.pdfUrl || publication.downloadUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'report': return 'bg-primary text-white';
      case 'research': return 'bg-secondary-teal text-white';
      case 'guide': return 'bg-secondary-orange text-white';
      case 'policy': return 'bg-blue-600 text-white';
      case 'brief': return 'bg-secondary-yellow text-black';
      case 'manual': return 'bg-green-600 text-white';
      case 'toolkit': return 'bg-purple-600 text-white';
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

  // Active Download Banner (Sticky at bottom if a download is active)
  const ActiveDownloadBanner = () => {
    if (!downloader.isDownloading && !downloader.isPaused && downloader.progress !== 100) return null;
    if (downloader.progress === 100 && !downloader.isDownloading) return null; // Hide when done

    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <p className="text-sm font-bold text-neutral-900 line-clamp-1">{downloader.filename || 'Downloading file...'}</p>
            <p className="text-xs text-neutral-500">
              {downloader.isPaused ? 'Paused' : `Downloading... ${downloader.progress}%`}
            </p>
          </div>
          <div className="flex gap-2">
            {downloader.isPaused ? (
              <button onClick={downloader.resumeDownload} className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                <Play size={16} fill="currentColor" />
              </button>
            ) : (
              <button onClick={downloader.pauseDownload} className="p-2 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors">
                <Pause size={16} fill="currentColor" />
              </button>
            )}
            <button onClick={downloader.cancelDownload} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
        <Progress value={downloader.progress} className="h-2 w-full" />
      </div>
    );
  };

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
      <section className="py-8 bg-neutral-50 border-b border-neutral-200 sticky top-[72px] z-30 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <Input
                type="search"
                placeholder="Search publications..."
                className="pl-12 pr-4 py-3 rounded-full border-2 border-neutral-200 focus:border-primary w-full bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 text-nowrap overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide py-1">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedType === type
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border-2 border-neutral-100 hover:border-neutral-200'
                    }`}
                >
                  {type === 'all' ? 'All Publications' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid - Insta Card Style */}
      <section className="py-16 bg-neutral-50 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {publications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-2xl mx-auto">
              <BookOpen className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Publications Found</h3>
              <p className="text-neutral-500 mb-8">
                {searchTerm || selectedType !== 'all'
                  ? "We couldn't find any documents matching your current filters."
                  : "Check back soon for new publications."
                }
              </p>
              {(searchTerm || selectedType !== 'all') && (
                <Button onClick={() => { setSearchTerm(''); setSelectedType('all'); }} className="rounded-full px-8">
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-neutral-500 font-medium">
                  Showing <span className="text-neutral-900 font-bold">{publications.length}</span> results
                </p>
              </div>

              {/* Grid: Insta Format (Squareish, image prominent, minimal text below) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {publications.map((publication) => (
                  <article key={publication.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-neutral-100 transition-all duration-300 flex flex-col">

                    {/* Square Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      <img
                        src={publication.image || "/lovable-uploads/placeholder.svg"}
                        alt={publication.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay for badges */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${getTypeColor(publication.type || publication.category)}`}>
                          {publication.type || publication.category || 'Document'}
                        </span>
                      </div>

                      {/* Quick Actions overlay on hover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-3 z-20">
                        <button
                          onClick={(e) => { e.preventDefault(); handlePreview(publication); }}
                          className="bg-white/90 backdrop-blur-sm text-neutral-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        {(publication.pdfUrl || publication.downloadUrl) && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleDownloadClick(publication); }}
                            className="bg-primary/90 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-primary transition-colors"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Minimal Info Area */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center text-neutral-400 text-[11px] font-medium mb-2 uppercase tracking-wide">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {new Date(publication.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      <h3 className="text-base font-bold text-neutral-900 mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                        {publication.title}
                      </h3>

                      {/* Explicit Action Buttons for Mobile Accessibility */}
                      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2 md:hidden">
                        <button
                          onClick={(e) => { e.preventDefault(); handlePreview(publication); }}
                          className="text-xs font-bold text-neutral-500 hover:text-neutral-900"
                        >
                          PREVIEW
                        </button>
                        {(publication.pdfUrl || publication.downloadUrl) && (
                          <button
                            onClick={(e) => { e.preventDefault(); handleDownloadClick(publication); }}
                            className="text-xs font-bold text-primary hover:text-primary-dark"
                          >
                            DOWNLOAD
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ActiveDownloadBanner />
    </Layout>
  );
};

export default Publications;
