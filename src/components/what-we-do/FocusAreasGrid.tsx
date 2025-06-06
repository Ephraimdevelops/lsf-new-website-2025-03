
import { Link } from 'react-router-dom';
import { Scale, Users, LayoutGrid, Building, Target, ArrowRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';

const FocusAreasGrid = () => {
  const strategicAreas = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Increasing Accessibility to Quality Legal Aid Services',
      description: 'Prioritizing the provision of accessible, affordable, and quality legal aid services to marginalized populations, with a strong emphasis on women and girls.',
      link: '/programs/legal-empowerment',
      color: 'primary',
      image: '/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png',
      stats: '15,000+ assisted annually'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Promoting Legally Empowered Communities',
      description: 'Advancing community legal empowerment—particularly for women, girls, and other marginalized groups—through legal education, awareness, and the strengthening of paralegal networks.',
      link: '/programs/community-empowerment',
      color: 'secondary-teal',
      image: '/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png',
      stats: '500+ paralegals trained'
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: 'Enhancing a Conducive Environment for Sustainable Access to Justice',
      description: 'Supporting policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice.',
      link: '/what-we-do/policy-advocacy',
      color: 'primary',
      image: '/lovable-uploads/03e3e41e-930e-409b-9697-0530773cca4c.png',
      stats: '15+ policy reforms'
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: 'Institutional Development and Sustainability',
      description: 'Strengthening the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.',
      link: '/programs/institutional-development',
      color: 'secondary-teal',
      image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      stats: '200+ partners strengthened'
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
            Four Strategic Focus Areas Driving Justice Forward
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg">
            Our work is guided by four strategic focus areas that ensure justice is accessible to all Tanzanians, 
            particularly women and marginalized communities. Each area represents our commitment to systemic change 
            and measurable impact.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {strategicAreas.map((area, index) => (
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
                  <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
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
