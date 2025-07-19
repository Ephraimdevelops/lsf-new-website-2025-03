
import { Users, Scale, Award, Globe, TrendingUp, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const impactNumbers = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "1M+",
    label: "Lives Transformed",
    description: "Individuals directly impacted by our programs",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: <Scale className="h-8 w-8" />,
    number: "4,000+",
    label: "Paralegals Trained",
    description: "Community legal advocates empowered",
    color: "text-secondary-teal",
    bgColor: "bg-secondary-teal/10"
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: "89%",
    label: "Success Rate",
    description: "Cases resolved in favor of clients",
    color: "text-secondary-green",
    bgColor: "bg-secondary-green/10"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    number: "25",
    label: "Regions Covered",
    description: "Across Tanzania mainland and islands",
    color: "text-secondary-orange",
    bgColor: "bg-secondary-orange/10"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    number: "184",
    label: "Communities Served",
    description: "From urban centers to remote villages",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10"
  },
  {
    icon: <Heart className="h-8 w-8" />,
    number: "15+",
    label: "Years of Impact",
    description: "Dedicated service to justice",
    color: "text-pink-600",
    bgColor: "bg-pink-600/10"
  }
];

const AboutImpactNumbers = () => {
  return (
    <section className=" py-20 text-center mb-16 bg-neutral-dark text-white overflow-hidden ">
      <Container size="xl" >

        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            Our Impact in Numbers
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          Our National <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              FootPrint
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every number represents real lives transformed, communities empowered, and justice served across Tanzania.
          </p>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactNumbers.map((item, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-neutral-50">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                  {item.icon}
                </div>
                
                <Typography variant="display" className={`${item.color} font-black mb-3`}>
                  {item.number}
                </Typography>
                
                <Typography variant="h4" className="font-semibold mb-3">
                  {item.label}
                </Typography>
                
                <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
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
