
import Layout from '../components/layout/Layout';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PartnerProps {
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  category: string;
}

const PartnerCard = ({ name, description, logoUrl, website }: PartnerProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="h-32 flex items-center justify-center p-6 border-b border-gray-100">
        <img 
          src={logoUrl} 
          alt={name} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{name}</h3>
        <p className="text-neutral-gray mb-4 text-sm">{description}</p>
        <a 
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Visit Website
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const Partners = () => {
  // Partners data - organized by category
  const partners = {
    donors: [
      {
        name: "Ministry of Foreign Affairs, Denmark",
        description: "Primary donor supporting LSF's core programs and organizational development.",
        logoUrl: "https://images.unsplash.com/photo-1568034428942-20b1614c526b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://um.dk/en",
        category: "donors"
      },
      {
        name: "European Union",
        description: "Supports LSF's work on legal empowerment and access to justice programs.",
        logoUrl: "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://european-union.europa.eu/",
        category: "donors"
      },
      {
        name: "Swedish International Development Cooperation Agency",
        description: "Partners with LSF on gender justice initiatives and women's rights programming.",
        logoUrl: "https://images.unsplash.com/photo-1568600891621-50f697e32f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.sida.se/en",
        category: "donors"
      },
      {
        name: "Global Affairs Canada",
        description: "Supports LSF's climate justice initiatives in coastal communities.",
        logoUrl: "https://images.unsplash.com/photo-1515674447568-090f4232f89d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.international.gc.ca/",
        category: "donors"
      }
    ],
    government: [
      {
        name: "Ministry of Justice and Constitutional Affairs",
        description: "Collaborates with LSF on legal reforms and improving the justice system in Tanzania.",
        logoUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.justice.go.tz/",
        category: "government"
      },
      {
        name: "Ministry of Community Development, Gender, Women and Special Groups",
        description: "Partners with LSF on gender justice and women's empowerment programs.",
        logoUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "#",
        category: "government"
      },
      {
        name: "Tanzania Police Force",
        description: "Works with LSF to improve gender-responsive policing and handling of gender-based violence cases.",
        logoUrl: "https://images.unsplash.com/photo-1610375461249-f5fc8e6ad6e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.polisi.go.tz/",
        category: "government"
      }
    ],
    civil_society: [
      {
        name: "Legal and Human Rights Centre",
        description: "Key implementing partner for human rights monitoring and strategic litigation.",
        logoUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.lhrc.or.tz/",
        category: "civil_society"
      },
      {
        name: "Tanzania Women Lawyers Association",
        description: "Partners with LSF to provide legal aid services specifically focused on women's issues.",
        logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.tawla.or.tz/",
        category: "civil_society"
      },
      {
        name: "Tanganyika Law Society",
        description: "Collaborates with LSF on providing pro bono legal services and capacity building for lawyers.",
        logoUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://tls.or.tz/",
        category: "civil_society"
      },
      {
        name: "Envirocare",
        description: "Works with LSF on climate justice initiatives and environmental rights awareness.",
        logoUrl: "https://images.unsplash.com/photo-1590323533736-f40bafece72f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://envirocaretz.org/",
        category: "civil_society"
      },
      {
        name: "Tanzania Gender Networking Programme",
        description: "Partners with LSF on gender mainstreaming and women's leadership initiatives.",
        logoUrl: "https://images.unsplash.com/photo-1591111403512-068e3cd4d5cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "http://tgnp.org/",
        category: "civil_society"
      },
      {
        name: "Tanzania Network of Legal Aid Providers",
        description: "Network of organizations that partner with LSF to coordinate and strengthen legal aid services.",
        logoUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "#",
        category: "civil_society"
      }
    ],
    international: [
      {
        name: "Namati",
        description: "Global legal empowerment organization that collaborates with LSF on methodology and learning.",
        logoUrl: "https://images.unsplash.com/photo-1584119164246-461d43e9bab3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://namati.org/",
        category: "international"
      },
      {
        name: "UN Women",
        description: "Partners with LSF on gender justice initiatives and women's economic empowerment.",
        logoUrl: "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.unwomen.org/",
        category: "international"
      },
      {
        name: "UNDP Tanzania",
        description: "Collaborates with LSF on access to justice programs and support to the justice sector.",
        logoUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        website: "https://www.tz.undp.org/",
        category: "international"
      }
    ]
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-orange pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl opacity-90">
              We collaborate with a diverse network of organizations to promote justice for all in Tanzania.
            </p>
          </div>
        </div>
      </section>
      
      {/* Partnership Approach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Partnership Approach</h2>
              <p className="text-neutral-gray mb-4">
                At Legal Services Facility, we believe in the power of partnership and collaboration. 
                We work with a diverse range of stakeholders, including government institutions, civil society 
                organizations, donor agencies, and international partners to advance access to justice in Tanzania.
              </p>
              <p className="text-neutral-gray mb-4">
                Our partnerships are guided by principles of mutual respect, transparency, and shared commitment 
                to our mission. We value the unique expertise, resources, and perspectives that each partner brings 
                to our collective efforts.
              </p>
              <p className="text-neutral-gray">
                Together with our partners, we implement programs, advocate for policy changes, share knowledge, 
                and build capacity to create sustainable impact in promoting justice for all.
              </p>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Partnership Workshop" 
                    className="rounded-lg shadow-md"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Collaboration Meeting" 
                    className="rounded-lg shadow-md"
                  />
                </div>
                <div className="mt-8 space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Community Partners" 
                    className="rounded-lg shadow-md"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Partnership Agreement" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Development Partners & Donors */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Development Partners & Donors</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              We are grateful for the support of our development partners and donors who make our work possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.donors.map((partner, index) => (
              <PartnerCard
                key={index}
                name={partner.name}
                description={partner.description}
                logoUrl={partner.logoUrl}
                website={partner.website}
                category={partner.category}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Government Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Government Partners</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              We collaborate with government institutions to strengthen access to justice systems in Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.government.map((partner, index) => (
              <PartnerCard
                key={index}
                name={partner.name}
                description={partner.description}
                logoUrl={partner.logoUrl}
                website={partner.website}
                category={partner.category}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Civil Society Partners */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Civil Society Partners</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              We partner with civil society organizations to implement programs and advocate for justice reform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.civil_society.map((partner, index) => (
              <PartnerCard
                key={index}
                name={partner.name}
                description={partner.description}
                logoUrl={partner.logoUrl}
                website={partner.website}
                category={partner.category}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* International Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">International Partners</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              We collaborate with international organizations to share knowledge and best practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.international.map((partner, index) => (
              <PartnerCard
                key={index}
                name={partner.name}
                description={partner.description}
                logoUrl={partner.logoUrl}
                website={partner.website}
                category={partner.category}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Become a Partner CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
            <p className="opacity-90 mb-8">
              LSF is always looking for new partnerships that align with our mission to promote 
              access to justice for all, particularly for women and other vulnerable groups in Tanzania.
            </p>
            <Link 
              to="/contact" 
              className="bg-white text-primary hover:bg-neutral-100 px-8 py-3 rounded-md font-bold transition duration-300 inline-flex items-center"
            >
              Contact Us to Explore Partnership
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
