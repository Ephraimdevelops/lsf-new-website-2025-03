import { 
  ArrowRight, 
  DollarSign, 
  Users, 
  Megaphone, 
  BookOpen, 
  Zap,
  Scale, 
  GraduationCap, 
  Heart, 
  FileText, 
  Building, 
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const StrategicFocusAreasSection = () => {
  const approaches = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Grant-Making and Management",
      description: "Funding over 100 organizations to deliver frontline legal aid in underserved regions.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/grant-making",
      cta: "Explore Grant-Making"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Direct Project Implementation",
      description: "Designing high-impact programs like Wanawake Tunaweza for legal interventions.",
      image: "/lovable-uploads/1697191159.jpg",
      link: "/what-we-do/direct-implementation",
      cta: "Discover Our Programs"
    },
    {
      icon: <Megaphone className="h-6 w-6" />,
      title: "Policy Influence and Advocacy",
      description: "Pushing for justice-centered laws from communities to parliament.",
      image: "/lovable-uploads/IMG-20230831-WA0003.jpg",
      link: "/what-we-do/advocacy-policy",
      cta: "Learn About Advocacy"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Research, Monitoring, and Learning",
      description: "Translating evidence into action to improve programs and reforms.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      link: "/what-we-do/learning-research",
      cta: "Explore Our Research"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Partnerships & Networking",
      description: "Scaling digital tools like Haki Yangu App for low-tech communities.",
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/what-we-do/partnerships-networking",
      cta: "Join Our Network"
    }
  ];

  const focusAreas = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Expanding Access to Legal Aid",
      description: "We scale affordable, high-quality legal aid services so rural, underserved communities—especially women—can secure justice when they need it most.",
      stats: [
        "426,000+ beneficiaries served",
        "105,000+ legal providers supported"
      ],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/focus-areas/accessible-legal-aid",
      cta: "Explore Legal Aid"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Advancing Legal Empowerment",
      description: "We equip communities with the knowledge, skills, and confidence to understand the law, claim their rights, and advocate for systemic change.",
      stats: [
        "39.8M+ reached via education",
        "Legal clubs and paralegal outreach"
      ],
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/empowered-communities",
      cta: "Learn Empowerment"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Strengthening Gender Justice",
      description: "We confront gender-based violence, champion equality, and ensure women's rights are upheld through targeted programs, survivor services, and community advocacy.",
      stats: [
        "Sauti ya Mwanamke program",
        "Survivors aided with services"
      ],
      image: "https://images.unsplash.com/photo-1573496359142-b8d877c82899?w=800&h=600&fit=crop",
      link: "/resources/gender-justice",
      cta: "Discover Gender Justice"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Supporting Legal Reform",
      description: "We work with policymakers and stakeholders to strengthen laws, align policies with human rights, and create a justice system that serves all.",
      stats: [
        "Constitutional and code reforms",
        "Influenced key legal policies"
      ],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      link: "/what-we-do/advocacy-policy",
      cta: "See Policy Impact"
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Building Justice Systems",
      description: "We strengthen paralegal units and civil society organisations, ensuring sustainable legal aid infrastructure that delivers long-term systemic improvements.",
      stats: [
        "Toolkits and capacity building",
        "Monitoring justice systems"
      ],
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/institutional-development",
      cta: "Explore Sustainability"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Promoting Inclusive Innovation",
      description: "We leverage technology and innovation to expand legal aid access for youth, persons with disabilities, and communities with limited digital resources.",
      stats: [
        "Haki Yangu App + WhatsApp bots",
        "Legal aid via SMS & USSD"
      ],
      image: "https://images.unsplash.com/photo-1516321318423-4b6a0b0f0e6a?w=800&h=600&fit=crop",
      link: "/focus-areas/digital-transformation",
      cta: "Discover Innovation"
    }
  ];

  return (
    <>
      <style jsx>{`
        .hover-scale {
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.03);
          opacity: 0.95;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .org-button {
          background-color: #931E5C;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .org-button:hover {
          background-color: #7A184D;
          transform: translateY(-2px);
        }
        .image-overlay {
          transition: opacity 0.3s ease;
        }
        .image-overlay:hover {
          opacity: 0.9;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Strategic Approaches Section */}
      <section id="approaches" className="py-12 bg-white">
        <Container size="xl" className="max-w-8xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Approaches to <span className="text-[#931E5C]">Expanding Access to Justice</span>
            </Typography>
            <Typography variant="body" className="text-lg text-gray-600">
              We drive sustainable change through five innovative approaches, empowering communities and transforming justice systems in Tanzania.
            </Typography>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {approaches.map((approach, index) => (
    <div
      key={index}
      className="hover-scale bg-white rounded-lg overflow-hidden fade-in flex flex-col"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image with responsive height */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={approach.image}
          alt={approach.title}
          className="w-full h-full object-cover image-overlay"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-white bg-[#931E5C] p-3 rounded-full">
              {approach.icon}
            </div>
            <Typography
              variant="h4"
              className="text-xl font-semibold text-white drop-shadow-md"
            >
              {approach.title}
            </Typography>
          </div>
          <Typography
            variant="body"
            className="text-white text-sm drop-shadow-md"
          >
            {approach.description}
          </Typography>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-6 mt-auto">
        <Link to={approach.link}>
          <Button className="org-button text-white px-6 py-2 rounded-full font-semibold w-full">
            {approach.cta}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  ))}
</div>
        </Container>
      </section>

      {/* Strategic Focus Areas Section */}
      <section id="focus-areas" className="py-12 bg-white">
        <Container size="xl" className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Focus Areas for <span className="text-[#931E5C]">Legal Empowerment</span>
            </Typography>
            <Typography variant="body" className="text-lg text-gray-600">
              Our six transformative focus areas empower communities, reform systems, and scale sustainable justice across Tanzania.
            </Typography>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {focusAreas.map((area, index) => (
              <div key={index} className="hover-scale bg-white rounded-lg overflow-hidden fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-64">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover image-overlay"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-white bg-[#931E5C] p-3 rounded-full">
                        {area.icon}
                      </div>
                      <Typography variant="h4" className="text-xl font-semibold text-white text-shadow">
                        {area.title}
                      </Typography>
                    </div>
                    <Typography variant="body" className="text-white/90 text-sm text-shadow">
                      {area.description}
                    </Typography>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    {area.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#931E5C]" />
                        <Typography variant="bodySmall" className="text-gray-700 font-medium">
                          {stat}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  <Link to={area.link}>
                    <Button className="org-button text-white px-6 py-2 rounded-full font-semibold w-full">
                      {area.cta}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default StrategicFocusAreasSection;