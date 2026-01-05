import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight, Target, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/shared/Container";
import { Link } from "react-router-dom";
import { useRef } from "react";

const StrategicFocusAreasSection = () => {
  const approaches = [
    {
      title: "Grant-Making",
      description: "Funding 100+ organizations to deliver frontline legal aid.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/grant-making",
    },
    {
      title: "Project Implementation",
      description: "Designing high-impact programs for grassroots justice.",
      image: "/lovable-uploads/1697191159.jpg",
      link: "/what-we-do/direct-implementation",
    },
    {
      title: "Policy Advocacy",
      description: "Pushing for justice-centered reforms in parliament.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/advocacy-policy",
    },
    {
      title: "Research & Learning",
      description: "Turning data into action to drive systemic reform.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      link: "/what-we-do/learning-research",
    },
    {
      title: "Partnerships",
      description: "Scaling justice innovations with global partners.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/what-we-do/partnerships-networking",
    },
  ];

  const focusAreas = [
    {
      title: "Access to Legal Aid",
      description: "Scaling affordable aid so communities secure justice.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/focus-areas/accessible-legal-aid",
    },
    {
      title: "Legal Empowerment",
      description: "Equipping communities to claim rights and advocate.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/empowered-communities",
    },
    {
      title: "Gender Justice",
      description: "Confronting GBV and ensuring women’s rights.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d877c82899?w=800&h=600&fit=crop",
      link: "/resources/gender-justice",
    },
    {
      title: "Legal Reform",
      description: "Working with policymakers to strengthen laws.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/what-we-do/advocacy-policy",
    },
    {
      title: "Inclusive Innovation",
      description: "Leveraging digital tools like Haki Yangu App.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/digital-transformation",
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
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const SliderSection = ({ title, subtitle, items, bgClass = "bg-white" }) => {
    const sliderRef = useRef<Slider>(null);

    return (
      // Reduced py-20 to py-12 (decrease padding)
      <section className={`py-12 ${bgClass} border-b border-neutral-100`}>
        <Container size="xl"> {/* Restored to xl */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-2 gap-8">
            <div className="max-w-4xl text-left"> {/* Explicit text-left */}
              <div className="inline-flex items-center gap-2 text-primary font-bold mb-3 uppercase tracking-widest text-sm bg-primary/5 px-4 py-1.5 rounded-full"> {/* Increased text size and padding slightly */}
                <Target className="h-4 w-4" />
                {subtitle}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900">{title}</h2> {/* Increased heading sizes */}
            </div>

            {/* Custom Arrows */}
            <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-neutral-600 shadow-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all text-neutral-600 shadow-sm"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="-mx-3">
            <Slider ref={sliderRef} {...sliderSettings}>
              {items.map((item, idx) => (
                <div key={idx} className="px-3 pb-6"> {/* Increased bottom padding for shadow room */}
                  <Link to={item.link} className="block group h-full">
                    {/* Increased border radius and shadow */}
                    <div className="bg-white rounded-[1.5rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {/* Image - Increased height by 1.5rem approx (h-64 is 16rem, was h-56 14rem) */}
                      <div className="h-[18rem] overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>

                      {/* Content - Increased padding and font sizes */}
                      <div className="p-8 flex flex-col flex-grow"> {/* p-6 -> p-8 (+?.5rem but larger feel) */}
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-primary transition-colors line-clamp-2"> {/* text-xl -> text-2xl */}
                          {item.title}
                        </h3>
                        <p className="text-neutral-600 text-base mb-6 line-clamp-4 leading-relaxed flex-grow"> {/* text-sm -> text-base */}
                          {item.description}
                        </p>
                        <div className="flex items-center text-primary font-bold text-base mt-auto"> {/* text-sm -> text-base */}
                          Learn more <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" /> {/* icon w-4->w-5 */}
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
      <SliderSection
        title="Our Strategic Approaches"
        subtitle="How We Work"
        items={approaches}
        bgClass="bg-neutral-50"
      />
      <SliderSection
        title="Strategic Focus Areas"
        subtitle="Where We Work"
        items={focusAreas}
        bgClass="bg-white"
      />
    </>
  );
};

export default StrategicFocusAreasSection;
