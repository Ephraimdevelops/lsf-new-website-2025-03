import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, ArrowRight, Users } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import CinematicHero from '@/components/shared/CinematicHero';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const { teamMembers, boardMembers, loading, error } = useTeamMembers();

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <CinematicHero
        title="Our Team"
        badge="Meet the Experts"
        description="Our dedicated professionals and board members drive LSF's mission to advance access to justice across Tanzania."
        backgroundImage="/lovable-uploads/team-hero-bg.png"
      />

      {/* Team Staff Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Badge className="mb-4 bg-primary text-white border-0 rounded-full px-6 py-2">
              <Users className="h-4 w-4 mr-2" />
              Leadership
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Executive Team
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl border-l-4 border-primary pl-6">
              Our experienced team leads LSF's mission to advance legal empowerment and access to justice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-white/90 font-medium">{member.position}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                      {member.bio}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Social Links */}
                      <div className="flex space-x-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={16} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin size={16} />
                          </a>
                        )}
                      </div>

                      {/* View Profile */}
                      <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                        View Profile
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Badge className="mb-4 bg-primary text-white border-0 rounded-full px-6 py-2">
              <Users className="h-4 w-4 mr-2" />
              Governance
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Board of Directors
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl border-l-4 border-primary pl-6">
              Strategic oversight and governance ensuring LSF remains accountable to our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-white/90 font-medium">{member.position}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                      {member.bio}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Social Links */}
                      <div className="flex space-x-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={16} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin size={16} />
                          </a>
                        )}
                      </div>

                      {/* View Profile */}
                      <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                        View Profile
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            We're always looking for passionate individuals who want to make a difference in advancing justice across Tanzania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/opportunities">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-5 rounded-full text-lg">
                View Open Positions
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 rounded-full text-lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
