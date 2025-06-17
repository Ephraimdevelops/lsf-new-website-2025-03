
import { Calendar, Award, Users, Globe, BookOpen } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

const AchievementsTimelineSection = () => {
  const milestones = [
    {
      year: "2009",
      title: "LSF Establishment",
      description: "Legal Services Facility established to coordinate and strengthen legal aid services across Tanzania.",
      icon: <BookOpen className="h-6 w-6" />,
      color: "from-primary to-primary-dark",
      achievements: ["First strategic framework developed", "Initial partnerships formed"]
    },
    {
      year: "2012",
      title: "National Reach Expansion",
      description: "Expanded operations to cover all 31 regions of Tanzania with comprehensive legal aid programs.",
      icon: <Globe className="h-6 w-6" />,
      color: "from-secondary-teal to-secondary-teal/80",
      achievements: ["31 regions covered", "500+ paralegals trained"]
    },
    {
      year: "2017",
      title: "Legal Aid Act Success",
      description: "Successfully advocated for the Legal Aid Act, establishing a national framework for legal aid coordination.",
      icon: <Award className="h-6 w-6" />,
      color: "from-secondary-orange to-secondary-orange/80",
      achievements: ["Legal Aid Act enacted", "National coordination framework established"]
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched digital platforms and virtual legal aid services, adapting to modern service delivery needs.",
      icon: <Users className="h-6 w-6" />,
      color: "from-secondary-yellow to-secondary-yellow/80",
      achievements: ["Digital platforms launched", "Remote legal aid services established"]
    },
    {
      year: "2024",
      title: "15 Years of Impact",
      description: "Celebrating 15 years of strengthening legal empowerment with over 2.8 million Tanzanians reached.",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      achievements: ["2.8M+ people reached", "78% case resolution rate", "200+ active partners"]
    }
  ];

  return (
    <Section variant="default" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            OUR JOURNEY
          </Typography>
          <Typography variant="h2" className="mb-6">
            15 Years of
            <span className="block text-primary">Transformative Impact</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            From our establishment in 2009 to becoming Tanzania's leading legal empowerment organization, 
            our journey reflects our commitment to expanding access to justice for all.
          </Typography>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-1 bg-gradient-to-b from-primary via-secondary-teal to-secondary-orange hidden lg:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full z-10 hidden lg:block"></div>
                
                {/* Content Card */}
                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <Card variant="elevated" hover className="group">
                    <div className={`bg-gradient-to-br ${milestone.color} p-6 rounded-t-2xl -m-8 mb-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <div className="text-white">
                            {milestone.icon}
                          </div>
                        </div>
                        <Typography variant="h3" className="text-white font-bold">
                          {milestone.year}
                        </Typography>
                      </div>
                      <Typography variant="h4" className="text-white mb-2">
                        {milestone.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-white/90">
                        {milestone.description}
                      </Typography>
                    </div>
                    
                    <div className="space-y-3">
                      <Typography variant="h4" className="text-neutral-dark mb-4">
                        Key Achievements
                      </Typography>
                      {milestone.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center text-sm text-neutral-gray">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="w-full lg:w-5/12 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AchievementsTimelineSection;
