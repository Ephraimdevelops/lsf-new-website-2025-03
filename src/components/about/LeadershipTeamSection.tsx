
import { ArrowRight, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LeadershipTeamSection = () => {
  const leadership = [
    {
      name: "Dr. Felicia Mukandala",
      position: "Executive Director",
      bio: "Leading LSF's strategic vision with over 20 years of experience in legal empowerment and social justice advocacy.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
      linkedin: "#",
      email: "f.mukandala@lsf.or.tz"
    },
    {
      name: "John Mwaiselage",
      position: "Deputy Director",
      bio: "Overseeing program implementation and capacity building initiatives across Tanzania's legal aid landscape.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces",
      linkedin: "#",
      email: "j.mwaiselage@lsf.or.tz"
    },
    {
      name: "Grace Lwiza",
      position: "Director of Programs",
      bio: "Managing strategic partnerships and grant-making initiatives to maximize impact across our focus areas.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces",
      linkedin: "#",
      email: "g.lwiza@lsf.or.tz"
    },
    {
      name: "Dr. Michael Chalamila",
      position: "Research Director",
      bio: "Leading evidence-based research and policy advocacy to strengthen Tanzania's legal empowerment framework.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=faces",
      linkedin: "#",
      email: "m.chalamila@lsf.or.tz"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            LEADERSHIP TEAM
          </Typography>
          <Typography variant="h2" className="mb-6">
            Experienced Leaders
            <span className="block text-primary">Driving Change</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Our leadership team brings decades of combined experience in law, development, 
            and social justice to guide LSF's mission of strengthening legal empowerment across Tanzania.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {leadership.map((leader, index) => (
            <Card key={index} variant="elevated" hover className="text-center group">
              <div className="relative mb-6">
                <img 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <Typography variant="h4" className="mb-2 group-hover:text-primary transition-colors">
                {leader.name}
              </Typography>
              
              <Typography variant="bodySmall" className="text-primary font-semibold mb-3">
                {leader.position}
              </Typography>
              
              <Typography variant="bodySmall" className="text-neutral-gray mb-6 leading-relaxed">
                {leader.bio}
              </Typography>
              
              <div className="flex justify-center gap-3">
                <a 
                  href={`mailto:${leader.email}`}
                  className="w-8 h-8 bg-neutral-100 hover:bg-primary rounded-full flex items-center justify-center transition-colors group/icon"
                >
                  <Mail className="h-4 w-4 text-neutral-gray group-hover/icon:text-white" />
                </a>
                <a 
                  href={leader.linkedin}
                  className="w-8 h-8 bg-neutral-100 hover:bg-secondary-teal rounded-full flex items-center justify-center transition-colors group/icon"
                >
                  <Linkedin className="h-4 w-4 text-neutral-gray group-hover/icon:text-white" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-2xl p-8">
          <Typography variant="h3" className="mb-4">
            Meet Our Full Team
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-6 max-w-2xl mx-auto">
            Discover the dedicated professionals working across all departments to advance 
            access to justice throughout Tanzania.
          </Typography>
          <Link to="/team">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              View All Team Members
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default LeadershipTeamSection;
