import { Link } from 'react-router-dom';
import { DollarSign, Users, LayoutGrid, BookOpen, Lightbulb, Scale, Smartphone, Leaf, ArrowRight, Target } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';

const FocusAreasGrid = () => {
  const focusAreas = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Grant Making',
      description: 'Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.',
      link: '/what-we-do/grant-making',
      color: 'primary',
      image: '/lovable-uploads/697177d1-fcb8-4356-b773-aca9e11107aa.png',
      stats: '$2.5M+ distributed'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Capacity Building',
      description: 'LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.',
      link: '/what-we-do/capacity-building',
      color: 'secondary-teal',
      image: '/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png',
      stats: '500+ trained professionals'
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: 'Partnerships & Networking',
      description: 'We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.',
      link: '/what-we-do/partnerships-networking',
      color: 'primary',
      image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      stats: '150+ active partnerships'
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Learning and Research',
      description: 'Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn\'t.',
      link: '/what-we-do/learning-research',
      color: 'secondary-teal',
      image: '/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png',
      stats: '25+ research studies'
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Policy and Advocacy',
      description: 'Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.',
      link: '/what-we-do/policy-advocacy',
      color: 'primary',
      image: '/lovable-uploads/03e3e41e-930e-409b-9697-0530773cca4c.png',
      stats: '15+ policy reforms'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Accessible Legal Services',
      description: 'Increasing accessibility of quality legal aid services to marginalized communities, particularly women.',
      link: '/programs/legal-empowerment',
      color: 'secondary-teal',
      image: '/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png',
      stats: '15,000+ assisted annually'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Digital Transformation',
      description: 'LSF is embracing innovation to modernize operations and expand its reach through digitalization of legal aid service delivery.',
      link: '/programs/digital-transformation',
      color: 'primary',
      image: '/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png',
      stats: '10+ digital platforms'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Climate Justice',
      description: 'Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming.',
      link: '/programs/climate-justice',
      color: 'secondary-teal',
      image: '/lovable-uploads/2fad14c5-c506-4c5b-8fd7-3e97e956e966.png',
      stats: '5+ climate initiatives'
    }
  ];

  return (
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6 bg-primary/5 rounded-full px-6 py-3">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Strategic Focus Areas
            </span>
          </div>
          <Typography variant="h2" className="mb-6 text-neutral-dark max-w-4xl mx-auto">
            Eight Key Areas Driving Justice Forward
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg">
            We work across eight strategic areas to ensure justice is accessible to all Tanzanians, 
            particularly women and marginalized communities. Each focus area represents years of expertise 
            and measurable impact.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {focusAreas.map((area, index) => (
            <Link key={index} to={area.link} className="group block">
              <div className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-primary/20 h-full overflow-hidden group-hover:-translate-y-2">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${
                    area.color === 'primary' ? 'bg-primary/20' : 'bg-secondary-teal/20'
                  } group-hover:bg-black/40 transition-all duration-300`}></div>
                  
                  {/* Icon overlay */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center ${
                    area.color === 'primary' ? 'bg-primary text-white' : 'bg-secondary-teal text-white'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {area.icon}
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-sm font-semibold text-gray-900">{area.stats}</div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors duration-300">
                    {area.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed mb-4">
                    {area.description}
                  </Typography>
                  
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    Learn more 
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-2xl p-12">
          <Typography variant="h3" className="mb-4 text-neutral-dark">
            Ready to Make a Difference?
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
            Join us in creating lasting change. Whether you need legal assistance, want to partner with us, 
            or support our mission, there are many ways to get involved.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/legal-help">
              <Button size="lg" className="font-semibold px-8">
                Get Legal Help
              </Button>
            </Link>
            <Link to="/opportunities">
              <Button size="lg" variant="outline" className="font-semibold px-8">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreasGrid;
