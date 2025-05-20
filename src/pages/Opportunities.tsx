
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ExternalLink, MapPin, ArrowRight } from "lucide-react";
import { opportunityService } from '@/services/api';
import { Opportunity } from '@/services/api/types';
import { Skeleton } from '@/components/ui/skeleton';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'grants' | 'tenders'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        // In a real API, you would filter by type on the server
        const response = await opportunityService.getOpportunities(1, 100);
        setOpportunities(response.data || []);
      } catch (err) {
        setError("Failed to load opportunities. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities based on active tab
  const filteredOpportunities = opportunities.filter(opportunity => {
    if (activeTab === 'all') return true;
    return opportunity.type === activeTab.slice(0, -1); // Remove 's' to match type ('jobs' -> 'job')
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-green text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-panton">Opportunities</h1>
            <p className="text-xl opacity-90 font-calibri">
              Discover job openings, tenders, and grant opportunities related to our work in legal empowerment and access to justice.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="all" 
            className="space-y-8"
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          >
            <div className="flex justify-center">
              <TabsList className="bg-white">
                <TabsTrigger value="all" className="font-calibri">All Opportunities</TabsTrigger>
                <TabsTrigger value="jobs" className="font-calibri">Jobs</TabsTrigger>
                <TabsTrigger value="grants" className="font-calibri">Grants</TabsTrigger>
                <TabsTrigger value="tenders" className="font-calibri">Tenders</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-6">
              {renderOpportunitiesList(filteredOpportunities, loading, error)}
            </TabsContent>
            
            <TabsContent value="jobs" className="space-y-6">
              {renderOpportunitiesList(filteredOpportunities, loading, error)}
            </TabsContent>
            
            <TabsContent value="grants" className="space-y-6">
              {renderOpportunitiesList(filteredOpportunities, loading, error)}
            </TabsContent>
            
            <TabsContent value="tenders" className="space-y-6">
              {renderOpportunitiesList(filteredOpportunities, loading, error)}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

// Helper function to render opportunities list
const renderOpportunitiesList = (opportunities: Opportunity[], loading: boolean, error: string | null) => {
  if (loading) {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-3 text-red-600 font-panton">Error</h3>
        <p className="text-lg text-neutral-gray font-calibri">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-3 font-panton">No opportunities available</h3>
        <p className="text-lg text-neutral-gray font-calibri">Please check back later for new postings.</p>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      {opportunities.map((opportunity) => (
        <Card key={opportunity.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold font-panton">{opportunity.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.type === 'job' ? 'bg-primary text-white' :
                  opportunity.type === 'grant' ? 'bg-secondary-teal text-white' :
                  'bg-secondary-orange text-white'
                }`}>
                  {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-neutral-dark font-calibri">{opportunity.description}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-neutral-gray">
                {opportunity.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Deadline: {formatDate(opportunity.deadline)}</span>
                </div>
                <div className="flex items-center">
                  <span className={opportunity.is_open ? "text-green-600" : "text-red-600"}>
                    {opportunity.is_open ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-gray">
                  Posted: {formatDate(opportunity.created_at)}
                </span>
                
                {opportunity.is_open && opportunity.application_url && (
                  <a 
                    href={opportunity.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-white bg-primary px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                  >
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OpportunitiesPage;
