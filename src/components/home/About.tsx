
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Scale, Heart, Globe, MapPin, Award, Lightbulb } from 'lucide-react';
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
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      value: "184",
      label: "Districts Reached",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      value: "500+",
      label: "Paralegals Trained",
      color: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-teal rounded-full"></div>
                <Typography variant="overline" className="text-primary-500">
                  About LSF
                </Typography>
              </div>
              
              <Typography variant="h2" className="bg-gradient-to-r from-primary-500 to-secondary-teal bg-clip-text text-transparent">
                Who We Are
              </Typography>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <Typography variant="body" className="text-xl">
                We are the leading non-profit organization promoting access to justice for all through innovative legal empowerment approaches.
                LSF is a non-profit organization that strives to increase access to justice for all, in particular for women through a legal empowerment approach. Established in 2011, we work with over 180 community-based legal aid providers across all 184 districts of Tanzania.
              </Typography>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <highlight.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${highlight.color} bg-clip-text text-transparent mb-1`}>
                    {highlight.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {highlight.label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <Link 
              to="/about" 
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Read More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {/* Enhanced Image Column */}
          <div className="relative">
            {/* Main Image Container with Colorful Border */}
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
            
            {/* Multiple Floating Impact Cards */}
            <Card 
              variant="elevated" 
              padding="lg" 
              className="absolute -bottom-8 -left-8 z-20 max-w-xs border-l-4 border-secondary-teal bg-white/95 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                <IconWrapper variant="secondary" size="lg">
                  <Heart className="h-6 w-6" />
                </IconWrapper>
                <div>
                  <Typography variant="h4" className="text-primary-500">26,000+</Typography>
                  <Typography variant="caption">Lives Transformed</Typography>
                </div>
              </div>
            </Card>

            <Card 
              variant="elevated" 
              padding="sm" 
              className="absolute -top-6 -right-6 z-20 border-l-4 border-secondary-orange bg-gradient-to-br from-orange-50 to-orange-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="body" className="text-orange-600 font-bold text-sm">Innovation</Typography>
                  <Typography variant="caption" className="text-orange-500">Digital First</Typography>
                </div>
              </div>
            </Card>
            
            {/* Colorful Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-teal/10 to-primary-500/10 rounded-3xl transform translate-x-6 translate-y-6 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary-orange/10 to-secondary-teal/10 rounded-3xl transform -translate-x-3 -translate-y-3 -z-20"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full -z-30 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -z-30 animate-bounce"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
