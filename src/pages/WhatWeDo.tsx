
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Scale, Users, BookOpen, Smartphone, Globe, ArrowRight, DollarSign, LayoutGrid, Lightbulb, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Projects from '../components/home/Projects';

const WhatWeDo = () => {
  const focusAreas = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Grant Making',
      description: 'Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.',
      link: '/what-we-do#grant-making',
      color: 'primary'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Capacity Building',
      description: 'LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.',
      link: '/what-we-do#capacity-building',
      color: 'secondary-teal'
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: 'Partnerships & Networking',
      description: 'We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.',
      link: '/what-we-do#partnerships-networking',
      color: 'primary'
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Learning and Research',
      description: 'Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn\'t.',
      link: '/what-we-do#learning-research',
      color: 'secondary-teal'
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Policy and Advocacy',
      description: 'Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.',
      link: '/what-we-do#policy-advocacy',
      color: 'primary'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Accessible Legal Services',
      description: 'Increasing accessibility of quality legal aid services to marginalized communities, particularly women.',
      link: '/programs/legal-empowerment',
      color: 'secondary-teal'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Digital Transformation',
      description: 'LSF is embracing innovation to modernize operations and expand its reach through digitalization of legal aid service delivery.',
      link: '/programs/digital-transformation',
      color: 'primary'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Climate Justice',
      description: 'Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming.',
      link: '/programs/climate-justice',
      color: 'secondary-teal'
    }
  ];

  const impactStats = [
    { number: '26,000+', label: 'People Assisted', icon: Users },
    { number: '184', label: 'Districts Covered', icon: Globe },
    { number: '500+', label: 'Paralegals Trained', icon: BookOpen },
    { number: '15', label: 'Years of Experience', icon: Scale }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Section variant="gradient" padding="xl">
        <Container size="xl">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Typography variant="display" className="text-white mb-6">
              What We Do
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl max-w-3xl mx-auto">
              We advance access to justice across Tanzania through legal aid, community empowerment, 
              policy advocacy, and innovative digital solutions.
            </Typography>
          </div>
        </Container>
      </Section>

      {/* Focus Areas */}
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6 text-neutral-dark">
              Our Strategic Focus Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              We work across eight key areas to ensure justice is accessible to all Tanzanians, 
              particularly women and marginalized communities.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {focusAreas.map((area, index) => (
              <Link key={index} to={area.link} className="group">
                <div className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20 h-full">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    area.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary group-hover:text-white' :
                    'bg-secondary-teal/10 group-hover:bg-secondary-teal group-hover:text-white'
                  } transition-all duration-300`}>
                    <div className={`${
                      area.color === 'primary' ? 'text-primary group-hover:text-white' : 'text-secondary-teal group-hover:text-white'
                    } transition-colors duration-300`}>
                      {area.icon}
                    </div>
                  </div>
                  
                  <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors duration-300">
                    {area.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                    {area.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Impact Stats */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Our Impact
            </Typography>
            <Typography variant="body" className="text-neutral-dark">
              Measurable results in advancing access to justice across Tanzania
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <Typography variant="display" className="text-primary mb-2 text-3xl">
                  {stat.number}
                </Typography>
                <Typography variant="h4" className="text-neutral-dark">
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Our Impactful Interventions */}
      <Projects />

      {/* How We Work */}
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6">
              How We Work
            </Typography>
            <Typography variant="body" className="text-neutral-dark max-w-2xl mx-auto">
              Our approach combines grassroots engagement with strategic advocacy to create sustainable change
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <Typography variant="h3" className="mb-4">
                Community Engagement
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                We start by listening to communities, understanding their legal challenges and building trust through direct engagement.
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-teal">2</span>
              </div>
              <Typography variant="h3" className="mb-4">
                Capacity Building
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                We train community paralegals and provide legal education to empower communities with knowledge and skills.
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-orange">3</span>
              </div>
              <Typography variant="h3" className="mb-4">
                Systemic Change
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                We advocate for policy reforms and work with institutions to create lasting improvements in the justice system.
              </Typography>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="gradient" padding="lg">
        <Container size="xl">
          <div className="max-w-2xl mx-auto text-center text-white">
            <Typography variant="h2" className="text-white mb-6">
              Get Involved
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8 text-xl">
              Join us in advancing access to justice across Tanzania. Together, we can ensure that everyone has equal protection under the law.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                  Join Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default WhatWeDo;
