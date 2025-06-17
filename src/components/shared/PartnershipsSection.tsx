
import { Handshake, Users, Globe, Award } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

interface Partner {
  name: string;
  logo: string;
  description: string;
  category: string;
}

interface PartnershipsSectionProps {
  title: string;
  subtitle?: string;
  partners: Partner[];
  variant?: 'default' | 'secondary' | 'primary';
}

const PartnershipsSection = ({ 
  title, 
  subtitle, 
  partners, 
  variant = 'secondary' 
}: PartnershipsSectionProps) => {
  const partnerCategories = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "International Partners",
      count: partners.filter(p => p.category === 'international').length,
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Civil Society Organizations",
      count: partners.filter(p => p.category === 'civil-society').length,
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Government Agencies",
      count: partners.filter(p => p.category === 'government').length,
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Private Sector",
      count: partners.filter(p => p.category === 'private').length,
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <Section variant={variant} padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Handshake className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              PARTNERSHIPS
            </Typography>
          </div>
          <Typography variant="h2" className="mb-6">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              {subtitle}
            </Typography>
          )}
        </div>

        {/* Partnership Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerCategories.map((category, index) => (
            <Card key={index} variant="elevated" hover className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <div className="text-white">
                  {category.icon}
                </div>
              </div>
              <Typography variant="h3" className="mb-2 text-primary">
                {category.count}+
              </Typography>
              <Typography variant="h4" className="mb-2">
                {category.title}
              </Typography>
            </Card>
          ))}
        </div>

        {/* Featured Partners */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.slice(0, 12).map((partner, index) => (
            <div key={index} className="group">
              <Card variant="flat" hover className="text-center p-6">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-16 h-16 mx-auto mb-3 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <Typography variant="bodySmall" className="font-semibold">
                  {partner.name}
                </Typography>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PartnershipsSection;
