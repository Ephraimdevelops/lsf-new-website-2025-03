import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Mail, Linkedin, Twitter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import LoadingState from '@/components/shared/LoadingState';

const TeamDetail = () => {
  const { teamId } = useParams();

  // Fetch team member from Convex
  const member = useQuery(
    api.team.getById,
    teamId ? { id: teamId as Id<"team_members"> } : "skip"
  );

  if (member === undefined) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Team Member Not Found</h1>
            <Link to="/team">
              <Button>Back to Team</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={member.image}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-24">
          <Link to="/team" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <img
              src={member.image}
              alt={member.name}
              className="w-48 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
            />
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-0">
                <Users className="h-3 w-3 mr-2" />
                {member.type === 'board' ? 'Board of Directors' : 'Executive Team'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{member.name}</h1>
              <p className="text-xl text-white/90">{member.position}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-8">
                  {/* Contact */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Connect</h3>
                    <div className="flex space-x-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                        >
                          <Mail size={20} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                        >
                          <Twitter size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <Link to="/contact">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
                        Get in Touch
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Rest of Our Team</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Discover the dedicated professionals driving LSF's mission forward.
          </p>
          <Link to="/team">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              View Full Team
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default TeamDetail;
