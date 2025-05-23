
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarRange, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { programService } from '../services/api';
import { Program } from '../services/api/types';

const Projects = () => {
  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: programService.getAllPrograms,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-primary">Loading projects...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-red-500">Error loading projects. Please try again later.</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">Our Projects</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-neutral-dark">
              At Legal Services Facility (LSF), we implement strategic legal empowerment and access 
              to justice programs across Tanzania. Each project is designed to uplift communities—especially 
              women, children, and marginalized groups—through accessible legal aid, education, and advocacy. 
              Discover how we're bridging the justice gap across all 184 districts of Tanzania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs?.map((program) => (
              <ProjectCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ProjectCardProps {
  program: Program;
}

const ProjectCard = ({ program }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={program.image || "/placeholder.svg"} 
          alt={program.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold text-primary line-clamp-2">{program.title}</h3>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-neutral-gray line-clamp-3">
          {program.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {program.location?.map((location, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-secondary-teal/10 text-secondary-teal"
            >
              <MapPin size={12} className="mr-1" />
              {location}
            </span>
          ))}
        </div>
        
        {(program.startDate || program.endDate) && (
          <div className="mt-3 flex items-center text-xs text-neutral-gray">
            <CalendarRange size={14} className="mr-1" />
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
      </CardContent>
      <CardFooter>
        <Link to={`/programs/${program.id}`} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Projects;
