
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import FocusAreaImageCard from "./FocusAreaImageCard";

// Images mapped to each focus area (ensure these images exist in /public/lovable-uploads/ or replace with your actual images)
const focusAreasData = [
  {
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    title: "Quality Legal Aid",
    description: "Accessible, affordable legal aid for marginalized populations, especially women and girls—empowering just communities.",
    link: "/focus-areas/accessible-legal-aid",
  },
  {
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    title: "Community Empowerment",
    description: "Building legal knowledge and awareness, strengthening paralegal networks for sustainable change across Tanzania.",
    link: "/focus-areas/empowered-communities",
  },
  {
    image: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png",
    title: "Policy & Justice Reform",
    description: "Advocating for policies and systems that protect rights, promote equity, and foster long-term access to justice.",
    link: "/focus-areas/conducive-environment",
  },
  {
    image: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png",
    title: "Institutional Development",
    description: "Strengthening the capacity, sustainability, and operational effectiveness of LSF and its partners.",
    link: "/focus-areas/institutional-development",
  },
  {
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png",
    title: "Climate Justice",
    description: "Integrating climate justice in legal empowerment—protecting land rights and supporting vulnerable communities.",
    link: "/focus-areas/climate-justice",
  },
  {
    image: "/lovable-uploads/e1ab15b7-1be8-4b43-a3c3-0e4c6b7a0c02.png",
    title: "Digital Transformation",
    description: "Leveraging technology for wider access: digital case tracking, online legal aid, and digital training platforms.",
    link: "/focus-areas/digital-transformation",
  },
];

const FocusAreas = () => (
  <Section variant="secondary" padding="xl">
    <Container size="xl">
      <div className="text-center mb-12 md:mb-20 px-4">
        <div className="inline-flex items-center bg-primary/10 rounded-full px-6 md:px-8 py-3 md:py-4 mb-6 md:mb-8">
          <span className="text-primary font-bold text-sm md:text-lg tracking-widest uppercase">OUR FOCUS</span>
        </div>
        <h2 className="mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl font-bold font-heading">
          Empowering Communities
          <span className="block text-primary">Through Legal Access</span>
        </h2>
        <p className="text-neutral-gray max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
          We work tirelessly to ensure every Tanzanian has access to justice, legal education, and the support they need to live with dignity and security.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {focusAreasData.map((area, i) => (
          <FocusAreaImageCard
            key={i}
            image={area.image}
            title={area.title}
            description={area.description}
            link={area.link}
          />
        ))}
      </div>
    </Container>
  </Section>
);

export default FocusAreas;

