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

      {/* Publications Horizontal List Area */}
      <section className="py-16 bg-neutral-100 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-neutral-200">
            {publications.length === 0 ? (
              <div className="text-center py-20 max-w-2xl mx-auto">
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
                <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
                  <p className="text-neutral-500 font-medium">
                    Showing <span className="text-primary font-bold">{publications.length}</span> publications
                  </p>
                </div>

                {/* Grid: 2-Column Horizontal Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {publications.map((publication) => (
                    <article key={publication.id} className="group bg-white flex flex-col sm:flex-row items-start gap-5 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-300">

                      {/* Document Cover (Portrait A4 Aspect Ratio) */}
                      <div className="relative w-full sm:w-[140px] flex-shrink-0 aspect-[1/1.4] bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
                        {publication.image ? (
                          <img
                            src={publication.image}
                            alt={publication.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <BookOpen className="text-neutral-300 h-12 w-12" />
                        )}
                        {/* Subtle inner shadow for paper look */}
                        <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] pointer-events-none" />
                      </div>

                      {/* Content Details */}
                      <div className="flex flex-col flex-grow py-1 h-full w-full">
                        <h3 className="text-lg md:text-[19px] font-bold text-primary leading-tight mb-2 line-clamp-3">
                          {publication.title}
                        </h3>

                        <p className="text-[13px] text-neutral-500 mb-5 font-medium flex items-center gap-1.5">
                          Uploaded: {new Date(publication.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                          {(publication.pdfUrl || publication.downloadUrl) && (
                            <button
                              onClick={(e) => { e.preventDefault(); handleDownloadClick(publication); }}
                              className="bg-secondary-yellow hover:bg-[#e5a600] text-neutral-900 border border-transparent hover:border-neutral-300 px-5 py-2 rounded-md font-bold text-sm shadow-sm transition-all focus:ring-2 focus:ring-secondary-yellow focus:ring-offset-2"
                            >
                              Download
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); handlePreview(publication); }}
                            className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-5 py-2 rounded-md font-bold text-sm transition-all focus:ring-2 focus:ring-neutral-200 focus:ring-offset-2"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <ActiveDownloadBanner />
    </Layout>
  );
};

export default Publications;
