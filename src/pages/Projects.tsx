
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarRange, MapPin, ArrowRight, ExternalLink, PlayCircle, TrendingUp, Users, Target } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { programService } from '../services/api';
import { Program } from '../services/api/types';

const Projects = () => {
  const { data: programs, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: programService.getAllPrograms,
  });

  const featuredProjects = [
    {
      id: 'sauti-ya-mwanamke',
      title: 'Sauti ya Mwanamke',
      subtitle: 'Improved Access to Justice for Women in Tanzania',
      description: 'LSF\'s flagship gender justice initiative under the EU\'s Gender Transformative Action Programme, empowering women and girls to claim their rights and access justice mechanisms.',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Women\'s Empowerment',
      impact: '26,451 People Accessed Legal Aid',
      stats: [
        { value: '26,451', label: 'People Accessed Legal Aid', subtext: '59% women' },
        { value: '7.6M', label: 'People Reached', subtext: 'Legal awareness campaigns' },
        { value: '6,825', label: 'GBV Cases Addressed', subtext: '75% reported by women' }
      ]
    },
    {
      id: 'wanawake-tunaweza',
      title: 'Wanawake Tunaweza',
      subtitle: 'Empowering Maasai Women in Longido District',
      description: 'Culturally sensitive and community-driven solutions to empower Maasai women and girls, addressing education barriers, gender inequality, and harmful traditions.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Economic Empowerment',
      impact: '97.6% Girls in SRHR Training',
      stats: [
        { value: '97.6%', label: 'Girls in SRHR Training', subtext: 'And school clubs' },
        { value: '88%', label: 'Improved School Attendance', subtext: 'For girls' },
        { value: '87.3%', label: 'Reduction Observed', subtext: 'In FGM and early marriage' }
      ]
    },
    {
      id: 'haki-yangu',
      title: 'Haki Yangu Digital App',
      subtitle: 'Justice at Your Fingertips',
      description: 'Revolutionary mobile platform connecting Tanzanians directly to trained paralegals. Breaking barriers through technology and making legal aid accessible to everyone, everywhere.',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Digital Innovation',
      impact: '75,000+ App Downloads',
      stats: [
        { value: '75,000+', label: 'App Downloads', subtext: 'Across Tanzania' },
        { value: '2,500+', label: 'Legal Consultations', subtext: 'Via mobile platform' },
        { value: '98%', label: 'User Satisfaction', subtext: 'Rating from beneficiaries' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-primary">Loading projects...</div>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-red-500">Error loading projects. Please try again later.</div>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Target className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Our Projects
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl md:text-8xl font-bold">
              Transformative 
              <span className="block text-secondary-orange">Impact in Action</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Discover our groundbreaking initiatives that are reshaping Tanzania's justice landscape through innovation, community empowerment, and strategic legal aid delivery.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 text-lg rounded-full">
                Explore All Projects
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 text-lg rounded-full">
                <PlayCircle className="mr-3 h-6 w-6" />
                Watch Impact Stories
              </Button>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-orange">50+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-teal">184</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Communities Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-yellow">2.8M+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">$47M+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Funds Managed</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <TrendingUp className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                FLAGSHIP INITIATIVES
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Featured Projects
              <span className="block text-primary">Driving Real Change</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              Explore our most impactful projects that are transforming lives across Tanzania through innovative legal empowerment and justice delivery.
            </Typography>
          </div>

          <div className="space-y-16">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-white font-bold text-lg">{project.impact}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div>
                      <div className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                        Project #{String(index + 1).padStart(2, '0')}
                      </div>
                      <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        {project.title}
                      </Typography>
                      <Typography variant="h3" className="text-2xl text-secondary-teal font-semibold mb-6">
                        {project.subtitle}
                      </Typography>
                    </div>
                    
                    <Typography variant="body" className="text-neutral-gray text-lg leading-relaxed">
                      {project.description}
                    </Typography>
                    
                    {/* Project Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {project.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center bg-gray-50 p-4 rounded-xl">
                          <div className="text-2xl font-bold text-primary">{stat.value}</div>
                          <div className="text-sm text-gray-600 leading-tight">{stat.label}</div>
                          <div className="text-xs text-gray-500">{stat.subtext}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={`/projects/${project.id}`}>
                        <Button size="lg" className="font-bold px-8 w-full sm:w-auto">
                          Explore Project
                          <ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Button size="lg" variant="outline" className="font-bold px-8 w-full sm:w-auto">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Watch Story
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* All Projects Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold">
              All Our Projects
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Comprehensive overview of our ongoing and completed initiatives across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs?.map((program) => (
              <ProjectCard key={program.id} program={program} />
            ))}
          </div>
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

interface ProjectCardProps {
  program: Program;
}

const ProjectCard = ({ program }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 border border-gray-100">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={program.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={program.title} 
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            Active
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold text-primary line-clamp-2 group-hover:text-secondary-teal transition-colors">
          {program.title}
        </h3>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-neutral-gray line-clamp-3 leading-relaxed">
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
          <Button variant="default" className="w-full group-hover:bg-primary-dark transition-colors">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Projects;
