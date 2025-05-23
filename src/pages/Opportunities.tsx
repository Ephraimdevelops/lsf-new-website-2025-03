
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { opportunityService } from '../services/api';

const Opportunities = () => {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', activeType, currentPage, pageSize],
    queryFn: () => opportunityService.getAllOpportunities(currentPage, pageSize, activeType || undefined)
  });

  const opportunities = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / pageSize) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type === 'all' ? null : type);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="bg-neutral-light py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Opportunities</h1>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
            Browse current job opportunities, tenders, grants, and other openings at Legal Services Facility.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Tabs defaultValue="all" className="mb-8" onValueChange={handleTypeChange}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="job">Jobs</TabsTrigger>
                <TabsTrigger value="tender">Tenders</TabsTrigger>
                <TabsTrigger value="grant">Grants</TabsTrigger>
              </TabsList>
              
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  {activeType ? `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} Opportunities` : 'All Opportunities'}
                </h2>
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-primary">Loading opportunities...</div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  Error loading opportunities. Please try again later.
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg mb-4">No opportunities found.</p>
                  <p className="text-neutral-gray">Please check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">{opportunity.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            opportunity.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {opportunity.is_open ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                          {opportunity.type && (
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Type:</span>
                              <span>{opportunity.type}</span>
                            </div>
                          )}
                          {opportunity.location && (
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Location:</span>
                              <span>{opportunity.location}</span>
                            </div>
                          )}
                          {opportunity.deadline && (
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Deadline:</span>
                              <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-neutral-gray line-clamp-3">{opportunity.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end bg-neutral-light bg-opacity-50 pt-4">
                        {opportunity.application_url && (
                          <Button 
                            variant="default" 
                            disabled={!opportunity.is_open} 
                            onClick={() => window.open(opportunity.application_url, '_blank')}
                          >
                            Apply Now
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={currentPage === i + 1} 
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Opportunities;
