
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Users, Target, Heart, Award, Globe, TrendingUp, Calendar, MapPin, ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      {/* Enhanced Hero Section with Shocking Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Users className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                About LSF
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl md:text-8xl font-bold">
              Transforming Access to
              <span className="block text-secondary-orange">Justice</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              For over two decades, we've been empowering communities across Tanzania through legal education, advocacy, and innovative solutions that bring justice closer to the people who need it most.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 text-lg rounded-full">
                Our Mission
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 text-lg rounded-full">
                <PlayCircle className="mr-3 h-6 w-6" />
                Our Story
              </Button>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-orange">20+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Years of Impact</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-teal">400K+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Lives Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-yellow">184</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Districts Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">95%</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Success Rate</div>
              </div>
            </div>
          </div>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-primary-dark text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-60 h-60 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center bg-secondary-orange/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-secondary-orange/30">
                <Target className="h-6 w-6 mr-4 text-secondary-orange" />
                <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                  OUR PURPOSE
                </Typography>
              </div>
              
              <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold text-white">
                Our Mission
              </Typography>
              
              <Typography variant="body" className="text-white/90 mb-8 leading-relaxed text-xl">
                To enhance access to justice by empowering people with legal knowledge, 
                skills, and resources, and by advocating for legal and policy reforms 
                that address the needs of marginalized and vulnerable populations.
              </Typography>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-6 group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="body" className="text-white/90 text-lg">
                    Empowering communities through legal education and awareness
                  </Typography>
                </div>
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-6 group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="body" className="text-white/90 text-lg">
                    Advocating for policy reforms that protect vulnerable populations
                  </Typography>
                </div>
                <div className="flex items-start group">
                  <div className="w-8 h-8 bg-secondary-teal rounded-full flex items-center justify-center mt-1 mr-6 group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <Typography variant="body" className="text-white/90 text-lg">
                    Building sustainable legal aid networks across Tanzania
                  </Typography>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary-orange/20 to-secondary-teal/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-10 hover:-translate-y-4 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-orange/20 to-secondary-orange/40 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Heart className="h-12 w-12 text-secondary-orange" />
                </div>
                
                <Typography variant="h2" className="text-center mb-6 text-white text-4xl font-bold">
                  Our Vision
                </Typography>
                
                <Typography variant="body" className="text-white/90 text-center leading-relaxed text-lg">
                  A Tanzania where every person has access to justice, legal empowerment, 
                  and the opportunity to live with dignity, equality, and security under the law.
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values Section - Redesigned */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary-teal/5"></div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-secondary-teal/20">
              <Award className="h-6 w-6 mr-4 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold text-lg">
                CORE VALUES
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              What Drives Us
              <span className="block text-primary">Forward</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our values guide every decision we make and every community we serve
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "We approach every case with empathy and understanding, recognizing the human dignity in every person we serve.",
                gradient: "from-red-400 to-pink-600"
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in the power of collective action and building strong, supportive networks for lasting change.",
                gradient: "from-blue-400 to-indigo-600"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for the highest standards in our work, continuously improving our methods and impact.",
                gradient: "from-orange-400 to-red-600"
              },
              {
                icon: Globe,
                title: "Inclusion",
                description: "We ensure our services reach all people, regardless of gender, ethnicity, religion, or economic status.",
                gradient: "from-green-400 to-emerald-600"
              },
              {
                icon: Target,
                title: "Integrity",
                description: "We operate with transparency, accountability, and ethical practices in all our interactions.",
                gradient: "from-purple-400 to-violet-600"
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We embrace new technologies and approaches to expand access to justice and improve service delivery.",
                gradient: "from-cyan-400 to-blue-600"
              }
            ].map((value, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-10 border border-gray-100 hover:border-primary/30 transform hover:-translate-y-4 h-full relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-10 w-10 text-white" />
                    </div>
                    
                    <Typography variant="h3" className="mb-6 text-2xl font-bold">
                      {value.title}
                    </Typography>
                    
                    <Typography variant="body" className="text-neutral-gray leading-relaxed">
                      {value.description}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* History Timeline Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary-yellow/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Calendar className="h-6 w-6 mr-4 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                OUR JOURNEY
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-white text-5xl md:text-6xl font-bold">
              Two Decades of
              <span className="block text-secondary-orange">Impact</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 max-w-3xl mx-auto text-xl">
              From humble beginnings to nationwide impact - see how we've grown
            </Typography>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary-orange via-secondary-teal to-secondary-yellow rounded-full"></div>
            
            <div className="space-y-20">
              {[
                {
                  year: "2000",
                  title: "Foundation Established",
                  description: "LSF was founded with a vision to make legal services accessible to all Tanzanians.",
                  position: "left",
                  color: "secondary-orange"
                },
                {
                  year: "2005",
                  title: "First Community Programs",
                  description: "Launched our first paralegal training programs in rural communities.",
                  position: "right",
                  color: "secondary-teal"
                },
                {
                  year: "2010",
                  title: "Digital Innovation",
                  description: "Introduced mobile legal clinics and digital resources to reach remote areas.",
                  position: "left",
                  color: "secondary-yellow"
                },
                {
                  year: "2015",
                  title: "Policy Advocacy",
                  description: "Successfully advocated for key legal reforms benefiting marginalized communities.",
                  position: "right",
                  color: "primary"
                },
                {
                  year: "2020",
                  title: "Haki Yangu Platform",
                  description: "Launched our digital platform connecting citizens with legal services.",
                  position: "left",
                  color: "secondary-orange"
                },
                {
                  year: "2024",
                  title: "National Impact",
                  description: "Reached over 400,000 beneficiaries across all regions of Tanzania.",
                  position: "right",
                  color: "secondary-teal"
                }
              ].map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${milestone.position === 'left' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${milestone.position === 'left' ? 'pr-12' : 'pl-12'}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br from-${milestone.color} to-${milestone.color}/80 rounded-2xl flex items-center justify-center mr-6`}>
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <Typography variant="h2" className={`text-${milestone.color} text-3xl font-bold`}>
                          {milestone.year}
                        </Typography>
                      </div>
                      
                      <Typography variant="h3" className="mb-4 text-white text-xl font-bold">
                        {milestone.title}
                      </Typography>
                      
                      <Typography variant="body" className="text-white/90 leading-relaxed">
                        {milestone.description}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-${milestone.color} rounded-full border-4 border-white shadow-lg`}></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-secondary-teal via-primary to-secondary-orange relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-black/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-secondary-yellow/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Container size="xl" className="relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Sparkles className="h-6 w-6 mr-4 text-white" />
              <Typography variant="overline" className="text-white font-bold text-lg">
                JOIN THE MISSION
              </Typography>
            </div>

            <Typography variant="h1" className="text-white mb-8 text-5xl md:text-6xl font-bold">
              Join Our Mission
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-16 max-w-3xl mx-auto text-xl leading-relaxed">
              Be part of the movement that's transforming access to justice across Tanzania. Together, we can create lasting change.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-12 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
                  Work With Us
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-12 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
                  <Heart className="mr-3 h-6 w-6" />
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
