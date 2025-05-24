
import Layout from '../components/layout/Layout';
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

const categories = ['All', 'International Organizations', 'Foundations', 'Professional Bodies', 'Academic Institutions', 'NGOs', 'Government'];

const Partners = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-secondary-teal py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center space-x-3 mb-6">
              <Users className="h-8 w-8 text-secondary-orange" />
              <span className="text-secondary-orange font-semibold text-sm uppercase tracking-wide">Partnerships</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Partners</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Together with our partners, we're building a more just and equitable Tanzania where everyone has access to legal protection and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {partners.map((partner) => (
              <div key={partner.id} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20 h-full">
                  {/* Logo */}
                  <div className="p-6 bg-gray-50">
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {partner.partnership_type}
                      </span>
                      <span className="text-xs text-neutral-gray">{partner.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-neutral-dark group-hover:text-primary transition-colors duration-300">
                      {partner.name}
                    </h3>
                    
                    <p className="text-neutral-gray text-sm leading-relaxed mb-4">
                      {partner.description}
                    </p>
                    
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary font-semibold text-sm hover:text-primary-dark transition-colors group/link"
                    >
                      Visit Website
                      <ExternalLink className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Partnership Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-xl">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-neutral-dark">Active Partners</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-secondary-teal/5 to-secondary-orange/5 rounded-xl">
              <Globe className="h-12 w-12 text-secondary-teal mx-auto mb-4" />
              <div className="text-3xl font-bold text-secondary-teal mb-2">15</div>
              <div className="text-neutral-dark">Countries Represented</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-secondary-orange/5 to-primary/5 rounded-xl">
              <Heart className="h-12 w-12 text-secondary-orange mx-auto mb-4" />
              <div className="text-3xl font-bold text-secondary-orange mb-2">$2.5M</div>
              <div className="text-neutral-dark">Joint Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner With Us</h2>
            <p className="text-lg text-neutral-dark mb-8">
              Join our mission to advance access to justice across Tanzania. Together, we can create lasting change in communities that need it most.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              Explore Partnership Opportunities
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
