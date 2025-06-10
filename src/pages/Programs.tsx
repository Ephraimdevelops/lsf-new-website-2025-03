
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarRange, ArrowRight, Target, PlayCircle, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Target className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Programs & Initiatives
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl md:text-8xl font-bold">
              Transforming Lives
              <span className="block text-secondary-orange">Through Justice</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              At Legal Services Facility (LSF), we implement strategic legal empowerment and access to justice programs across Tanzania. Each project is designed to uplift communities—especially women, children, and marginalized groups—through accessible legal aid, education, and advocacy.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 text-lg rounded-full">
                Explore All Programs
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 text-lg rounded-full">
                <PlayCircle className="mr-3 h-6 w-6" />
                Watch Impact Stories
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Programs list */}
      <section className="py-24 bg-white">
        <Container size="xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/20"></div>
                <p className="mt-4 text-neutral-gray">Loading programs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="text-red-500">Error loading programs. Please try again later.</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold">
                  All Our Programs
                </Typography>
                <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
                  Comprehensive overview of our ongoing and completed initiatives bridging the justice gap across all 184 districts of Tanzania.
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs?.map((program) => (
                  <Card key={program.id} className="overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border border-gray-100">
                    <div className="h-48 overflow-hidden relative">
                      {program.image ? (
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        />
                      ) : (
                        <div 
                          className="w-full h-full bg-gradient-to-br from-primary to-secondary-teal flex items-center justify-center"
                        >
                          <Target className="h-16 w-16 text-white/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary text-white">
                          Active Program
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-bold mb-2 text-primary group-hover:text-secondary-teal transition-colors">
                        {program.title}
                      </h2>
                      <p className="text-neutral-gray mb-4 line-clamp-3 leading-relaxed">
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
                            <Button variant="default" className="w-full group-hover:bg-primary-dark transition-colors">
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
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl font-bold">
              Join Our Mission for Justice
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl leading-relaxed">
              Be part of the movement that's transforming Tanzania's justice landscape. Whether you're a partner, donor, or advocate for change.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4">
                Partner With Us
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                Support Our Work
              </Button>
              <Button size="lg" className="bg-secondary-teal hover:bg-secondary-teal/90 font-bold py-4">
                Contact Our Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Programs;
