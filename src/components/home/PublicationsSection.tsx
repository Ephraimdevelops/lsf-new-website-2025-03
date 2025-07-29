import { usePublications } from '@/hooks/useContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PublicationsSection() {
  const { publications, loading, error } = usePublications();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-lg p-4 h-[400px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Failed to load publications. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Publications</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of research papers, reports, and other publications
            that showcase our work and impact in the legal sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((publication) => (
            <Card key={publication.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={publication.coverImageUrl}
                  alt={publication.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{publication.category}</Badge>
                </div>
              </div>
              <CardHeader>
                <div className="text-sm text-gray-500 mb-2">
                  {format(new Date(publication.publishedDate), 'MMM dd, yyyy')}
                </div>
                <CardTitle className="line-clamp-2">{publication.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {publication.description}
                </p>
                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  </Button>
                  {publication.authors && publication.authors.length > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Authors: </span>
                      {publication.authors.join(', ')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Publications
          </Button>
        </div>
      </div>
    </section>
  );
}
