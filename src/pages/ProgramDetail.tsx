
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CalendarRange, MapPin, Target, Users, FileText, Download,
  Check, Building, Globe, ArrowLeft, ExternalLink
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { programService } from '../services/api';
import { Program } from '../services/api/types';

const ProgramDetail = () => {
  const { programId } = useParams<{ programId: string }>();
  
  const { data: program, isLoading, error } = useQuery({
    queryKey: ['program', programId],
    queryFn: () => programId ? programService.getProgramById(programId) : null,
    enabled: !!programId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-primary">Loading project details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-red-500">Error loading project details. Please try again later.</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-neutral-dark">
        {program.image && (
          <img 
            src={program.image} 
            alt={program.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container mx-auto h-full flex flex-col justify-end pb-8 px-4 relative z-10">
          <div className="max-w-4xl">
            <Link to="/programs" className="inline-flex items-center text-white hover:text-secondary-teal mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">{program.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {(program.startDate || program.endDate) && (
                <div className="flex items-center text-white/90">
                  <CalendarRange size={16} className="mr-1" />
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
              
              {program.location && program.location.length > 0 && (
                <div className="flex items-center text-white/90">
                  <MapPin size={16} className="mr-1" />
                  <span>{program.location.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Project Summary */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Project Summary</h2>
              <div className="prose max-w-none">
                <p className="text-lg">{program.description}</p>
              </div>
            </section>

            {/* Objectives */}
            {program.objectives && program.objectives.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Objectives</h2>
                <div className="bg-neutral-light rounded-lg p-6">
                  <ul className="space-y-3">
                    {program.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <Target className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Implementation Approach */}
            {program.approach && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Implementation Approach</h2>
                <div className="prose max-w-none">
                  <p>{program.approach}</p>
                </div>
              </section>
            )}

            {/* Key Results & Impact */}
            {program.results && program.results.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Key Results & Impact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.results.map((result, index) => (
                    <Card key={index} className="border-l-4 border-l-secondary-teal">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <Check className="h-5 w-5 mr-2 text-secondary-teal flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-bold text-xl text-secondary-teal">{result.value}</p>
                            <p className="text-sm text-neutral-dark">{result.title}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Best Practices & Learnings */}
            {program.bestPractices && program.bestPractices.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Best Practices & Learnings</h2>
                <div className="bg-neutral-light rounded-lg p-6">
                  <ul className="space-y-3">
                    {program.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-secondary-orange text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">{index + 1}</div>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Geographic Coverage */}
            {program.geographicCoverage && program.geographicCoverage.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Geographic Coverage</h2>
                <div className="bg-white border rounded-lg p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {program.geographicCoverage.map((location, index) => (
                      <div key={index} className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-secondary-teal" />
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Resources/Downloads */}
            {program.resources && program.resources.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Downloads & Resources</h2>
                <div className="grid grid-cols-1 gap-3">
                  {program.resources.map((resource, index) => (
                    <a 
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border rounded-lg hover:bg-neutral-light transition-colors"
                    >
                      <FileText className="h-6 w-6 mr-3 text-primary" />
                      <div className="flex-grow">
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-neutral-gray">{resource.type}</p>
                      </div>
                      <Download className="h-5 w-5 text-neutral-gray" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery - if available */}
            {program.gallery && program.gallery.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {program.gallery.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${program.title} gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Beneficiaries */}
            {program.beneficiaries && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Beneficiaries
                  </h3>
                  
                  <div className="space-y-4">
                    {program.beneficiaries.total && (
                      <div>
                        <p className="text-3xl font-bold text-secondary-teal">{program.beneficiaries.total.toLocaleString()}</p>
                        <p className="text-sm text-neutral-gray">Total people reached</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {program.beneficiaries.women && (
                        <div>
                          <p className="text-xl font-bold text-primary">{program.beneficiaries.women.toLocaleString()}</p>
                          <p className="text-xs text-neutral-gray">Women</p>
                        </div>
                      )}
                      
                      {program.beneficiaries.children && (
                        <div>
                          <p className="text-xl font-bold text-primary">{program.beneficiaries.children.toLocaleString()}</p>
                          <p className="text-xs text-neutral-gray">Children</p>
                        </div>
                      )}
                      
                      {program.beneficiaries.disputes && (
                        <div className="col-span-2 pt-2 border-t">
                          <p className="text-xl font-bold text-primary">{program.beneficiaries.disputes.toLocaleString()}</p>
                          <p className="text-xs text-neutral-gray">Disputes handled</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Donors & Partners */}
            {(program.donors?.length > 0 || program.partners?.length > 0) && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Tabs defaultValue="donors">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="donors">Donors</TabsTrigger>
                      <TabsTrigger value="partners">Partners</TabsTrigger>
                    </TabsList>
                    <TabsContent value="donors" className="mt-4">
                      {program.donors && program.donors.length > 0 ? (
                        <div className="space-y-3">
                          {program.donors.map((donor, index) => (
                            <div key={index} className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-primary" />
                              <span>{donor}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-gray">No donors listed for this project.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="partners" className="mt-4">
                      {program.partners && program.partners.length > 0 ? (
                        <div className="space-y-3">
                          {program.partners.map((partner, index) => (
                            <div key={index} className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-primary" />
                              <span>{partner}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-gray">No partners listed for this project.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Contact CTA */}
            <Card className="bg-primary text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Interested in this Project?</h3>
                <p className="mb-4">Want to collaborate or learn more about this project?</p>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent text-white border-white hover:bg-white hover:text-primary"
                  >
                    Contact Us
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProgramDetail;
