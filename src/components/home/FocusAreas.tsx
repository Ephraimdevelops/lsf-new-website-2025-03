
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import FocusAreaImageCard from "./FocusAreaImageCard";
import Heading from "@/components/design-system/Heading";
import Text from "@/components/design-system/Text";
import DesignIcon from "@/components/design-system/DesignIcon";
import { useDesignSystem } from "@/hooks/useDesignSystem";

// Updated focus areas data with better color coordination and clearer messaging
const focusAreasData = [
  {
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    title: "Quality Legal Aid",
    description: "Breaking barriers to justice with accessible, affordable legal aid for marginalized populations—empowering communities through professional legal support.",
    link: "/focus-areas/accessible-legal-aid",
  },
  {
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    title: "Community Empowerment",
    description: "Building legal knowledge from the ground up—training paralegals and strengthening community networks for sustainable, grassroots change.",
    link: "/focus-areas/empowered-communities",
  },
  {
    image: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png",
    title: "Policy & Justice Reform",
    description: "Driving systemic change through strategic policy advocacy, judicial reforms, and institutional strengthening for long-term impact.",
    link: "/focus-areas/conducive-environment",
  },
  {
    image: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png",
    title: "Institutional Development",
    description: "Strengthening organizational capacity, ensuring financial sustainability, and building resilient systems for lasting change.",
    link: "/focus-areas/institutional-development",
  },
  {
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png",
    title: "Climate Justice",
    description: "Protecting vulnerable communities from climate impacts—securing land rights and advocating for environmental justice policies.",
    link: "/focus-areas/climate-justice",
  },
  {
    image: "/lovable-uploads/e1ab15b7-1be8-4b43-a3c3-0e4c6b7a0c02.png",
    title: "Digital Innovation",
    description: "Leveraging technology to democratize justice—digital case tracking, online legal aid, and mobile-first training platforms.",
    link: "/focus-areas/digital-transformation",
  },
];

const FocusAreas = () => {
  const { tokens, getPrimaryColor, getSecondaryColor } = useDesignSystem();

  return (
    <Section variant="default" padding="xl">
      <Container size="xl">
        {/* Enhanced header with better visual hierarchy */}
        <div className="text-center mb-20 px-4 relative">
          {/* Floating badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
              Strategic Focus Areas
            </Text>
          </div>
          
          {/* Main heading with gradient text */}
          <Heading level={2} variant="hero" gradient className="mb-8">
            Transforming Justice
            <span className="block text-neutral-dark mt-2">
              Across Tanzania
            </span>
          </Heading>
          
          {/* Enhanced description */}
          <div className="max-w-4xl mx-auto">
            <Text variant="body-large" color="neutral" className="mb-6">
              Our comprehensive approach addresses every aspect of legal empowerment—from individual support to systemic change.
            </Text>
            <div className="flex items-center justify-center gap-8 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <DesignIcon 
                  icon={<div className="w-2 h-2 bg-primary rounded-full"></div>}
                  size="xs"
                />
                <Text variant="caption" color="muted">426,349+ Beneficiaries</Text>
              </div>
              <div className="flex items-center gap-2">
                <DesignIcon 
                  icon={<div className="w-2 h-2 bg-secondary-teal rounded-full"></div>}
                  size="xs"
                />
                <Text variant="caption" color="muted">25 Regions Covered</Text>
              </div>
              <div className="flex items-center gap-2">
                <DesignIcon 
                  icon={<div className="w-2 h-2 bg-secondary-orange rounded-full"></div>}
                  size="xs"
                />
                <Text variant="caption" color="muted">15+ Years Experience</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Grid with enhanced spacing and visual flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {focusAreasData.map((area, i) => (
            <div 
              key={i} 
              className="group"
              style={{ 
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <FocusAreaImageCard
                image={area.image}
                title={area.title}
                description={area.description}
                link={area.link}
              />
            </div>
          ))}
        </div>

        {/* Bottom call-to-action */}
        <div className="text-center mt-16 pt-12 border-t border-neutral-100">
          <Text variant="body-large" color="neutral" className="mb-6">
            Each focus area represents decades of expertise and thousands of lives transformed.
          </Text>
          <div className="inline-flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <DesignIcon 
                icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
                size="sm"
              />
              <Text variant="body" color="primary" className="font-semibold">
                Explore our comprehensive approach
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
