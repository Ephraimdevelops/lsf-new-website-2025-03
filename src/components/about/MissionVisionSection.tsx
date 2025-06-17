
import { Target, Eye, Heart, Scale } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

const MissionVisionSection = () => {
  const values = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Justice for All",
      description: "We believe every Tanzanian deserves equal access to legal protection and representation.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community Empowerment",
      description: "We strengthen communities by building local capacity and knowledge of legal rights.",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Sustainable Impact",
      description: "We focus on creating lasting change through systemic improvements and partnerships.",
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Transparency",
      description: "We operate with complete transparency and accountability in all our activities.",
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <Section variant="default" padding="xl">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Mission */}
          <div>
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                OUR MISSION
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Strengthening Legal Empowerment Across Tanzania
            </Typography>
            <Typography variant="body" className="text-neutral-gray leading-relaxed">
              To strengthen legal empowerment in Tanzania by providing strategic grants, 
              building capacity, fostering partnerships, conducting research, and advocating 
              for policy reforms that ensure equal access to justice for all, with particular 
              focus on marginalized communities and women's rights.
            </Typography>
          </div>

          {/* Vision */}
          <div>
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-6">
              <Eye className="h-5 w-5 mr-3 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold">
                OUR VISION
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              A Tanzania Where Justice is Accessible to All
            </Typography>
            <Typography variant="body" className="text-neutral-gray leading-relaxed">
              We envision a Tanzania where every citizen, regardless of their economic status, 
              gender, or social background, has meaningful access to quality legal services 
              and can effectively claim their rights within a responsive and accountable 
              justice system.
            </Typography>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            OUR VALUES
          </Typography>
          <Typography variant="h2" className="mb-6">
            Principles That Guide Our Work
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Our values shape every decision we make and every partnership we forge, 
            ensuring our work creates meaningful and lasting impact.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} variant="elevated" hover className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <div className="text-white">
                  {value.icon}
                </div>
              </div>
              <Typography variant="h4" className="mb-3">
                {value.title}
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                {value.description}
              </Typography>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default MissionVisionSection;
