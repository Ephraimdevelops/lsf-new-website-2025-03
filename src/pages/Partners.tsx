
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart, Users, Globe } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  category: string;
  partnership_type: string;
}

const partners: Partner[] = [
  {
    id: '1',
    name: 'UNDP Tanzania',
    description: 'Supporting our legal empowerment programs and capacity building initiatives across rural communities.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: 'https://undp.org',
    category: 'International Organizations',
    partnership_type: 'Funding Partner'
  },
  {
    id: '2',
    name: 'Ford Foundation',
    description: 'Championing social justice through strategic funding of our access to justice initiatives.',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: 'https://fordfoundation.org',
    category: 'Foundations',
    partnership_type: 'Strategic Partner'
  },
  {
    id: '3',
    name: 'Tanzania Law Society',
    description: 'Collaborating on policy advocacy and professional development for legal practitioners.',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: '#',
    category: 'Professional Bodies',
    partnership_type: 'Implementation Partner'
  },
  {
    id: '4',
    name: 'University of Dar es Salaam',
    description: 'Research collaboration and training programs for legal education and community outreach.',
    logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: '#',
    category: 'Academic Institutions',
    partnership_type: 'Research Partner'
  },
  {
    id: '5',
    name: 'Oxfam Tanzania',
    description: 'Joint programs addressing poverty, inequality, and human rights across Tanzania.',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: 'https://oxfam.org',
    category: 'NGOs',
    partnership_type: 'Implementation Partner'
  },
  {
    id: '6',
    name: 'Ministry of Justice',
    description: 'Government partnership for policy development and justice sector reforms.',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    website: '#',
    category: 'Government',
    partnership_type: 'Policy Partner'
  }
];

const Partners = () => {
  return (
    <Layout>
      <HeroSection
        icon={<Users className="h-8 w-8" />}
        badge="Partnerships"
        title="Our Partners"
        description="Together with our partners, we're building a more just and equitable Tanzania where everyone has access to legal protection and empowerment."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {partners.map((partner) => (
              <Card key={partner.id} variant="elevated" hover className="h-full">
                {/* Logo */}
                <div className="p-6 bg-neutral-50 rounded-t-2xl">
                  <div className="w-full h-32 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {partner.partnership_type}
                    </span>
                    <Typography variant="caption" className="text-neutral-gray">{partner.category}</Typography>
                  </div>
                  
                  <Typography variant="h3" className="text-neutral-dark mb-3">
                    {partner.name}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed mb-4">
                    {partner.description}
                  </Typography>
                  
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-bold text-sm hover:text-primary-dark transition-colors group/link"
                  >
                    Visit Website
                    <ExternalLink className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {/* Partnership Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center bg-gradient-to-br from-primary/5 to-secondary-teal/5">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <Typography variant="h1" className="text-primary mb-2">25+</Typography>
              <Typography variant="body" className="text-neutral-dark">Active Partners</Typography>
            </Card>
            <Card className="text-center bg-gradient-to-br from-secondary-teal/5 to-secondary-orange/5">
              <Globe className="h-12 w-12 text-secondary-teal mx-auto mb-4" />
              <Typography variant="h1" className="text-secondary-teal mb-2">15</Typography>
              <Typography variant="body" className="text-neutral-dark">Countries Represented</Typography>
            </Card>
            <Card className="text-center bg-gradient-to-br from-secondary-orange/5 to-primary/5">
              <Heart className="h-12 w-12 text-secondary-orange mx-auto mb-4" />
              <Typography variant="h1" className="text-secondary-orange mb-2">$2.5M</Typography>
              <Typography variant="body" className="text-neutral-dark">Joint Investment</Typography>
            </Card>
          </div>
        </Container>
      </Section>

      <Section variant="secondary" padding="lg">
        <Container size="md" className="text-center">
          <Typography variant="h1" className="mb-6">Partner With Us</Typography>
          <Typography variant="body" className="text-neutral-dark mb-8">
            Join our mission to advance access to justice across Tanzania. Together, we can create lasting change in communities that need it most.
          </Typography>
          <Button size="lg" className="bg-primary hover:bg-primary-dark">
            Explore Partnership Opportunities
          </Button>
        </Container>
      </Section>
    </Layout>
  );
};

export default Partners;
