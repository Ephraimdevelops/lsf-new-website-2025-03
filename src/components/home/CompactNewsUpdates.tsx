
import { useNews } from '@/hooks/useContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const CompactNewsUpdates = () => {
  const { news, loading, error } = useNews();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-lg p-4 h-[300px]"></div>
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
          Failed to load news. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 shadow-sm border border-neutral-100">
            <span className="text-neutral-600 font-bold text-sm uppercase tracking-wide">
              Newsroom
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            Latest Stories & Publications
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Read real stories from the field, updates from our partners, and new reports that shape justice across Tanzania.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <CardHeader>
                <div className="text-sm text-gray-500 mb-2">
                  {format(new Date(item.publishedDate), 'MMM dd, yyyy')}
                </div>
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {item.content}
                </p>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
