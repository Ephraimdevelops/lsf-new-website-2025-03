import { ArrowRight, Users, Heart, Megaphone, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const FlagshipPrograms = () => {
  const programs = [
    {
      title: "Sauti ya Mwanamke",
      subtitle: "Voice. Rights. Justice.",
      description: "Sauti ya Mwanamke is a nationwide program amplifying the voices of women and girls affected by violence and legal exclusion. We support survivors with paralegal aid, community dialogues, media advocacy, and legal empowerment interventions.",
      image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
      highlights: [
        "Reached 6+ regions in Tanzania",
        "20,000+ women accessed legal education & aid",
        "130+ paralegals trained in GBV response",
        "Key community leaders engaged to challenge norms"
      ],
      color: "from-secondary-orange to-secondary-orange/80",
      icon: <Megaphone className="h-8 w-8" />,
      link: "/programs/sauti-ya-mwanamke"
    },
    {
      title: "Wanawake Tunaweza",
      subtitle: "Empowering Women to Know and Use the Law",
      description: "This program focuses on strengthening women's legal capabilities — from land ownership and inheritance to GBV protection and legal identity. It builds confidence, literacy, and access for those most at risk.",
      image: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png",
      highlights: [
        "12,000+ women trained in legal literacy",
        "Women-led rights clubs formed in 8 districts",
        "Supported reform conversations on gender-based rights"
      ],
      color: "from-secondary-teal to-secondary-teal/80",
      icon: <Users className="h-8 w-8" />,
      link: "/programs/wanawake-tunaweza"
    }
  ];

  return (
    <section id="flagship-programs" className="py-20 bg-gradient-to-br from-white via-neutral-50/30 to-white relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(89,181,176,0.03)_0%,transparent_50%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Heart className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold tracking-wider text-sm">
              OUR FLAGSHIP PROGRAMS
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            Transforming Lives
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Across Tanzania
            </span>
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed">
            Our flagship programs represent the heart of our mission — delivering direct impact while building the foundation for systemic change across Tanzania's legal landscape.
          </Typography>
        </div>

        <div className="space-y-20">
          {programs.map((program, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              {/* Image Section */}
              <div className="lg:w-1/2">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.color} rounded-3xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300`}></div>
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-20`}></div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center text-white`}>
                      {program.icon}
                    </div>
                    <div>
                      <Typography variant="h3" className="text-2xl lg:text-3xl font-bold text-primary">
                        {program.title}
                      </Typography>
                      <Typography variant="body" className="text-secondary-orange font-semibold">
                        {program.subtitle}
                      </Typography>
                    </div>
                  </div>

                  <Typography variant="body" className="text-neutral-600 mb-8 text-lg leading-relaxed">
                    {program.description}
                  </Typography>

                  <div className="mb-8">
                    <Typography variant="h4" className="text-lg font-semibold mb-4 text-primary">
                      Impact Highlights:
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <TrendingUp className="h-3 w-3 text-primary" />
                          </div>
                          <Typography variant="bodySmall" className="text-neutral-600 leading-relaxed">
                            {highlight}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={program.link}>
                    <Button className={`bg-gradient-to-r ${program.color} text-white hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl`}>
                      {index === 0 ? 'Explore Sauti ya Mwanamke' : 'Learn More About Wanawake Tunaweza'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FlagshipPrograms;