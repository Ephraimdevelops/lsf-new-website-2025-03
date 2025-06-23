import Layout from '@/components/layout/Layout';
import { TrendingUp, Users, Scale, Target, MapPin, Award, Heart, Globe, Star, ChevronRight, ArrowRight } from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import SuccessStoryCard from '@/components/shared/SuccessStoryCard';
import { Link } from 'react-router-dom';

const Impact = () => {
  const impactStats = [
    {
      value: "426349",
      suffix: "+",
      label: "Legal Aid Beneficiaries",
      description: "Individuals receiving direct legal support",
      icon: <Users className="h-12 w-12" />,
      color: "primary"
    },
    {
      value: "39800000",
      suffix: "+", 
      label: "Legal Education Beneficiaries",
      description: "People reached through awareness programs",
      icon: <Globe className="h-12 w-12" />,
      color: "secondary-teal"
    },
    {
      value: "105562",
      suffix: "+",
      label: "Supported Groups",
      description: "Community organizations receiving assistance",
      icon: <Target className="h-12 w-12" />,
      color: "secondary-orange"
    },
    {
      value: "47000000",
      suffix: "+",
      label: "USD Disbursed as Grants",
      description: "Financial support to legal aid organizations",
      icon: <Award className="h-12 w-12" />,
      color: "secondary-yellow"
    }
  ];

  const successStories = [
    {
      id: "mariam-hassan",
      name: "Mariam Hassan",
      location: "Dar es Salaam",
      story: "Through LSF's paralegal support, I successfully reclaimed my family land that was illegally taken after my husband's death.",
      impact: "Now I can provide for my children with dignity and security.",
      category: "Land Rights",
      image: "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png",
      quote: "Through LSF's paralegal support, I successfully reclaimed my family land that was illegally taken after my husband's death. Now I can provide for my children with dignity and security.",
      brief: "After Mariam's husband passed away, her in-laws attempted to evict her from her ancestral home. With guidance from an LSF-trained paralegal, Mariam learned about women's inheritance rights and successfully retained her home.",
      year: "2024"
    },
    {
      id: "joseph-mkwawa",
      name: "Joseph Mkwawa", 
      location: "Mbeya",
      story: "The LSF mobile legal clinic helped me understand my rights as a small business owner and resolve disputes.",
      impact: "My carpentry business is now legally protected and thriving.",
      category: "Business Rights",
      image: "/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png",
      quote: "The LSF mobile legal clinic in our village helped me understand my rights as a small business owner and resolve a longstanding dispute that was threatening my family's livelihood.",
      brief: "Joseph's small carpentry workshop was threatened by illegal demands from local officials. The LSF mobile clinic helped him properly register his business and provided documentation showing the demands were illegal.",
      year: "2024"
    },
    {
      id: "neema-urio",
      name: "Neema Urio",
      location: "Arusha", 
      story: "After attending LSF's legal empowerment workshops, I now lead a women's group advocating for our rights.",
      impact: "Our group has successfully mediated over 30 disputes across three villages.",
      category: "Women's Empowerment",
      image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
      quote: "After attending LSF's legal empowerment workshops, I now lead a women's group that advocates for our community's rights and provides peer support to women facing legal challenges.",
      brief: "Inspired by LSF's legal literacy program, Neema established the 'Tunaweza' women's group, which now includes over 50 members across three villages and has successfully mediated over 30 disputes.",
      year: "2023"
    }
  ];

  const coverageRegions = [
    { region: "Dar es Salaam", districts: 5, paralegals: 450, cases: 2890 },
    { region: "Mwanza", districts: 7, paralegals: 380, cases: 2340 },
    { region: "Arusha", districts: 6, paralegals: 320, cases: 1980 },
    { region: "Dodoma", districts: 8, paralegals: 280, cases: 1750 },
    { region: "Mbeya", districts: 9, paralegals: 350, cases: 2100 },
    { region: "Iringa", districts: 6, paralegals: 220, cases: 1340 }
  ];

  const keyAchievements = [
    {
      title: "Legal Aid Act Implementation",
      description: "Successfully advocated for and supported the implementation of Tanzania's Legal Aid Act",
      year: "2017-2024",
      impact: "National framework for coordinated legal aid services"
    },
    {
      title: "Paralegal Network Expansion", 
      description: "Trained and deployed over 4,000 paralegals across 184 communities",
      year: "2010-2024",
      impact: "96% case resolution rate in served communities"
    },
    {
      title: "Digital Justice Platform",
      description: "Launched Haki Yangu mobile app connecting citizens to legal services",
      year: "2020-2024", 
      impact: "Over 50,000 downloads and 15,000 active users"
    }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <Section variant="secondary" padding="sm">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </Section>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/background with mother umage .png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/90 to-black/85"></div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
              <TrendingUp className="h-6 w-6 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                MEASURABLE IMPACT
              </Typography>
            </div>
            
            <Typography variant="display" className="text-white mb-8 font-heading text-6xl lg:text-7xl">
              Transforming Lives Through
              <span className="block text-secondary-orange mt-2">Accessible Justice</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 text-xl leading-relaxed max-w-3xl mx-auto mb-12">
              Over 15 years of strengthening access to justice across Tanzania. See how LSF's 
              comprehensive approach has created lasting change in communities nationwide.
            </Typography>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-white/80 text-sm">Years of Impact</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-teal mb-2">25</div>
                <div className="text-white/80 text-sm">Regions Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-orange mb-2">184</div>
                <div className="text-white/80 text-sm">Districts Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-yellow mb-2">4K+</div>
                <div className="text-white/80 text-sm">Paralegals Trained</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Statistics Section */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Heart className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                BY THE NUMBERS
              </Typography>
            </div>
            <Typography variant="display" className="mb-6 font-heading text-5xl">
              Real Impact,
              <span className="text-primary block mt-2">Measurable Results</span>
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
              Our data-driven approach ensures that every program creates measurable, lasting change 
              in the communities we serve across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl border border-neutral-100 p-8 hover:shadow-xl transition-all duration-300 text-center group-hover:-translate-y-2">
                  <div className={`text-${stat.color} mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-bold text-${stat.color} mb-3`}>
                    <AnimatedCounter end={parseInt(stat.value)} suffix={stat.suffix} />
                  </div>
                  <Typography variant="h4" className="text-neutral-dark mb-3 font-heading">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {stat.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-12 text-center">
            <Typography variant="display" className="mb-6 font-heading text-4xl">
              Creating Lasting Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg leading-relaxed">
              Through strategic partnerships, capacity building, and innovative programs, LSF has established 
              a sustainable foundation for justice in Tanzania. Our holistic approach ensures that legal 
              empowerment reaches every corner of society, from rural communities to urban centers.
            </Typography>
          </div>
        </Container>
      </Section>

      {/* Success Stories Section - Redesigned */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary-orange/10 rounded-full px-6 py-3 mb-6">
              <Star className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                SUCCESS STORIES
              </Typography>
            </div>
            <Typography variant="display" className="mb-6 font-heading text-5xl">
              Heroes of Justice
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
              Meet the brave individuals whose lives have been transformed through access to justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {successStories.map((story, index) => (
              <SuccessStoryCard 
                key={story.id} 
                story={story} 
                linkTo={`/heroes/${story.id}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/heroes"
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              View All Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Coverage Regions Section */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-6">
              <MapPin className="h-5 w-5 mr-3 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold">
                NATIONAL COVERAGE
              </Typography>
            </div>
            <Typography variant="display" className="mb-6 font-heading text-5xl">
              Reaching Every Corner
              <span className="text-secondary-teal block mt-2">of Tanzania</span>
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
              Our comprehensive network spans across 25 regions, ensuring no community is left behind 
              in accessing justice and legal empowerment.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {coverageRegions.map((region, index) => (
              <div key={index} className="bg-white rounded-xl border border-neutral-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h4" className="text-neutral-dark font-heading">
                    {region.region}
                  </Typography>
                  <div className="w-3 h-3 bg-secondary-teal rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-gray text-sm">Districts Covered</span>
                    <span className="font-semibold text-primary">{region.districts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-gray text-sm">Active Paralegals</span>
                    <span className="font-semibold text-secondary-teal">{region.paralegals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-gray text-sm">Cases Resolved</span>
                    <span className="font-semibold text-secondary-orange">{region.cases.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-secondary-teal/10 to-primary/10 rounded-2xl p-8 text-center">
            <Typography variant="h2" className="mb-4 font-heading">
              Complete National Coverage
            </Typography>
            <Typography variant="body" className="text-neutral-gray text-lg max-w-2xl mx-auto">
              From bustling urban centers to remote rural villages, our network ensures every Tanzanian 
              has access to quality legal services and empowerment opportunities.
            </Typography>
          </div>
        </Container>
      </Section>

      {/* Key Achievements Timeline */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Award className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                MILESTONES
              </Typography>
            </div>
            <Typography variant="display" className="mb-6 font-heading text-5xl">
              Key Achievements
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
              Major milestones that have shaped Tanzania's legal landscape and empowered communities.
            </Typography>
          </div>

          <div className="space-y-8">
            {keyAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-8 group">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                
                <div className="flex-1 bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <Typography variant="h3" className="text-neutral-dark font-heading mb-2 lg:mb-0">
                      {achievement.title}
                    </Typography>
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                      {achievement.year}
                    </span>
                  </div>
                  
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {achievement.description}
                  </Typography>
                  
                  <div className="bg-secondary-orange/10 rounded-lg p-4">
                    <Typography variant="bodySmall" className="font-semibold text-secondary-orange mb-1">
                      Impact:
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      {achievement.impact}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="bg-gradient-to-br from-primary via-primary-dark to-black rounded-3xl p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <Typography variant="display" className="mb-6 font-heading text-5xl">
                Join the Movement
              </Typography>
              <Typography variant="body" className="text-white/90 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                Be part of Tanzania's journey towards universal access to justice. Together, we can 
                ensure every citizen knows their rights and has the power to defend them.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="inline-flex items-center bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  Partner With Us
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/donate"
                  className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  Support Our Work
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Impact;
