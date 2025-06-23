
import { Users, Scale, Award, Globe, TrendingUp, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';

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
    <section className="py-20 bg-white">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="h1" className="mb-6 font-heading">
            Our Impact in Numbers
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto text-lg">
            Every number represents real lives transformed, communities empowered, and justice served across Tanzania.
          </Typography>
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
