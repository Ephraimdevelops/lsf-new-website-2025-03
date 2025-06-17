
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Globe, Heart } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const StrategicPartnershipsSection = () => {
  const partnerCategories = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Government Partners",
      description: "Working with national and local government institutions to strengthen legal frameworks.",
      partners: ["Ministry of Constitutional and Legal Affairs", "Judiciary of Tanzania", "Local Government Authorities"],
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "International Partners",
      description: "Collaborating with global organizations to bring best practices and resources.",
      partners: ["European Union", "UN Women", "World Bank Group"],
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Civil Society",
      description: "Partnering with grassroots organizations to ensure community-driven solutions.",
      partners: ["Women's Legal Aid Centre", "Tanzania Women Lawyers Association", "Community Legal Aid Centers"],
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Private Sector",
      description: "Engaging businesses to support legal empowerment through CSR and partnerships.",
      partners: ["Law Firms Consortium", "Financial Institutions", "Technology Partners"],
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            STRATEGIC PARTNERSHIPS
          </Typography>
          <Typography variant="h2" className="mb-6">
            Building Coalitions for
            <span className="block text-primary">Lasting Change</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Our impact is multiplied through strategic partnerships across government, civil society, 
            international organizations, and the private sector.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {partnerCategories.map((category, index) => (
            <Card key={index} variant="elevated" hover className="group">
              <div className={`bg-gradient-to-br ${category.color} p-6 rounded-t-2xl -m-8 mb-6`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <Typography variant="h4" className="text-white mb-2">
                  {category.title}
                </Typography>
                <Typography variant="bodySmall" className="text-white/90">
                  {category.description}
                </Typography>
              </div>
              <div className="space-y-3">
                <Typography variant="h4" className="text-neutral-dark mb-4">
                  Key Partners
                </Typography>
                {category.partners.map((partner, partnerIndex) => (
                  <div key={partnerIndex} className="flex items-center text-sm text-neutral-gray">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    {partner}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-2xl p-8">
          <Typography variant="h3" className="mb-4">
            Become a Partner
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-6 max-w-2xl mx-auto">
            Join our network of partners committed to advancing access to justice across Tanzania.
          </Typography>
          <Link to="/partners">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              Explore Partnerships
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default StrategicPartnershipsSection;
