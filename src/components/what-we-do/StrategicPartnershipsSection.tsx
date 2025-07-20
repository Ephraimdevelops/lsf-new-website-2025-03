import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Globe, Heart, CheckCircle } from 'lucide-react';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import DesignButton from '@/components/design-system/DesignButton';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const StrategicPartnershipsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const partnerCategories = [
    {
      icon: <Building2 className="h-12 w-12" />,
      title: "Government Partners",
      description: "Strengthening legal frameworks with national and local institutions.",
      partners: [
        { name: "Ministry of Constitutional and Legal Affairs", image: "https://images.unsplash.com/photo-1560264280-9d4b0ed6a022?w=100&h=100&fit=crop" },
        { name: "Judiciary of Tanzania", image: "https://images.unsplash.com/photo-1560264418-8b6e3e4b8739?w=100&h=100&fit=crop" },
        { name: "Local Government Authorities", image: "https://images.unsplash.com/photo-1516321310764-8d9b6f3a1342?w=100&h=100&fit=crop" }
      ],
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "International Partners",
      description: "Bringing global best practices and resources to Tanzania.",
      partners: [
        { name: "European Union", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=100&h=100&fit=crop" },
        { name: "UN Women", image: "https://images.unsplash.com/photo-1592035346140-3f5e19575cb6?w=100&h=100&fit=crop" },
        { name: "World Bank Group", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=100&h=100&fit=crop" }
      ],
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Civil Society",
      description: "Driving community-based solutions with grassroots organizations.",
      partners: [
        { name: "Women's Legal Aid Centre", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop" },
        { name: "Tanzania Women Lawyers Association", image: "https://images.unsplash.com/photo-1531482615713-2afd67497998?w=100&h=100&fit=crop" },
        { name: "Community Legal Aid Centers", image: "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=100&h=100&fit=crop" }
      ],
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Private Sector",
      description: "Supporting legal empowerment through CSR and partnerships.",
      partners: [
        { name: "Law Firms Consortium", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop" },
        { name: "Financial Institutions", image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=100&h=100&fit=crop" },
        { name: "Technology Partners", image: "https://images.unsplash.com/photo-1516321310764-8d9b6f3a1342?w=100&h=100&fit=crop" }
      ],
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="py-24 bg-transparent relative">
      {/* Background Image with Fading Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 to-neutral-900/50"></div>

      <Container size="xl" className="relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-3"></div>
            <Text variant="overline" color="white" className="font-semibold text-base tracking-wider">
              STRATEGIC PARTNERSHIPS
            </Text>
          </div>
          <Heading level={2} className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Building Coalitions for
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Lasting Change
            </span>
          </Heading>
          <Text variant="body" className="text-lg leading-relaxed text-white/80">
            Our impact is amplified through strategic partnerships with government, civil society, international organizations, and the private sector.
          </Text>
        </div>

        {/* Accordion Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {partnerCategories.map((category, index) => (
            <div
              key={index}
              className="max-w-sm mx-auto bg-neutral-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden"
            >
              {/* Accordion Header */}
              <div
                className="flex items-center p-4 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${category.color} hover:scale-110 transition-transform duration-500 ease-in-out mr-4`}>
                  {category.icon}
                </div>
                <Heading level={4} className="text-xl font-semibold text-white">
                  {category.title}
                </Heading>
              </div>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-0">
                  <Text variant="body-small" className="text-white/80 text-sm leading-relaxed mb-3">
                    {category.description}
                  </Text>
                  <div className="flex flex-col gap-2">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="flex items-center gap-2">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <Text variant="body-small" className={`text-white/80 font-medium text-sm bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                          {partner.name}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default StrategicPartnershipsSection;