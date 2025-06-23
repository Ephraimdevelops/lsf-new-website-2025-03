
import { Link } from 'react-router-dom';
import { Scale, Users, Cloud, Smartphone, ArrowRight, Star, Award, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  features: string[];
  impact: string;
  bgGradient: string;
}

const ProgramCard = ({ title, description, icon, color, link, features, impact, bgGradient }: ProgramCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white border-0">
      <div className={`absolute inset-0 ${bgGradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className={`h-2 ${color} group-hover:h-3 transition-all duration-300`}></div>
      
      <CardContent className="p-8 relative">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        
        <Typography variant="h3" className="mb-4 group-hover:text-primary transition-colors">
          {title}
        </Typography>
        
        <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
          {description}
        </Typography>

        <div className="mb-6">
          <Typography variant="bodySmall" className="font-semibold text-primary mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Key Features
          </Typography>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-neutral-gray">
                <CheckCircle className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-lg">
          <Typography variant="bodySmall" className="font-semibold text-primary mb-2 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Impact
          </Typography>
          <Typography variant="bodySmall" className="text-neutral-gray">
            {impact}
          </Typography>
        </div>
        
        <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-all">
          <Link to={link}>
            <Typography variant="overline" className="mr-2">
              EXPLORE PROGRAM
            </Typography>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const Programs = () => {
  const programs = [
    {
      title: "Legal Empowerment",
      description: "Enhancing access to justice through community-based legal aid providers and paralegals who work directly with vulnerable communities.",
      icon: <Scale className="text-primary h-8 w-8" />,
      color: "bg-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary-dark",
      link: "/programs/legal-empowerment",
      features: [
        "Community paralegal training",
        "Mobile legal clinics",
        "Legal awareness workshops",
        "Alternative dispute resolution"
      ],
      impact: "Over 4,000 paralegals trained across 25 regions, reaching 1M+ beneficiaries"
    },
    {
      title: "Gender Justice",
      description: "Advancing women's rights and addressing gender-based violence through comprehensive legal support and advocacy.",
      icon: <Users className="text-secondary-green h-8 w-8" />,
      color: "bg-secondary-green",
      bgGradient: "bg-gradient-to-br from-secondary-green to-green-600",
      link: "/programs/gender-justice",
      features: [
        "GBV survivor support",
        "Women's economic rights",
        "Legal representation",
        "Policy advocacy"
      ],
      impact: "75% reduction in GBV cases in targeted communities over 3 years"
    },
    {
      title: "Climate Justice",
      description: "Supporting communities affected by climate change and promoting environmental rights through legal frameworks.",
      icon: <Cloud className="text-secondary-teal h-8 w-8" />,
      color: "bg-secondary-teal",
      bgGradient: "bg-gradient-to-br from-secondary-teal to-teal-600",
      link: "/programs/climate-justice",
      features: [
        "Environmental law advocacy",
        "Community land rights",
        "Climate litigation support",
        "Policy development"
      ],
      impact: "Protected 500,000 hectares of community land from illegal mining"
    },
    {
      title: "Digital Transformation",
      description: "Leveraging technology to improve access to justice and legal information through innovative digital solutions.",
      icon: <Smartphone className="text-secondary-orange h-8 w-8" />,
      color: "bg-secondary-orange",
      bgGradient: "bg-gradient-to-br from-secondary-orange to-orange-600",
      link: "/programs/digital-transformation",
      features: [
        "Haki Yangu mobile app",
        "Digital legal resources",
        "Online case management",
        "Virtual consultations"
      ],
      impact: "300,000+ app downloads with 95% user satisfaction rate"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-primary/5">
      <Container size="xl">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
            <Star className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              OUR PROGRAMS
            </Typography>
          </div>
          
          <Typography variant="display" className="mb-8 font-heading max-w-4xl mx-auto">
            Transforming Communities Through 
            <span className="text-primary block mt-2">Strategic Legal Interventions</span>
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl leading-relaxed">
            We work across four key program areas to promote justice, empower communities, 
            and create lasting change through innovative legal solutions.
          </Typography>
        </div>
        
        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              {...program}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 border border-primary/10">
          <Typography variant="h2" className="mb-6">
            Ready to Make an Impact?
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
            Join our programs as a partner, volunteer, or beneficiary. Together, we can build a more just society.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/contact" className="flex items-center">
                Get Involved
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link to="/impact">
                View Our Impact
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Programs;
