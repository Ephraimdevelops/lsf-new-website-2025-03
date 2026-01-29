import {
  ArrowRight,
  Users,
  Heart,
  Megaphone,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  Scale,
  Leaf,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const FlagshipPrograms = () => {
  const programs = [
    {
      title: 'Climate Justice & Resilience',
      subtitle: 'Sustainable Solutions for Communities',
      description:
        'Partnering with the Rufiji Water Basin Board and World Bank to build climate resilience. This initiative empowers communities through COCOBA groups, Grievance Redress Committees, and environmental restoration efforts.',
      image: '/lovable-uploads/climate-justice-planting.jpg',
      highlights: [
        'Partnership with Rufiji Water Basin Board',
        '30 COCOBA groups supported',
        '225 Grievance Redress Committee members',
        '23,000+ Trees Planted (Project + Marathon)',
      ],
      stats: [
        { value: '23,000+', label: 'Trees Planted' },
        { value: '30', label: 'COCOBA Groups' },
        { value: '225', label: 'Committee Members' },
      ],
      color: 'bg-emerald-600',
      accentColor: 'text-emerald-600',
      borderColor: 'border-emerald-100', // Subtle border
      partners: [
        { name: 'World Bank', logo: '/lovable-uploads/WorldBank_logo.jpg' },
      ],
      link: '/programs/climate-justice',
    },
    {
      title: 'Sauti ya Mwanamke (IMPAWLA)',
      subtitle: 'Improved Access to Justice for Women through Legal Aid',
      description:
        'Tanzania\'s largest grassroots movement for gender justice. Funded by the European Union (€4 million) and managed by Enabel, this initiative empowers 4,000+ paralegals across 168 districts.',
      image: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
      highlights: [
        'EU-funded through Enabel partnership',
        '4,590 Protection Committee members trained',
        '168 districts covered nationwide',
        'TZS 10.7 billion (€4M) investment',
      ],
      stats: [
        { value: '168', label: 'Districts' },
        { value: '4,590', label: 'Cmte Members' },
        { value: '60%', label: 'ADR Resolution' },
      ],
      color: 'bg-secondary-orange',
      accentColor: 'text-secondary-orange',
      borderColor: 'border-orange-100',
      partners: [
        { name: 'European Union', logo: '/lovable-uploads/Funded by European Union.png' },
        { name: 'Enabel', logo: '/lovable-uploads/Enabel.png' },
      ],
      link: '/programs/sauti-ya-mwanamke',
    },
    {
      title: 'Mama Samia Legal Aid Campaign',
      subtitle: 'Strategic Co-Lead & National Funder',
      description:
        'LSF serves as Vice-Chair of the National Campaign Committee alongside the Ministry of Constitutional and Legal Affairs. A coordinated effort deploying 4,000+ paralegals nationwide.',
      image: '/lovable-uploads/mama%20samia%20legal%20aid%20campaingn.jpg',
      highlights: [
        'Enacted Legal Aid Act 2017 & 2018',
        'LSF Co-Chairs National Legal Aid Campaign',
        'Legal Aid Fund pledged for 2026/2027 Budget',
        '31 regions covered nationwide',
      ],
      stats: [
        { value: '3.1B', label: 'TZS Disbursed' },
        { value: '168', label: 'Partners' },
        { value: 'Act \'17', label: 'Legal Aid Law' },
      ],
      color: 'bg-primary',
      accentColor: 'text-primary',
      borderColor: 'border-blue-100',
      partners: [
        // Using placeholder or generic for now per availability
        { name: 'LSF', logo: '/lovable-uploads/LSF Favicon.png' }
      ],
      link: '/programs/mama-samia-legal-aid-campaign',
    },
    {
      title: 'Wanawake Tunaweza',
      subtitle: 'Women We Can – Economic & Legal Empowerment',
      description:
        'Implemented in Longido District with North-South Cooperation. Targeting Maasai women through VICOBA economic groups, entrepreneurship, and girls\' dormitories.',
      image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      highlights: [
        'Supported 11 women\'s groups with capital',
        'Run-for-Binti Marathon: Building school latrines',
        '20 traditional leaders engaged as change agents',
        '1,214 girls benefited from dormitories',
      ],
      stats: [
        { value: '11', label: 'Groups Supported' },
        { value: '1,214', label: 'Girls Reached' },
        { value: 'Marathon', label: 'Run-for-Binti' },
      ],
      color: 'bg-secondary-teal',
      accentColor: 'text-secondary-teal',
      borderColor: 'border-teal-100',
      partners: [
        { name: 'North-South Cooperation', logo: '/lovable-uploads/Northsouth cooperation.png' },
      ],
      link: '/programs/wanawake-tunaweza',
    },
  ];

  return (
    <section id="flagship-programs" className="py-16 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">
            Our Work
          </span>
          <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 tracking-tight">
            Flagship Initiatives
          </Typography>
          <Typography className="text-neutral-500 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Delivering direct legal support while advancing systemic change for women, girls, and marginalized communities.
          </Typography>
        </div>

        {/* Programs List */}
        <div className="space-y-24">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center group`}
            >
              {/* Visual Side */}
              <div className="lg:w-1/2 w-full relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-neutral-200/50 aspect-[4/3]">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                  {/* Floating Stats - Glassmorphism */}
                  <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                    {program.stats.map((stat, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                        <div className="text-white text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-white/70 text-[10px] uppercase tracking-wider font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative blob behind */}
                <div className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] ${program.color} opacity-5 blur-3xl rounded-full transition-opacity duration-500 group-hover:opacity-10`}></div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 w-full">
                <div className="relative">
                  {/* Partners Bar */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Supported By</span>
                    <div className="h-px bg-neutral-200 flex-grow max-w-[100px]"></div>
                    <div className="flex gap-4">
                      {program.partners.map((partner, pIdx) => (
                        <img
                          key={pIdx}
                          src={partner.logo}
                          alt={partner.name}
                          className="h-8 w-auto object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
                          title={partner.name}
                        />
                      ))}
                    </div>
                  </div>

                  <Typography variant="h3" className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
                    {program.title}
                  </Typography>
                  <p className={`text-lg font-medium mb-6 ${program.accentColor}`}>
                    {program.subtitle}
                  </p>

                  <p className="text-neutral-500 leading-relaxed text-lg mb-8 font-light">
                    {program.description}
                  </p>

                  {/* Highlights - Minimal List */}
                  <div className="mb-10 space-y-3">
                    {program.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 group/item">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2.5 ${program.color} group-hover/item:scale-150 transition-transform`}></div>
                        <span className="text-neutral-600 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link to={program.link}>
                    <Button
                      variant="ghost"
                      className={`group/btn pl-0 text-lg font-bold ${program.accentColor} hover:bg-transparent hover:${program.accentColor} transition-all`}
                    >
                      View Full Initiative
                      <div className={`ml-3 p-2 rounded-full ${program.color}/10 group-hover/btn:translate-x-2 transition-transform`}>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Subtle */}
        <div className="mt-32 text-center border-t border-neutral-100 pt-20">
          <Typography variant="h3" className="text-2xl md:text-3xl font-bold mb-6 text-neutral-900">
            Join us in expanding legal empowerment.
          </Typography>

          <div className="flex items-center justify-center gap-6">
            <Link to="/donate">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all">
                Make a Donation
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 rounded-full px-8 py-6 font-bold text-lg">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlagshipPrograms;