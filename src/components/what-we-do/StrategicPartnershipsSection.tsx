
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Globe, Heart } from 'lucide-react';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import DesignButton from '@/components/design-system/DesignButton';
import DesignCard from '@/components/design-system/DesignCard';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

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
          <Text variant="overline" color="primary" className="font-bold mb-4 block">
            STRATEGIC PARTNERSHIPS
          </Text>
          <Heading level={2} variant="section" className="mb-6">
            Building Coalitions for
            <span className="block text-primary">Lasting Change</span>
          </Heading>
          <Text variant="body" color="muted" className="max-w-3xl mx-auto">
            Our impact is multiplied through strategic partnerships across government, civil society, 
            international organizations, and the private sector.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {partnerCategories.map((category, index) => (
            <DesignCard key={index} variant="elevated" padding="sm" hover className="group">
              <div className={`bg-gradient-to-br ${category.color} p-6 rounded-t-2xl -m-6 mb-6`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <Heading level={4} variant="card" color="white" className="mb-2">
                  {category.title}
                </Heading>
                <Text variant="body-small" color="white" className="opacity-90">
                  {category.description}
                </Text>
              </div>
              <div className="space-y-3 p-6">
                <Heading level={4} variant="card" color="neutral" className="mb-4">
                  Key Partners
                </Heading>
                {category.partners.map((partner, partnerIndex) => (
                  <div key={partnerIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    <Text variant="body-small" color="muted">
                      {partner}
                    </Text>
                  </div>
                ))}
              </div>
            </DesignCard>
          ))}
        </div>

        <DesignCard variant="minimal" padding="xl" className="text-center bg-gradient-to-br from-primary/5 to-secondary-teal/5">
          <Heading level={3} variant="subsection" className="mb-4">
            Become a Partner
          </Heading>
          <Text variant="body" color="muted" className="mb-6 max-w-2xl mx-auto">
            Join our network of partners committed to advancing access to justice across Tanzania.
          </Text>
          <Link to="/partners">
            <DesignButton 
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Explore Partnerships
            </DesignButton>
          </Link>
        </DesignCard>
      </Container>
    </Section>
  );
};

export default StrategicPartnershipsSection;
