import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CinematicHero from '@/components/shared/CinematicHero';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

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
    name: 'European Union',
    description: 'Major donor supporting legal empowerment programs across Tanzania.',
    logo: '/lovable-uploads/Funded by European Union.png',
    website: 'https://europa.eu',
    category: 'International',
    partnership_type: 'Major Donor'
  },
  {
    id: '2',
    name: 'ENABEL',
    description: 'Development partner building capacity for sustainable justice systems.',
    logo: '/lovable-uploads/Enabel.png',
    website: 'https://enabel.be',
    category: 'Development',
    partnership_type: 'Development Partner'
  },
  {
    id: '3',
    name: 'UK Aid',
    description: 'Strengthening legal aid infrastructure across regions.',
    logo: '/lovable-uploads/UKAid.png',
    website: 'https://gov.uk',
    category: 'Government',
    partnership_type: 'Funding Partner'
  },
  {
    id: '4',
    name: 'Danish Embassy Tanzania',
    description: 'Supporting community legal empowerment initiatives.',
    logo: '/lovable-uploads/Danish amabssador.png',
    website: '#',
    category: 'Government',
    partnership_type: 'Development Partner'
  },
  {
    id: '5',
    name: 'North-South Cooperation',
    description: 'Advancing global justice cooperation and policy.',
    logo: '/lovable-uploads/Northsouth cooperation.png',
    website: '#',
    category: 'International',
    partnership_type: 'Policy Partner'
  },
  {
    id: '6',
    name: 'Foreign Commonwealth Office',
    description: 'Government partnership for policy development.',
    logo: '/lovable-uploads/foregign, commonwealth, office.png',
    website: '#',
    category: 'Government',
    partnership_type: 'Policy Partner'
  }
];

const Partners = () => {
  return (
    <Layout>
      <CinematicHero
        title="Our Partners"
        badge="Strategic Partnerships"
        description="Together with our partners, we're building a more just and equitable Tanzania where everyone has access to legal protection."
        backgroundImage="/lovable-uploads/partners-hero-bg.png"
        brandPattern="/lovable-uploads/brand-pattern-magenta.png"
      />

      {/* Partners Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-secondary-teal/10 text-secondary-teal text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Our Network
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Funding & Development Partners
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              We are grateful to our partners who make our work possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {partners.map((partner) => (
              <div key={partner.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-secondary-teal/30 hover:-translate-y-2">
                {/* Logo */}
                <div className="p-8 bg-neutral-50 flex items-center justify-center h-40">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-secondary-teal/10 text-secondary-teal text-xs font-bold px-3 py-1 rounded-full">
                      {partner.partnership_type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-secondary-teal transition-colors">
                    {partner.name}
                  </h3>

                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {partner.description}
                  </p>

                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-secondary-teal font-bold text-sm hover:gap-2 transition-all"
                  >
                    Visit Website
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner With Us CTA */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Partner With Us</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            Join our mission to advance access to justice across Tanzania. Together, we can create lasting change.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-secondary-teal hover:bg-secondary-teal/90 text-white font-bold px-10 py-5 rounded-full text-lg">
              Explore Partnership Opportunities
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
