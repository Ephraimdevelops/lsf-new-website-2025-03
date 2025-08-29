import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Target } from "lucide-react";
import Container from "@/components/shared/Container";
import Typography from "@/components/shared/Typography";
import { Link } from "react-router-dom";

const StrategicFocusAreasSection = () => {
  const approaches = [
    {
      title: "Grant-Making & Management",
      description: "Funding 100+ organizations to deliver frontline legal aid where it’s needed most.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/grant-making",
    },
    {
      title: "Direct Project Implementation",
      description: "Designing high-impact programs like Wanawake Tunaweza for grassroots justice.",
      image: "/lovable-uploads/1697191159.jpg",
      link: "/what-we-do/direct-implementation",
    },
    {
      title: "Policy Influence & Advocacy",
      description: "Pushing for justice-centered reforms from community voices to parliament.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/advocacy-policy",
    },
    {
      title: "Research, Monitoring & Learning",
      description: "Turning data into action to strengthen programs and drive systemic reform.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      link: "/what-we-do/learning-research",
    },
    {
      title: "Partnerships & Networking",
      description: "Scaling justice innovations with civil society, government, and global partners.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/what-we-do/partnerships-networking",
    },
  ];

  const focusAreas = [
    {
      title: "Expanding Access to Legal Aid",
      description: "Scaling affordable, high-quality legal aid so rural, underserved communities can secure justice when they need it most.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/focus-areas/accessible-legal-aid",
    },
    {
      title: "Advancing Legal Empowerment",
      description: "Equipping communities with knowledge and skills to claim rights and advocate for systemic change.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/empowered-communities",
    },
    {
      title: "Strengthening Gender Justice",
      description: "Confronting gender-based violence, promoting equality, and ensuring women’s rights are protected.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d877c82899?w=800&h=600&fit=crop",
      link: "/resources/gender-justice",
    },
    {
      title: "Supporting Legal Reform",
      description: "Working with policymakers to strengthen laws and align policies with human rights.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/what-we-do/advocacy-policy",
    },
    {
      title: "Promoting Inclusive Innovation",
      description: "Leveraging digital tools like Haki Yangu App and WhatsApp bots to expand legal access.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/digital-transformation",
    },
  ];

  const [currentApproach, setCurrentApproach] = useState(0);
  const [currentFocus, setCurrentFocus] = useState(0);

  const prev = (setter) => setter((prev) => Math.max(prev - 1, 0));
  const next = (setter, total) => setter((prev) => Math.min(prev + 1, total - 1));

  const renderSlider = (cards, current, setter) => (
    <div className="relative">
      {/* Slider Track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * (100 / 2.7)}%)` }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[70%] md:min-w-[33%] max-w-[70%] md:max-w-[33%] flex-shrink-0 px-4"
          >
            <div className="rounded-2xl border border-gray-200 bg-white shadow hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col">
              {/* Image */}
              <div className="h-56 md:h-64 lg:h-72 w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-base mb-4 flex-1">
                  {card.description}
                </p>
                <Link
                  to={card.link}
                  className="inline-flex items-center text-[#931E5C] font-medium hover:underline"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() => prev(setter)}
        disabled={current === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border hover:bg-gray-100 transition disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      <button
        onClick={() => next(setter, cards.length)}
        disabled={current === cards.length - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border hover:bg-gray-100 transition disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );

  return (
    <>
      {/* Approaches Section */}
      <section className="py-20 bg-gray-50">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-4">
              <Target className="h-5 w-5 text-[#931E5C] mr-2" />
              <span className="text-sm font-semibold text-gray-800">
                Strategic Approaches
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We Drive <span className="text-[#931E5C]">Justice</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our five strategic approaches shape how we deliver impact and empower communities across Tanzania.
            </p>
          </div>
          {renderSlider(approaches, currentApproach, setCurrentApproach)}
        </Container>
      </section>

      {/* Focus Areas Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-4">
              <Target className="h-5 w-5 text-[#931E5C] mr-2" />
              <span className="text-sm font-semibold text-gray-800">
                Strategic Focus Areas
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Where We <span className="text-[#931E5C]">Create Change</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These focus areas ensure that our work remains bold, relevant, and impactful for women, youth, and marginalized communities.
            </p>
          </div>
          {renderSlider(focusAreas, currentFocus, setCurrentFocus)}
        </Container>
      </section>
    </>
  );
};

export default StrategicFocusAreasSection;
