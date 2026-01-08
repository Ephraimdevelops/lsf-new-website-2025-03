import { Building2, Users, Globe, Heart } from "lucide-react";
import Heading from "@/components/design-system/Heading";
import Text from "@/components/design-system/Text";
import Section from "@/components/shared/Section";
import Container from "@/components/shared/Container";

const StrategicPartnershipsSection = () => {
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
      bg: "hover:bg-primary/5 hover:border-primary/30",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "International Partners",
      description: "Bringing global best practices and funding to Tanzania.",
      partners: [
        { name: "European Union", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=100&h=100&fit=crop" },
        { name: "UN Women", image: "https://images.unsplash.com/photo-1592035346140-3f5e19575cb6?w=100&h=100&fit=crop" },
        { name: "World Bank", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=100&h=100&fit=crop" },
      ],
      bg: "hover:bg-primary/5 hover:border-primary/30",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Civil Society",
      description: "Driving community-based solutions with grassroots organizations.",
      partners: [
        { name: "Women's Legal Aid Centre", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop" },
        { name: "TAWLA", image: "https://images.unsplash.com/photo-1531482615713-2afd67497998?w=100&h=100&fit=crop" },
        { name: "Legal Services", image: "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=100&h=100&fit=crop" },
      ],
      bg: "hover:bg-primary/5 hover:border-primary/30",
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
      bg: "hover:bg-primary/5 hover:border-primary/30",
    },
  ];

  return (
    <Section className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="mb-16">
          {/* Primary Pill Badge */}
          <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
            <Globe className="h-4 w-4" />
            <span className="font-bold text-sm uppercase tracking-widest">Our Network</span>
          </div>
          <Heading level={2} className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Building Coalitions for <span className="text-primary">Lasting Change</span>
          </Heading>
          <Text variant="body" className="text-lg text-gray-600 max-w-2xl border-l-4 border-primary pl-6">
            Our impact is amplified through strategic partnerships with government, civil society,
            international organizations, and the private sector.
          </Text>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerCategories.map((category, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${category.bg}`}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 flex items-center justify-center text-primary mb-6 shadow-sm">
                {category.icon}
              </div>

              <Heading level={4} className="text-xl font-bold text-neutral-900 mb-3">
                {category.title}
              </Heading>

              <Text variant="body-small" className="text-neutral-500 text-sm leading-relaxed mb-6 h-10">
                {category.description}
              </Text>

              <div className="border-t border-neutral-100 pt-6 flex flex-col gap-3">
                {category.partners.map((partner, partnerIndex) => (
                  <div key={partnerIndex} className="flex items-center gap-3">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <Text
                      variant="body-small"
                      className="text-neutral-700 font-medium text-xs truncate"
                    >
                      {partner.name}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default StrategicPartnershipsSection;
