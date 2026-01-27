import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight, Target, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Container from "@/components/shared/Container";
import { Link } from "react-router-dom";
import { useRef } from "react";

const StrategicFocusAreasSection = () => {
  // All 6 Strategic Focus Areas (4 Core Pillars + 2 Emerging combined)
  const focusAreas = [
    {
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "Prioritizing accessible, affordable, quality legal aid services to marginalized populations, with emphasis on women and girls.",
      image: "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
      link: "/focus-areas/accessible-legal-aid",
    },
    {
      title: "Promoting Legally Empowered Communities",
      description: "Advancing community legal empowerment through legal education, awareness, and strengthening paralegal networks.",
      image: "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
      link: "/focus-areas/empowered-communities",
    },
    {
      title: "Enhancing a Conducive Environment for Access to Justice",
      description: "Supporting policy reform, legal frameworks, and advocacy for inclusive, sustainable access to justice.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/focus-areas/conducive-environment",
    },
    {
      title: "Institutional Development and Sustainability",
      description: "Strengthening organizational capacity and financial sustainability of LSF and the broader legal aid sector.",
      image: "/lovable-uploads/1697191159.jpg",
      link: "/focus-areas/institutional-development",
    },
    {
      title: "Climate Justice",
      description: "Integrating climate justice into programming, including land rights, environmental governance, and climate-related disputes.",
      image: "/lovable-uploads/mwanamke shamba.png",
      link: "/focus-areas/climate-justice",
      isNew: true,
    },
    {
      title: "Digital Transformation",
      description: "Modernizing operations through digitalization of legal aid service delivery, case tracking, and data systems.",
      image: "/lovable-uploads/lsf-paralegal-servicing.jpeg",
      link: "/focus-areas/digital-transformation",
      isNew: true,
    },
  ];

  // Strategic Approaches
  const approaches = [
    {
      title: "Grant-Making",
      description: "Funding 100+ organizations to deliver frontline legal aid across Tanzania.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/grant-making",
    },
    {
      title: "Project Implementation",
      description: "Designing and executing high-impact programs for grassroots justice delivery.",
      image: "/lovable-uploads/1697191159.jpg",
      link: "/what-we-do/direct-implementation",
    },
    {
      title: "Policy Advocacy",
      description: "Pushing for justice-centered reforms and legislation like the Legal Aid Act 2017.",
      image: "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
      link: "/what-we-do/advocacy-policy",
    },
    {
      title: "Research & Learning",
      description: "Turning data into action to drive evidence-based systemic reform.",
      image: "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
      link: "/what-we-do/learning-research",
    },
    {
      title: "Partnerships & Networking",
      description: "Scaling justice innovations with government, donors, and civil society partners.",
      image: "/lovable-uploads/mwanamke shamba.png",
      link: "/what-we-do/partnerships-networking",
    },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  interface SliderItem {
    title: string;
    description: string;
    image: string;
    link: string;
    isNew?: boolean;
  }

  const SliderSection = ({ title, subtitle, description, items, bgClass = "bg-white" }: {
    title: string;
    subtitle: string;
    description: string;
    items: SliderItem[];
    bgClass?: string;
  }) => {
    const sliderRef = useRef<Slider>(null);

    return (
      <section id={title === "Our Strategic Approaches" ? "strategic-approaches" : undefined} className={`py-20 ${bgClass}`}>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                <Target className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">{subtitle}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
              {description && (
                <p className="text-lg text-gray-600 border-l-4 border-primary pl-6 max-w-2xl">
                  {description}
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="-mx-3">
            <Slider ref={sliderRef} {...sliderSettings}>
              {items.map((item, idx) => (
                <div key={idx} className="px-3 pb-6">
                  <Link to={item.link} className="block group h-full">
                    <div className="bg-white rounded-[1.5rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {/* Image with optional NEW badge */}
                      <div className="h-[18rem] overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        {item.isNew && (
                          <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-secondary-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                            <Sparkles className="h-3 w-3" /> NEW 2025
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-neutral-600 text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
                          {item.description}
                        </p>
                        <div className="flex items-center text-primary font-bold text-base mt-auto">
                          Learn more <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </Container>
      </section>
    );
  };

  return (
    <>
      {/* STRATEGIC FOCUS AREAS (All 6 combined) */}
      <SliderSection
        title="Strategic Focus Areas"
        subtitle="Where We Focus"
        description="Our work is organized around six strategic focus areas that address fundamental challenges in accessing justice across Tanzania."
        items={focusAreas}
        bgClass="bg-white"
      />

      {/* APPROACHES - Slightly grey background */}
      <SliderSection
        title="Our Strategic Approaches"
        subtitle="How We Work"
        description="We deploy a multi-pronged strategy combining grant-making, direct implementation, policy advocacy, and research."
        items={approaches}
        bgClass="bg-gray-50/70"
      />
    </>
  );
};

export default StrategicFocusAreasSection;
