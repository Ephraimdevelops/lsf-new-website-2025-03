import { useSuccessStories } from '@/hooks/useContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuoteIcon } from 'lucide-react';

export default function SuccessStoriesSection() {
  const { stories, loading, error } = useSuccessStories();

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
          Failed to load success stories. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read inspiring stories of individuals and communities whose lives
            have been transformed through our work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.personName}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                  <QuoteIcon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>{story.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-4 mb-4">
                  {story.story}
                </p>
                
                <div className="mb-6">
                  <p className="font-medium">{story.personName}</p>
                  <p className="text-sm text-gray-500">{story.location}</p>
                </div>

                {story.impactMetrics && Object.keys(story.impactMetrics).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(story.impactMetrics).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {value}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  Read Full Story
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
