import { Target, Eye, Heart, Scale } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

const MissionVisionSection = () => {
  const values = [
    {
      icon: <Scale className="h-12 w-12" />,
      title: "Justice for All",
      description: "We believe every Tanzanian deserves equal access to legal protection and representation.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Community Empowerment",
      description: "We strengthen communities by building local capacity and knowledge of legal rights.",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Sustainable Impact",
      description: "We focus on creating lasting change through systemic improvements and partnerships.",
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Eye className="h-12 w-12" />,
      title: "Transparency",
      description: "We operate with complete transparency and accountability in all our activities.",
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <Section variant="default" padding="md" className="bg-gradient-to-b from-white to-gray-100">
      <Container size="xl">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 lg:divide-x lg:divide-gray-200">
          {/* Mission */}
          <div className="lg:pr-6">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 py-1 mb-8">
              <Target className="h-12 w-12 mr-2 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-xs">
                OUR MISSION
              </Typography>
            </div>
            <Typography variant="h2" className="mb-3 text-2xl md:text-3xl font-serif">
              Strengthening Legal Empowerment Across Tanzania
            </Typography>
            <Typography variant="body" className="text-neutral-gray leading-relaxed font-sans text-sm md:text-base">
              To strengthen legal empowerment in Tanzania by providing strategic grants, 
              building capacity, fostering partnerships, conducting research, and advocating 
              for policy reforms that ensure equal access to justice for all, with particular 
              focus on marginalized communities and women's rights.
            </Typography>
          </div>

          {/* Vision */}
          <div className="lg:pl-6">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-3 py-1 mb-8">
              <Eye className="h-12 w-12 mr-2 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold text-xs">
                OUR VISION
              </Typography>
            </div>
            <Typography variant="h2" className="mb-3 text-2xl md:text-3xl font-serif">
              A Tanzania Where Justice is Accessible to All
            </Typography>
            <Typography variant="body" className="text-neutral-gray leading-relaxed font-sans text-sm md:text-base">
              We envision a Tanzania where every citizen, regardless of their economic status, 
              gender, or social background, has meaningful access to quality legal services 
              and can effectively claim their rights within a responsive and accountable 
              justice system.
            </Typography>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-6">
          <Typography variant="h3" className="text-primary font-bold mb-2 text-xs">
            OUR VALUES
          </Typography>
          <Typography variant="h2" className="mb-3 text-2xl md:text-3xl font-serif">
            Principles That Guide Our Work
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto font-sans text-sm md:text-base">
            Our values shape every decision we make and every partnership we forge, 
            ensuring our work creates meaningful and lasting impact.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value, index) => (
            <Card
              key={index}
              variant="elevated"
              className="text-center p-4 hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-18 h-18 bg-gradient-to-br ${value.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <div className="text-white">
                  {value.icon}
                </div>
              </div>
              <Typography variant="h4" className="mb-2 text-lg font-serif">
                {value.title}
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray font-sans text-sm">
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