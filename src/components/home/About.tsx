
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Scale, Heart, Globe, MapPin, Award, Lightbulb, CheckCircle } from 'lucide-react';
import Section from '../shared/Section';
import Container from '../shared/Container';
import Card from '../shared/Card';
import Typography from '../shared/Typography';
import IconWrapper from '../shared/IconWrapper';

const About = () => {
  const highlights = [
    {
      icon: Globe,
      value: "11+",
      label: "Years of Impact",
      color: "from-blue-500 to-cyan-500",
      description: "Promoting justice since 2011"
    },
    {
      icon: MapPin,
      value: "184",
      label: "Districts Reached",
      color: "from-green-500 to-emerald-500",
      description: "Complete national coverage"
    },
    {
      icon: Award,
      value: "500+",
      label: "Paralegals Trained",
      color: "from-purple-500 to-violet-500",
      description: "Community champions"
    }
  ];

  const keyFacts = [
    "Leading non-profit organization in Tanzania",
    "Innovative legal empowerment approaches",
    "Focus on women's rights and empowerment",
    "Over 180 community-based legal aid providers",
    "Digital-first approach with Haki Yangu app"
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Enhanced Section Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-teal rounded-full"></div>
                <Typography variant="overline" className="text-primary-500 font-bold tracking-wider">
                  About LSF
                </Typography>
              </div>
              
              <Typography variant="h2" className="bg-gradient-to-r from-primary-500 to-secondary-teal bg-clip-text text-transparent leading-tight">
                Empowering Justice for All
              </Typography>
              
              <Typography variant="body" className="text-xl text-neutral-gray leading-relaxed">
                We are Tanzania's leading non-profit organization promoting access to justice through innovative legal empowerment approaches, with a special focus on women's rights.
              </Typography>
            </div>
            
            {/* Enhanced Main Content */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <Typography variant="body" className="text-lg leading-relaxed text-neutral-dark">
                  Established in 2011, we work with over 180 community-based legal aid providers across all 184 districts of Tanzania, creating a comprehensive network of justice champions.
                </Typography>
              </div>

              {/* Key Facts List */}
              <div className="space-y-3">
                {keyFacts.map((fact, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-teal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <Typography variant="body" className="text-neutral-dark font-medium">
                      {fact}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <highlight.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${highlight.color} bg-clip-text text-transparent mb-2`}>
                    {highlight.value}
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    {highlight.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {highlight.description}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Learn Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/impact" 
                className="inline-flex items-center justify-center border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg"
              >
                See Our Impact
              </Link>
            </div>
          </div>
          
          {/* Enhanced Image Column */}
          <div className="relative order-1 lg:order-2">
            {/* Main Image Container with Enhanced Design */}
            <div className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-transparent bg-gradient-to-r from-primary-500 via-secondary-teal to-secondary-orange p-1">
                <div className="rounded-2xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/background with mother umage .png" 
                    alt="Tanzanian paralegals empowering communities through legal education" 
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Impact Cards */}
            <Card 
              variant="elevated" 
              padding="lg" 
              className="absolute -bottom-6 -left-6 z-20 max-w-xs border-l-4 border-secondary-teal bg-white/95 backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <IconWrapper variant="secondary" size="lg">
                  <Heart className="h-6 w-6" />
                </IconWrapper>
                <div>
                  <Typography variant="h4" className="text-primary-500">26,000+</Typography>
                  <Typography variant="caption" className="font-medium">Lives Transformed</Typography>
                  <Typography variant="caption" className="text-xs text-gray-500">Through our programs</Typography>
                </div>
              </div>
            </Card>

            <Card 
              variant="elevated" 
              padding="sm" 
              className="absolute -top-4 -right-4 z-20 border-l-4 border-secondary-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="body" className="text-orange-600 font-bold text-sm">Innovation</Typography>
                  <Typography variant="caption" className="text-orange-500">Digital First</Typography>
                </div>
              </div>
            </Card>

            {/* Additional floating element */}
            <Card 
              variant="elevated" 
              padding="sm" 
              className="absolute top-1/2 -left-4 z-20 border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="body" className="text-purple-600 font-bold text-sm">Justice</Typography>
                  <Typography variant="caption" className="text-purple-500">For All</Typography>
                </div>
              </div>
            </Card>
            
            {/* Enhanced Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-teal/10 to-primary-500/10 rounded-3xl transform translate-x-6 translate-y-6 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary-orange/10 to-secondary-teal/10 rounded-3xl transform -translate-x-3 -translate-y-3 -z-20"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full -z-30 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -z-30 animate-bounce"></div>
            <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -z-30"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
