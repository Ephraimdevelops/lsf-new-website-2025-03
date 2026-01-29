import { useState, useEffect } from 'react';
import { Users, Globe, TrendingUp, Building2, Gavel, Radio, ArrowRight, Target } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

// --- Animated CountUp Component ---
const CountUp = ({ end, suffix = "", prefix = "" }: { end: string; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));
  const duration = 2000;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericEnd));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericEnd]);

  return <span>{prefix}{count.toLocaleString()}{suffix}{end.includes('+') ? '+' : ''}{end.includes('%') ? '%' : ''}</span>;
};

const impactNumbers = [
  {
    icon: <Building2 className="h-5 w-5" />,
    number: "13+",
    label: "Years of Leadership",
    description: "Shaping Tanzania's legal aid architecture since 2011.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: <Globe className="h-5 w-5" />,
    number: "100%",
    label: "National Coverage",
    description: "Active in all 184 districts across Mainland & Zanzibar.",
    color: "text-secondary-teal",
    bg: "bg-secondary-teal/10"
  },
  {
    icon: <Users className="h-5 w-5" />,
    number: "4,000+",
    label: "Paralegal Network",
    description: "The largest specialized legal aid workforce in East Africa.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: <Gavel className="h-5 w-5" />,
    number: "2",
    label: "Acts Passed",
    description: "Advocated for the enacted Legal Aid Acts of 2017 & 2018.",
    color: "text-secondary-teal",
    bg: "bg-secondary-teal/10"
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    number: "52",
    prefix: "$",
    suffix: "M+",
    label: "Funds Managed",
    description: "Directed towards justice and empowerment programs.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: <Radio className="h-5 w-5" />,
    number: "30",
    suffix: "M+",
    label: "Media Reach",
    description: "Citizens educated on rights via mass media campaigns.",
    color: "text-secondary-teal",
    bg: "bg-secondary-teal/10"
  }
];

const AboutImpactNumbers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  return (
    <section ref={sectionRef as any} className="py-20 bg-gray-50 relative overflow-hidden">
      {/* AGM-Style Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/brand-pattern.png')] bg-cover bg-center" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Homepage "About Us" Style (ModernAboutSection) */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-6">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Institutional Scale</span>
            </div>

            {/* Heading */}
            <Typography variant="h2" className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 tracking-tight">
              The Architecture of <span className="text-primary">Justice</span>
            </Typography>

            {/* Border-Left Paragraph */}
            <div className="border-l-4 border-primary pl-6 mb-8">
              <p className="font-medium text-gray-900 text-lg mb-4">
                Scale isn't just about numbers; it's about capacity.
              </p>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                Beyond individual cases, we have built the resilient infrastructure, policy framework, and human networks that sustain justice for millions across Tanzania.
              </p>
            </div>
          </div>

          {/* RIGHT: AGM Creative Direction (Clean, Grounded, Structured) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {impactNumbers.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full min-h-[160px] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className={`h-1 w-8 rounded-full bg-gray-100 group-hover:bg-primary/20 transition-colors`}></div>
                </div>

                <div>
                  <div className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                    {isVisible ? (
                      <CountUp end={item.number} prefix={item['prefix']} suffix={item['suffix']} />
                    ) : (
                      "0"
                    )}
                  </div>
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                    {item.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default AboutImpactNumbers;