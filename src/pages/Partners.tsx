import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CinematicHero from '@/components/shared/CinematicHero';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';

import SEOHead from '@/components/shared/SEOHead';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
}

const partners: Partner[] = [
  {
    id: 'danida',
    name: 'DANIDA',
    logo: '/lovable-uploads/Danish amabssador.png',
    description: 'The Danish International Development Agency, a key partner in promoting human rights and democracy.',
    website: 'https://um.dk/en/danida'
  },
  {
    id: 'fcdo',
    name: 'FCDO',
    logo: '/lovable-uploads/FCDO_logo.png',
    description: 'Foreign, Commonwealth & Development Office (UK), supporting inclusive governance and social justice.',
    website: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office'
  },
  {
    id: 'eu',
    name: 'European Union',
    logo: '/lovable-uploads/Funded by European Union.png',
    description: 'Partnering with LSF to enhance legal aid and strengthen civil society organizations.',
    website: 'https://ec.europa.eu/info/index_en'
  },
  {
    id: 'world-bank',
    name: 'The World Bank',
    logo: '/lovable-uploads/WorldBank_logo.jpg',
    description: 'Collaborating on initiatives that foster institutional development and access to justice.',
    website: 'https://www.worldbank.org'
  },
  {
    id: 'wings',
    name: 'WINGS',
    logo: '/lovable-uploads/WINGS_logo.png',
    description: 'A global network of philanthropy support organizations, promoting social investment.',
    website: 'https://www.wingsweb.org'
  },
  {
    id: 'enabel',
    name: 'ENABEL',
    logo: '/lovable-uploads/Enabel.png',
    description: 'The Belgian development agency, working together to improve legal services and community resilience.',
    website: 'https://www.enabel.be'
  }
];

const Partners = () => {
  return (
    <Layout>
      <SEOHead
        title="Our Partners"
        description="Collaborating with government, international donors like FCDO & EU, and civil society to build a just Tanzania."
        canonicalUrl="https://lsftz.org/partners"
      />
      <CinematicHero
        title="Our Partners"
        badge="Strategic Alliances"
        description="Collaborating with global leaders to build a just Tanzania."
        backgroundImage="/lovable-uploads/lsf from IGP sirro police award.jpg"
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
