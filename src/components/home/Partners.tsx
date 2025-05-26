
import { ExternalLink, Heart, Globe, Users, Award } from 'lucide-react';

const Partners = () => {
  const partners = [
    {
      name: 'European Union',
      logo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Supporting gender justice initiatives across Tanzania',
      partnership: 'Major Donor'
    },
    {
      name: 'UK Aid',
      logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Funding legal empowerment and access to justice programs',
      partnership: 'Development Partner'
    },
    {
      name: 'North South Cooperation',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Supporting community-driven development initiatives',
      partnership: 'Strategic Partner'
    },
    {
      name: 'Enabel',
      logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Belgian development agency supporting our flagship projects',
      partnership: 'Implementation Partner'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[45px] font-black leading-[47.7px] text-[#231f20] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Our Strategic Partners
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-black max-w-3xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Working together with international development partners to amplify our impact and reach more communities across Tanzania
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img 
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h3 className="font-bold text-lg text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                {partner.name}
              </h3>
              
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
                {partner.partnership}
              </span>
              
              <p className="text-neutral-gray text-sm leading-relaxed">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partnership Impact Stats */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary-teal/5 to-secondary-orange/5 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-primary mb-1">$47M+</div>
              <div className="text-sm text-gray-600">Total Grants Disbursed</div>
            </div>
            <div className="group">
              <Globe className="h-8 w-8 text-secondary-teal mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-secondary-teal mb-1">184</div>
              <div className="text-sm text-gray-600">Districts Covered</div>
            </div>
            <div className="group">
              <Users className="h-8 w-8 text-secondary-orange mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-secondary-orange mb-1">426K+</div>
              <div className="text-sm text-gray-600">Lives Transformed</div>
            </div>
            <div className="group">
              <Award className="h-8 w-8 text-secondary-yellow mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-secondary-yellow mb-1">105K+</div>
              <div className="text-sm text-gray-600">Groups Supported</div>
            </div>
          </div>
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-8">
          <p className="text-neutral-gray mb-6">
            Interested in partnering with us to expand access to justice across Tanzania?
          </p>
          <a 
            href="/partners"
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Become a Partner
            <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Partners;
