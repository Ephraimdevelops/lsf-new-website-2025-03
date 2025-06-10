
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Users, Target, Heart, Award, Globe, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Users className="h-8 w-8" />}
        badge="About LSF"
        title="Transforming Access to Justice"
        description="For over two decades, we've been empowering communities across Tanzania through legal education, advocacy, and innovative solutions that bring justice closer to the people who need it most."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
                <Target className="h-5 w-5 mr-3 text-primary" />
                <Typography variant="overline" className="text-primary font-bold">
                  OUR PURPOSE
                </Typography>
              </div>
              
              <Typography variant="h2" className="mb-6">
                Our Mission
              </Typography>
              
              <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed">
                To enhance access to justice by empowering people with legal knowledge, 
                skills, and resources, and by advocating for legal and policy reforms 
                that address the needs of marginalized and vulnerable populations.
              </Typography>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="bodySmall" className="text-neutral-dark">
                    Empowering communities through legal education and awareness
                  </Typography>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="bodySmall" className="text-neutral-dark">
                    Advocating for policy reforms that protect vulnerable populations
                  </Typography>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="bodySmall" className="text-neutral-dark">
                    Building sustainable legal aid networks across Tanzania
                  </Typography>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-secondary-orange" />
                </div>
                
                <Typography variant="h3" className="text-center mb-4">
                  Our Vision
                </Typography>
                
                <Typography variant="bodySmall" className="text-neutral-gray text-center leading-relaxed">
                  A Tanzania where every person has access to justice, legal empowerment, 
                  and the opportunity to live with dignity, equality, and security under the law.
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-8">
              <Award className="h-5 w-5 mr-3 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold">
                CORE VALUES
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-6">
              What Drives Us Forward
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our values guide every decision we make and every community we serve
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "We approach every case with empathy and understanding, recognizing the human dignity in every person we serve.",
                color: "primary"
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in the power of collective action and building strong, supportive networks for lasting change.",
                color: "secondary-teal"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for the highest standards in our work, continuously improving our methods and impact.",
                color: "secondary-orange"
              },
              {
                icon: Globe,
                title: "Inclusion",
                description: "We ensure our services reach all people, regardless of gender, ethnicity, religion, or economic status.",
                color: "secondary-yellow"
              },
              {
                icon: Target,
                title: "Integrity",
                description: "We operate with transparency, accountability, and ethical practices in all our interactions.",
                color: "primary"
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We embrace new technologies and approaches to expand access to justice and improve service delivery.",
                color: "secondary-teal"
              }
            ].map((value, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${value.color}/10 to-${value.color}/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className={`h-8 w-8 text-${value.color}`} />
                  </div>
                  
                  <Typography variant="h4" className="mb-4">
                    {value.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                    {value.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* History Timeline Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                OUR JOURNEY
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-6">
              Two Decades of Impact
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              From humble beginnings to nationwide impact - see how we've grown
            </Typography>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-secondary-teal rounded-full"></div>
            
            <div className="space-y-16">
              {[
                {
                  year: "2000",
                  title: "Foundation Established",
                  description: "LSF was founded with a vision to make legal services accessible to all Tanzanians.",
                  position: "left"
                },
                {
                  year: "2005",
                  title: "First Community Programs",
                  description: "Launched our first paralegal training programs in rural communities.",
                  position: "right"
                },
                {
                  year: "2010",
                  title: "Digital Innovation",
                  description: "Introduced mobile legal clinics and digital resources to reach remote areas.",
                  position: "left"
                },
                {
                  year: "2015",
                  title: "Policy Advocacy",
                  description: "Successfully advocated for key legal reforms benefiting marginalized communities.",
                  position: "right"
                },
                {
                  year: "2020",
                  title: "Haki Yangu Platform",
                  description: "Launched our digital platform connecting citizens with legal services.",
                  position: "left"
                },
                {
                  year: "2024",
                  title: "National Impact",
                  description: "Reached over 400,000 beneficiaries across all regions of Tanzania.",
                  position: "right"
                }
              ].map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${milestone.position === 'left' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${milestone.position === 'left' ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mr-4">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <Typography variant="h4" className="text-primary">
                          {milestone.year}
                        </Typography>
                      </div>
                      
                      <Typography variant="h4" className="mb-3">
                        {milestone.title}
                      </Typography>
                      
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        {milestone.description}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary-teal">
        <Container size="xl">
          <div className="text-center text-white">
            <Typography variant="h2" className="text-white mb-6">
              Join Our Mission
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 max-w-2xl mx-auto">
              Be part of the movement that's transforming access to justice across Tanzania
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold px-8 py-4">
                  Work With Us
                </Button>
              </Link>
              
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-4">
                  Support Our Cause
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default About;
