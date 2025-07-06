import { ExternalLink } from 'lucide-react';

const partners = [
  {
    name: "United Nations Development Programme",
    logo: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png",
    category: "International Organizations"
  },
  {
    name: "World Bank Group",
    logo: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png",
    category: "Development Finance"
  },
  {
    name: "European Union",
    logo: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png",
    category: "Regional Partners"
  },
  {
    name: "Ford Foundation",
    logo: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png",
    category: "Philanthropic Partners"
  },
  {
    name: "Open Society Foundations",
    logo: "/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png",
    category: "Civil Society"
  },
  {
    name: "Mastercard Foundation",
    logo: "/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png",
    category: "Innovation Partners"
  }
];

const PartnersSection = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-neutral-900 mb-6">
            Strategic Partnerships
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
            Working together with leading organizations to amplify our impact 
            and create sustainable change across Tanzania and beyond.
          </p>
        </div>
        
        {/* Partners grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-neutral-100 hover:border-neutral-200"
            >
              <div className="aspect-square relative mb-3">
                <img 
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-neutral-900 text-sm mb-1 group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {partner.category}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Partnership highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <div className="text-neutral-600 font-medium">Active Partnerships</div>
            <div className="text-sm text-neutral-500 mt-2">Across 5 continents</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="text-3xl font-bold text-secondary-teal mb-2">$50M+</div>
            <div className="text-neutral-600 font-medium">Joint Funding</div>
            <div className="text-sm text-neutral-500 mt-2">Since 2017</div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
            <div className="text-3xl font-bold text-secondary-orange mb-2">25</div>
            <div className="text-neutral-600 font-medium">Countries Reached</div>
            <div className="text-sm text-neutral-500 mt-2">Through partnerships</div>
          </div>
        </div>
        
        {/* Partnership CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Become a Partner
            </h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Join our network of partners committed to advancing justice and 
              legal empowerment across Tanzania and the region.
            </p>
            <a 
              href="/partners"
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              Partnership Opportunities
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;