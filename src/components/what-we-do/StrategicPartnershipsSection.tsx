import { Building2, Users, Globe, Heart } from "lucide-react";
import Heading from "@/components/design-system/Heading";
import Text from "@/components/design-system/Text";
import Section from "@/components/shared/Section";
import Container from "@/components/shared/Container";

const StrategicPartnershipsSection = () => {
  // Flattened array of all unique partners (Matched to Homepage Order)
  const allPartners = [
    { name: "Danish Embassy", image: "/lovable-uploads/Danish amabssador.png" },
    { name: "FCDO", image: "/lovable-uploads/FCDO_logo.png" },
    { name: "European Union", image: "/lovable-uploads/Funded by European Union.png" },
    { name: "The World Bank", image: "/lovable-uploads/WorldBank_logo.jpg" },
    { name: "WINGS", image: "/lovable-uploads/WINGS_logo.png" },
    { name: "Enabel", image: "/lovable-uploads/Enabel.png" },
  ];

  return (
    <Section className="py-20 bg-white overflow-hidden">
      <Container>
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary rounded-full px-6 py-2 mb-5">
            <Globe className="h-4 w-4" />
            <span className="font-bold text-sm uppercase tracking-widest">Our Network</span>
          </div>
          <Heading level={2} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Building Coalitions for Change
          </Heading>
        </div>

        {/* Infinite Sliding Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks for smooth fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="flex w-[200%] animate-marquee">
            {/* First Set */}
            <div className="flex items-center justify-around w-full shrink-0">
              {allPartners.map((partner, index) => (
                <div key={`p1-${index}`} className="flex-shrink-0 px-8 md:px-12">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="h-24 md:h-32 w-auto object-contain opacity-100 hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            {/* Duplicate Set for Seamless Loop */}
            <div className="flex items-center justify-around w-full shrink-0">
              {allPartners.map((partner, index) => (
                <div key={`p2-${index}`} className="flex-shrink-0 px-8 md:px-12">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="h-24 md:h-32 w-auto object-contain opacity-100 hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Animation Style */}
          <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
      </Container>
    </Section>
  );
};

export default StrategicPartnershipsSection;
