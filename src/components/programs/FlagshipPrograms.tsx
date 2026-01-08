import {
  ArrowRight,
  Users,
  Heart,
  Megaphone,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const FlagshipPrograms = () => {
  const programs = [
    {
      title: 'Sauti ya Mwanamke',
      subtitle: 'Voice. Rights. Justice.',
      description:
        'A nationwide program amplifying the voices of women and girls affected by violence and legal exclusion. We support survivors with paralegal aid, community dialogues, media advocacy, and legal empowerment.',
      image: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
      highlights: [
        '6+ regions in Tanzania reached',
        '20,000+ women accessed legal aid',
        '130+ paralegals trained',
        'Community leaders engaged',
      ],
      stats: [
        { value: '20K+', label: 'Women Reached' },
        { value: '6', label: 'Regions' },
        { value: '130+', label: 'Paralegals' },
      ],
      color: 'bg-secondary-orange',
      accentColor: 'text-secondary-orange',
      borderColor: 'border-secondary-orange',
      icon: <Megaphone className="h-7 w-7" />,
      link: '/programs/sauti-ya-mwanamke',
    },
    {
      title: 'Wanawake Tunaweza',
      subtitle: 'Empowering Women to Know and Use the Law',
      description:
        'Focused on strengthening women\'s legal capabilities — from land rights to GBV protection and identity access. Building literacy, confidence, and empowerment.',
      image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      highlights: [
        '12,000+ women trained in legal literacy',
        'Women-led rights clubs in 8 districts',
        'Gender rights reform advocacy',
      ],
      stats: [
        { value: '12K+', label: 'Women Trained' },
        { value: '8', label: 'Districts' },
        { value: '50+', label: 'Rights Clubs' },
      ],
      color: 'bg-secondary-teal',
      accentColor: 'text-secondary-teal',
      borderColor: 'border-secondary-teal',
      icon: <Users className="h-7 w-7" />,
      link: '/programs/wanawake-tunaweza',
    },
  ];

  return (
    <section id="flagship-programs" className="py-16 md:py-28 bg-neutral-50 relative overflow-hidden">
      {/* Premium subtle patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent_0%,transparent_49%,rgba(147,30,92,0.03)_50%,transparent_51%,transparent_100%)] bg-[length:80px_100%]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary font-bold text-sm uppercase tracking-widest">
              Flagship Programs
            </span>
          </div>

          <Typography variant="h2" className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">
            Transforming Lives
            <span className="block text-primary mt-2">Across Tanzania</span>
          </Typography>

          <Typography className="text-neutral-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Our flagship programs deliver direct legal support while advancing systemic change for women, girls, and marginalized communities.
          </Typography>
        </div>

        {/* Programs - Premium Cards */}
        <div className="space-y-16 lg:space-y-32">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
            >
              {/* Image Side - Cinematic */}
              <div className="lg:w-1/2 w-full">
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay on bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Stats floating on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-center gap-6">
                        {program.stats.map((stat, idx) => (
                          <div key={idx} className="text-center bg-white/20 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30">
                            <div className="text-white text-2xl md:text-3xl font-black">{stat.value}</div>
                            <div className="text-white/90 text-xs uppercase tracking-wider">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating accent badge */}
                  <div className={`absolute -top-4 ${index % 2 !== 0 ? '-right-4' : '-left-4'} ${program.color} text-white p-4 rounded-2xl shadow-xl`}>
                    {program.icon}
                  </div>
                </div>
              </div>

              {/* Content Side - Premium Card */}
              <div className="lg:w-1/2 w-full">
                <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:p-10 border-l-4 ${program.borderColor} relative overflow-hidden`}>
                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${program.color} opacity-5 rounded-bl-full`}></div>

                  {/* Program Label */}
                  <div className={`inline-flex items-center gap-2 ${program.accentColor} font-bold text-sm uppercase tracking-widest mb-4`}>
                    <Award className="h-4 w-4" />
                    Program
                  </div>

                  {/* Title & Subtitle */}
                  <Typography variant="h3" className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
                    {program.title}
                  </Typography>
                  <p className={`${program.accentColor} font-semibold text-lg mb-6`}>
                    {program.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-neutral-600 leading-relaxed text-lg mb-8">
                    {program.description}
                  </p>

                  {/* Impact Highlights */}
                  <div className="mb-8">
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Impact Highlights</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {program.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className={`h-5 w-5 ${program.accentColor} flex-shrink-0 mt-0.5`} />
                          <span className="text-neutral-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to={program.link}>
                    <Button className={`${program.color} hover:opacity-90 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                      Explore This Program
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 lg:mt-32 text-center">
          <div className="bg-gradient-to-r from-primary via-primary-dark to-primary rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-orange/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2 mb-6">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-wider">26 Regions Across Tanzania</span>
              </div>

              <Typography variant="h3" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Want to Make an Impact?
              </Typography>

              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join us in expanding legal empowerment to more communities. Partner with LSF to bring justice within reach.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-5 rounded-full text-lg shadow-xl">
                    Donate Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-5 rounded-full text-lg">
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlagshipPrograms;