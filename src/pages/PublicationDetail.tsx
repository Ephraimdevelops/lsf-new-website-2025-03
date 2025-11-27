
import { useParams, Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Download, Share2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { analyticsService } from '../services/api';

const PublicationDetail = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const id = publicationId as Id<"publications">;

  const publicationData = useQuery(api.publications.getById, { id });
  const publication = publicationData ? { ...publicationData, id: publicationData._id } : null;

  const isLoading = publicationData === undefined;
  const error = publicationData === null; // If null returned, it means not found

  const trackDownload = () => {
    if (publication) {
      analyticsService.trackEvent('publication_download', {
        publication_id: publication.id,
        publication_title: publication.title
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="animate-pulse text-primary">Loading publication details...</div>
        </div>
      </Layout>
    );
  }

  if (error || !publication) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="text-red-500">Error loading publication. Please try again later.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-light py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link to="/publications" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Publications
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Publication Cover */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center">
                <div className="relative w-full max-w-xs aspect-[3/4]">
                  <img
                    src={publication.image || '/placeholder.svg'}
                    alt={publication.title}
                    className="w-full h-full object-cover rounded border"
                  />
                </div>
              </div>
            </div>

            {/* Publication Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{publication.title}</h1>

              <div className="flex items-center text-neutral-gray mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Published: {format(new Date(publication.date), 'MMMM d, yyyy')}</span>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-lg">{publication.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href={publication.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackDownload}
                >
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Publication
                  </Button>
                </a>

                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <Separator className="my-8" />

              {/* Publication Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Publication Details</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-neutral-gray">Format:</span>
                        <span>PDF</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-gray">Published:</span>
                        <span>{format(new Date(publication.date), 'MMMM d, yyyy')}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-gray">Language:</span>
                        <span>English</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Related Publications - Placeholder for future implementation */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-primary mb-6">Related Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-neutral-light flex items-center justify-center">
                    <FileText className="h-12 w-12 text-neutral-gray" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-2 mb-1">Sample Related Publication {item}</h3>
                    <p className="text-sm text-neutral-gray mb-3">2023</p>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicationDetail;
