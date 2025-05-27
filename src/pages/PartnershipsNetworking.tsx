
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { LayoutGrid, Globe, Handshake, Building, Users, Award, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PartnershipsNetworking = () => {
  const partnerTypes = [
    {
      title: "Government Institutions",
      description: "Collaborating with ministries, courts, and local government authorities to strengthen the justice system from within.",
      icon: <Building className="h-6 w-6" />,
      examples: ["Ministry of Constitutional and Legal Affairs", "Judiciary of Tanzania", "Regional Administration", "District Councils"],
      image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
    },
    {
      title: "Civil Society",
      description: "Working with NGOs, community organizations, and advocacy groups to amplify grassroots voices.",
      icon: <Globe className="h-6 w-6" />,
      examples: ["Women's Rights Organizations", "Community Based Organizations", "Faith-Based Organizations", "Youth Groups"],
      image: "/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png"
    },
    {
      title: "Development Partners",
      description: "Engaging with international donors and development agencies to scale our impact.",
      icon: <Handshake className="h-6 w-6" />,
      examples: ["UN Women", "USAID", "European Union", "World Bank", "Open Society Foundations"],
      image: "/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
    }
  ];

  const networks = [
    {
      name: "Tanzania Legal Aid Network",
      description: "Leading coalition of legal aid providers across Tanzania",
      role: "Founding Member & Secretariat",
      impact: "50+ member organizations"
    },
    {
      name: "East African Legal Aid Network",
      description: "Regional platform for legal aid collaboration",
      role: "Executive Committee Member",
      impact: "Cross-border advocacy"
    },
    {
      name: "Women's Legal Aid Coalition",
      description: "Specialized network focusing on women's rights",
      role: "Co-Chair",
      impact: "Gender justice advocacy"
    },
    {
      name: "Paralegal Advisory Network",
      description: "Community-based legal service providers",
      role: "Technical Lead",
      impact: "500+ trained paralegals"
    },
    {
      name: "Justice Reform Consortium",
      description: "Multi-stakeholder platform for justice sector reform",
      role: "Steering Committee",
      impact: "Policy reform initiatives"
    }
  ];

  const achievements = [
    {
      title: "Multi-Stakeholder Dialogues",
      description: "Facilitating quarterly dialogue sessions bringing together government, civil society, and development partners",
      icon: <Users className="h-6 w-6" />,
      stats: "12 dialogues annually"
    },
    {
      title: "Joint Advocacy Campaigns",
      description: "Coordinating unified advocacy efforts on key justice issues",
      icon: <Award className="h-6 w-6" />,
      stats: "15+ successful campaigns"
    },
    {
      title: "Knowledge Sharing Platforms",
      description: "Creating spaces for sharing best practices and lessons learned",
      icon: <LayoutGrid className="h-6 w-6" />,
      stats: "25+ knowledge products"
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Handshake className="h-8 w-8" />}
        badge="What We Do"
        title="Partnerships & Networking"
        description="We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors to create lasting change in Tanzania's justice sector."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center space-x-3 mb-6 bg-primary/5 rounded-full px-6 py-3">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                  Collaborative Impact
                </span>
              </div>
              <Typography variant="h2" className="mb-6">
                Building Bridges for Justice
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray text-lg leading-relaxed">
                We believe that sustainable change in the justice sector requires collaborative effort across 
                multiple stakeholders. Our partnership strategy brings together diverse actors to create 
                synergies and amplify impact in advancing access to justice.
              </Typography>
              <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed">
                Through strategic alliances and active networking, we facilitate knowledge sharing, 
                coordinate interventions, and advocate for systemic reforms that benefit all Tanzanians.
              </Typography>
              <Link to="/opportunities">
                <Button size="lg" className="font-semibold">
                  Partner With Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
                alt="Partnership collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-2">
                  <LayoutGrid className="h-6 w-6 mr-3" />
                  <Typography variant="h3" className="text-white">
                    150+
                  </Typography>
                </div>
                <Typography variant="bodySmall" className="text-white/90">
                  Active partnerships across sectors
                </Typography>
              </div>
            </div>
          </div>

          {/* Partnership Categories */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Partnership Categories
              </Typography>
              <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
                Our diverse partnership portfolio spans government, civil society, and international development sectors
              </Typography>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {partnerTypes.map((type, index) => (
                <Card key={index} variant="elevated" hover className="overflow-hidden">
                  <div className="relative h-48 mb-6">
                    <img 
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="text-primary">
                        {type.icon}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <Typography variant="h4" className="mb-3">
                      {type.title}
                    </Typography>
                    <Typography variant="body" className="text-neutral-gray mb-4">
                      {type.description}
                    </Typography>
                    <div className="space-y-2">
                      <Typography variant="bodySmall" className="font-semibold text-primary mb-2">
                        Key Partners:
                      </Typography>
                      {type.examples.slice(0, 3).map((example, idx) => (
                        <div key={idx} className="flex items-center text-sm text-neutral-gray">
                          <div className="w-2 h-2 bg-secondary-teal rounded-full mr-3"></div>
                          {example}
                        </div>
                      ))}
                      {type.examples.length > 3 && (
                        <div className="text-sm text-primary font-medium mt-2">
                          +{type.examples.length - 3} more partners
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Achievements */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Collaborative Achievements
              </Typography>
              <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
                Through partnerships, we've achieved significant milestones in advancing justice sector reforms
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-secondary-teal/5 to-primary/5 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-secondary-teal">
                      {achievement.icon}
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-3 text-secondary-teal">
                    {achievement.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray mb-4">
                    {achievement.description}
                  </Typography>
                  <div className="bg-white rounded-lg px-4 py-2 inline-block">
                    <Typography variant="bodySmall" className="font-semibold text-secondary-teal">
                      {achievement.stats}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Memberships */}
          <div className="bg-neutral-50 rounded-2xl p-8 mb-20">
            <div className="text-center mb-12">
              <Typography variant="h2" className="mb-4">
                Strategic Networks & Memberships
              </Typography>
              <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
                Active participation in key networks amplifies our advocacy and extends our reach
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {networks.map((network, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-secondary-teal">
                  <div className="flex justify-between items-start mb-3">
                    <Typography variant="h4" className="text-secondary-teal flex-1">
                      {network.name}
                    </Typography>
                    <div className="bg-secondary-teal/10 text-secondary-teal px-3 py-1 rounded-full text-xs font-medium">
                      {network.role}
                    </div>
                  </div>
                  <Typography variant="body" className="text-neutral-gray mb-3">
                    {network.description}
                  </Typography>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <Award className="h-4 w-4 mr-2" />
                    {network.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-12 text-center text-white">
            <Typography variant="h3" className="text-white mb-4">
              Ready to Collaborate?
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              We're always looking for new partners who share our vision of accessible justice for all. 
              Let's explore how we can work together to create lasting change.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8">
                  Contact Us
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-semibold px-8">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default PartnershipsNetworking;
