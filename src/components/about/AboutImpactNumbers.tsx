import { Users, Scale, Award, Globe, TrendingUp, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const impactNumbers = [
  {
    icon: <Users className="h-12 w-12" />,
    number: "1M+",
    label: "Lives Transformed",
    description: "Individuals directly impacted by our programs",
    color: "text-primary",
    bgColor: "bg-primary/20"
  },
  {
    icon: <Scale className="h-12 w-12" />,
    number: "4,000+",
    label: "Paralegals Trained",
    description: "Community legal advocates empowered",
    color: "text-secondary-teal",
    bgColor: "bg-secondary-teal/20"
  },
  {
    icon: <Award className="h-12 w-12" />,
    number: "89%",
    label: "Success Rate",
    description: "Cases resolved in favor of clients",
    color: "text-secondary-green",
    bgColor: "bg-secondary-green/20"
  },
  {
    icon: <Globe className="h-12 w-12" />,
    number: "25",
    label: "Regions Covered",
    description: "Across Tanzania mainland and islands",
    color: "text-secondary-orange",
    bgColor: "bg-secondary-orange/20"
  },
  {
    icon: <TrendingUp className="h-12 w-12" />,
    number: "168",
    label: "Communities Served",
    description: "From urban centers to remote villages",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20"
  },
  {
    icon: <Heart className="h-12 w-12" />,
    number: "15+",
    label: "Years of Impact",
    description: "Dedicated service to justice",
    color: "text-pink-500",
    bgColor: "bg-pink-500/20"
  }
];

const AboutImpactNumbers = () => {
  return (
    <section className="py-28 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/IMG-20230831-WA0003.jpg')" }}
      ></div>
      {/* Stronger dark overlay for text clarity */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <Container size="xl" className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-8 py-3 mb-6 border border-white/20">
            <DesignIcon
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" className="font-bold text-lg tracking-widest text-white">
              Our Impact in Numbers
            </Text>
          </div>
          <Typography
            variant="h2"
            className="mb-6 text-4xl md:text-6xl font-bold text-white"
          >
            Our National <br />
            <span className="bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Footprint
            </span>
          </Typography>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Every number represents real lives transformed, communities empowered, and justice served across Tanzania.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactNumbers.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border border-white/10 bg-white/20 backdrop-blur-lg text-white"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                <Typography variant="display" className={`font-black mb-3 ${item.color}`}>
                  {item.number}
                </Typography>

                <Typography variant="h4" className="font-semibold mb-3 text-white">
                  {item.label}
                </Typography>

                <Typography variant="bodySmall" className="text-gray-200 leading-relaxed">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AboutImpactNumbers;