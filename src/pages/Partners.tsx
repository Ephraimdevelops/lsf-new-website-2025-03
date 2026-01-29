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
    name: 'Ministry of Foreign Affairs of Denmark',
    description: 'Supporting community legal empowerment and human rights.',
    logo: '/lovable-uploads/Danish amabssador.png',
    website: 'https://tanzania.um.dk/en',
    category: 'Government',
    partnership_type: 'Development Partner'
  },
  {
    id: '2',
    name: 'Foreign, Commonwealth & Development Office',
    description: 'Collaborating on policy development and governance.',
    logo: '/lovable-uploads/FCDO_logo.png',
    website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
    category: 'Government',
    partnership_type: 'Policy Partner'
  },
  {
    id: '3',
    name: 'European Union',
    description: 'Major development partner supporting access to justice and women\'s rights.',
    logo: '/lovable-uploads/Funded by European Union.png',
    website: 'https://european-union.europa.eu',
    category: 'Development',
    partnership_type: 'Funding Partner'
  },
  {
    id: '4',
    name: 'The World Bank',
    description: 'Working together to strengthen legal institutions and justice delivery.',
    logo: '/lovable-uploads/WorldBank_logo.jpg',
    website: 'https://www.worldbank.org/en/country/tanzania',
    category: 'International',
    partnership_type: 'Strategic Partner'
  },
  {
    id: '5',
    name: 'WINGS',
    description: 'Elevating philanthropy and civil society globally.',
    logo: '/lovable-uploads/WINGS_logo.png',
    website: 'https://wingsweb.org',
    category: 'Network',
    partnership_type: 'Strategic Partner'
  },
  {
    id: '6',
    name: 'Enabel',
    description: 'Building capacity for sustainable justice delivery systems.',
    logo: '/lovable-uploads/Enabel.png',
    website: 'https://www.enabel.be',
    category: 'Development',
    partnership_type: 'Strategic Partner'
  }
];

const Partners = () => {
  return (
    <Layout>
      <CinematicHero
        title="Our Partners"
        badge="Strategic Alliances"
        description="Collaborating with global leaders to build a just Tanzania."
        backgroundImage="/lovable-uploads/partners-hero-bg.png"
        brandPattern="/lovable-uploads/brand-pattern-magenta.png"
      />

      {/* Partners Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {partners.map((partner) => (
              <div key={partner.id} className="group flex flex-col items-center text-center">
                {/* Logo - Large & Full Color */}
                <div className="h-56 w-full flex items-center justify-center mb-8 p-8 bg-neutral-50 rounded-3xl group-hover:bg-white group-hover:shadow-xl transition-all duration-500 border border-transparent group-hover:border-neutral-100">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>

                  <p className="text-neutral-500 text-base leading-relaxed mb-6 font-light max-w-sm mx-auto">
                    {partner.description}
                  </p>

                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-widest hover:gap-2 transition-all"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
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
