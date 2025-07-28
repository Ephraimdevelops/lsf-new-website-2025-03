import {
  ArrowRight,
  Users,
  Heart,
  Megaphone,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
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
        'Community leaders engaged to challenge norms',
      ],
      color: 'from-secondary-orange to-secondary-orange/80',
      icon: <Megaphone className="h-6 w-6" />,
      link: '/programs/sauti-ya-mwanamke',
    },
    {
      title: 'Wanawake Tunaweza',
      subtitle: 'Empowering Women to Know and Use the Law',
      description:
        'Focused on strengthening women’s legal capabilities — from land rights to GBV protection and identity access. Building literacy, confidence, and empowerment.',
      image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      highlights: [
        '12,000+ women trained in legal literacy',
        'Women-led rights clubs formed in 8 districts',
        'Supported gender rights reform conversations',
      ],
      color: 'from-secondary-teal to-secondary-teal/80',
      icon: <Users className="h-6 w-6" />,
      link: '/programs/wanawake-tunaweza',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(0,98,128,0.04)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,170,0,0.04)_0%,transparent_50%)]"></div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            <Typography
              variant="overline"
              className="text-primary font-semibold tracking-wide text-sm"
            >
              OUR FLAGSHIP PROGRAMS
            </Typography>
          </div>
          <Typography
            variant="h2"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Transforming Lives Across
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Tanzania
            </span>
          </Typography>
          <Typography className="text-neutral-600 max-w-3xl mx-auto text-lg">
            These programs deliver direct support while advancing systemic change to improve justice and equity for vulnerable groups.
          </Typography>
        </div>

        <div className="space-y-24">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`flex flex-col-reverse lg:flex-row ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} gap-12 items-center`}
            >
              {/* Text */}
              <div className="lg:w-1/2 w-full">
                <Card className="bg-white border border-neutral-200 rounded-2xl shadow-md p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center text-white`}>
                      {program.icon}
                    </div>
                    <div>
                      <Typography variant="h4" className="text-xl font-bold">
                        {program.title}
                      </Typography>
                      <p className="text-sm text-secondary-orange font-medium">
                        {program.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-neutral-600 leading-relaxed text-base">
                    {program.description}
                  </p>

                  <div>
                    <Typography variant="h3" className="text-base font-semibold text-primary mb-2">
                      Impact Highlights:
                    </Typography>
                    <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                      {program.highlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <Link to={program.link}>
                    <Button className={`mt-4 bg-gradient-to-r ${program.color} text-white hover:scale-105 transition-transform duration-300 text-sm px-6 py-2 rounded-xl`}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* Image */}
              <div className="lg:w-1/2 w-full">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FlagshipPrograms;