
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarRange, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { programService } from '@/services/api';
import { analyticsService } from '@/services/api';

const Programs = () => {
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('/programs', 'Our Projects');
  }, []);

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: programService.getAllPrograms,
  });

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-primary text-white py-16 md:py-24 pattern-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Projects</h1>
            <p className="text-xl">
              At Legal Services Facility (LSF), we implement strategic legal empowerment and access to justice programs across Tanzania. Each project is designed to uplift communities—especially women, children, and marginalized groups—through accessible legal aid, education, and advocacy. Discover how we're bridging the justice gap across all 184 districts of Tanzania.
            </p>
          </div>
        </div>
      </div>

      {/* Projects list */}
      <div className="container mx-auto py-16 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20"></div>
              <p className="mt-4 text-neutral-gray">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Error loading projects. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs?.map((program) => (
              <Card key={program.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  {program.image ? (
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-light flex items-center justify-center">
                      <p className="text-neutral-gray">No image available</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold mb-2 text-primary">{program.title}</h2>
                  <p className="text-neutral-gray mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  <div className="mt-auto space-y-3">
                    {program.location && program.location.length > 0 && (
                      <div className="flex items-center text-sm text-neutral-gray">
                        <MapPin size={16} className="mr-2 flex-shrink-0 text-secondary-teal" />
                        <span>{program.location.join(', ')}</span>
                      </div>
                    )}
                    
                    {(program.startDate || program.endDate) && (
                      <div className="flex items-center text-sm text-neutral-gray">
                        <CalendarRange size={16} className="mr-2 flex-shrink-0 text-secondary-teal" />
                        <span>
                          {program.startDate && new Date(program.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                          {program.startDate && program.endDate && " – "}
                          {program.endDate && new Date(program.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Link to={`/programs/${program.id}`}>
                        <Button variant="default" className="w-full">
                          View Details
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Programs;
