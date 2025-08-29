import { useState } from "react";
import { Building2, Users, Globe, Heart } from "lucide-react";
import Heading from "@/components/design-system/Heading";
import Text from "@/components/design-system/Text";
import Section from "@/components/shared/Section";
import Container from "@/components/shared/Container";

const StrategicPartnershipsSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const partnerCategories = [
    {
      icon: <Building2 className="h-10 w-10" />,
      title: "Government Partners",
      description: "Strengthening legal frameworks with national and local institutions.",
      partners: [
        { name: "Ministry of Constitutional and Legal Affairs", image: "https://images.unsplash.com/photo-1560264280-9d4b0ed6a022?w=100&h=100&fit=crop" },
        { name: "Judiciary of Tanzania", image: "https://images.unsplash.com/photo-1560264418-8b6e3e4b8739?w=100&h=100&fit=crop" },
        { name: "Local Government Authorities", image: "https://images.unsplash.com/photo-1516321310764-8d9b6f3a1342?w=100&h=100&fit=crop" },
      ],
      color: "from-primary to-primary-dark",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "International Partners",
      description: "Bringing global best practices and resources to Tanzania.",
      partners: [
        { name: "European Union", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=100&h=100&fit=crop" },
        { name: "UN Women", image: "https://images.unsplash.com/photo-1592035346140-3f5e19575cb6?w=100&h=100&fit=crop" },
        { name: "World Bank Group", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=100&h=100&fit=crop" },
      ],
      color: "from-secondary-teal to-secondary-teal/80",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Civil Society",
      description: "Driving community-based solutions with grassroots organizations.",
      partners: [
        { name: "Women's Legal Aid Centre", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop" },
        { name: "Tanzania Women Lawyers Association", image: "https://images.unsplash.com/photo-1531482615713-2afd67497998?w=100&h=100&fit=crop" },
        { name: "Community Legal Aid Centers", image: "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=100&h=100&fit=crop" },
      ],
      color: "from-secondary-orange to-secondary-orange/80",
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Private Sector",
      description: "Supporting legal empowerment through CSR and partnerships.",
      partners: [
        { name: "Law Firms Consortium", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop" },
        { name: "Financial Institutions", image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=100&h=100&fit=crop" },
        { name: "Technology Partners", image: "https://images.unsplash.com/photo-1516321310764-8d9b6f3a1342?w=100&h=100&fit=crop" },
      ],
      color: "from-secondary-yellow to-secondary-yellow/80",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="py-24 bg-neutral-50 relative">
      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-3"></div>
            <Text variant="overline" className="text-primary font-semibold text-sm tracking-wider">
              Strategic Partnerships
            </Text>
          </div>
          <Heading level={2} className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Building Coalitions for{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Lasting Change
            </span>
          </Heading>
          <Text variant="body" className="text-lg text-neutral-600 leading-relaxed">
            Our impact is amplified through strategic partnerships with government, civil society, 
            international organizations, and the private sector.
          </Text>
        </div>

        {/* Accordion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnerCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Card Header */}
              <div
                className="flex items-center gap-4 p-6 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-r ${category.color} transform transition-transform duration-500 ${
                    openIndex === index ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  {category.icon}
                </div>
                <Heading level={4} className="text-xl font-semibold text-neutral-900">
                  {category.title}
                </Heading>
              </div>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <Text variant="body-small" className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {category.description}
                  </Text>
                  <div className="flex flex-col gap-3">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="flex items-center gap-3">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <Text
                          variant="body-small"
                          className="text-neutral-800 font-medium text-sm"
                        >
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
