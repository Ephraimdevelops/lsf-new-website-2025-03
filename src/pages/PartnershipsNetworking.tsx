import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { LayoutGrid, Globe, Handshake, Building } from 'lucide-react';

const PartnershipsNetworking = () => {
  const partnerTypes = [
    {
      title: "Government Institutions",
      description: "Collaborating with ministries, courts, and local government authorities.",
      icon: <Building className="h-6 w-6" />
    },
    {
      title: "Civil Society",
      description: "Working with NGOs, community organizations, and advocacy groups.",
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: "Development Partners",
      description: "Engaging with international donors and development agencies.",
      icon: <Handshake className="h-6 w-6" />
    }
  ];

  const networks = [
    "Tanzania Legal Aid Network",
    "East African Legal Aid Network",
    "Women's Legal Aid Coalition",
    "Paralegal Advisory Network",
    "Justice Reform Consortium"
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Handshake className="h-8 w-8" />}
        badge="What We Do"
        title="Partnerships & Networking"
        description="We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Typography variant="h2" className="mb-6">
                Collaborative Approach
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray">
                We believe that sustainable change in the justice sector requires collaborative effort across 
                multiple stakeholders. Our partnership strategy brings together diverse actors to create 
                synergies and amplify impact in advancing access to justice.
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Through strategic alliances and active networking, we facilitate knowledge sharing, 
                coordinate interventions, and advocate for systemic reforms that benefit all Tanzanians.
              </Typography>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <LayoutGrid className="h-8 w-8 text-primary mr-3" />
                <Typography variant="h3" className="text-primary">
                  150+
                </Typography>
              </div>
              <Typography variant="body" className="text-neutral-gray">
                Active partnerships across government, civil society, and development sectors
              </Typography>
            </div>
          </div>

          <div className="mb-16">
            <Typography variant="h2" className="text-center mb-12">
              Partnership Categories
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type, index) => (
                <Card key={index} variant="elevated" hover className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {type.icon}
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {type.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray">
                    {type.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-secondary-teal/5 rounded-xl p-8">
            <Typography variant="h2" className="text-center mb-8">
              Key Networks
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {networks.map((network, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-secondary-teal">
                  <Typography variant="h4" className="text-secondary-teal">
                    {network}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default PartnershipsNetworking;
