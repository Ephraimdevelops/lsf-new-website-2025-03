
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, GraduationCap, Heart, ArrowRight, Calendar, Star, Globe, Award, Target, Lightbulb, AlertTriangle, CheckCircle, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const opportunities = [
  {
    id: 1,
    title: "Volunteer Legal Assistant",
    location: "Dar es Salaam, Tanzania",
    deadline: "2025-07-25",
    type: "Volunteer",
    description: "Assist with case intake, community outreach, and paralegal coordination in regional offices.",
    image: "/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png"
  },
  {
    id: 2,
    title: "Internship – Digital Communication",
    location: "Remote / Dar es Salaam",
    deadline: "2025-07-28",
    type: "Internship",
    description: "Support social media, content writing, and digital campaigns across our platforms.",
    image: "/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png"
  },
  {
    id: 3,
    title: "Project Officer – Access to Justice",
    location: "Mbeya, Tanzania",
    deadline: "2025-08-05",
    type: "Full Time",
    description: "Coordinate regional activities, monitor paralegal programs, and report implementation progress.",
    image: "/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png"
  },
];

const getDaysLeft = (deadline: string) => {
  const now = new Date();
  const endDate = new Date(deadline);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""} left` : "Closing today";
};

const OpportunitiesPage = () => {
  return (
       <Layout>
      <HeroSection
        icon={<Newspaper className="h-10 w-8" />}
        badge="We need You"
        title="Join Our Mission"
        description="Explore open roles and help us expand access to justice across Tanzania."
        backgroundImage="/lovable-uploads/03e3e41e-930e-409b-9697-0530773cca4c.png"
      />

      <Container className="py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {opportunity.image && (
                <img
                  src={opportunity.image}
                  alt={opportunity.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5 space-y-3">
                <Typography variant="h3" className="text-lg font-semibold">
                  {opportunity.title}
                </Typography>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {opportunity.description}
                </p>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-medium text-green-600">
                    {getDaysLeft(opportunity.deadline)}
                  </div>
                  <div className="text-sm font-semibold">{opportunity.type}</div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Button size="sm" asChild>
                    <Link to={`/opportunities/${opportunity.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default OpportunitiesPage;