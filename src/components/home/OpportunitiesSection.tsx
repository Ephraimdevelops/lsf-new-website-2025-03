import { useOpportunities } from '@/hooks/useContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function OpportunitiesSection() {
  const { opportunities, loading, error } = useOpportunities();

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
          Failed to load opportunities. Please try again later.
        </div>
      </div>
    );
  }

  const getStatusColor = (status: 'open' | 'closed') => {
    return status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'bg-blue-100 text-blue-800';
      case 'grant':
        return 'bg-purple-100 text-purple-800';
      case 'tender':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Current Opportunities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest opportunities at LSF, including job openings,
            grants, and tenders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className={getTypeColor(opportunity.type)}>
                    {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(opportunity.status)}>
                    {opportunity.status === 'open' ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{opportunity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {opportunity.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Deadline: {opportunity.deadline}</span>
                </div>

                {opportunity.requirements && opportunity.requirements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="mb-1">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {opportunity.status === 'open' && opportunity.applicationLink && (
                  <Button className="w-full" asChild>
                    <a
                      href={opportunity.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
}
