import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, ArrowRight } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import CinematicHero from '@/components/shared/CinematicHero';

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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Leadership
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Executive Team
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Our experienced team leads LSF's mission to advance legal empowerment and access to justice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group block">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-secondary-orange font-semibold">{member.position}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="p-2 bg-neutral-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={14} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-neutral-100 rounded-full hover:bg-primary hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                      </div>
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
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-secondary-teal/10 text-secondary-teal text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Governance
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Board of Directors
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Strategic oversight and governance ensuring LSF remains accountable to our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {boardMembers.map((member) => (
              <Link key={member.id} to={`/board/${member.id}`} className="group block">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 group-hover:border-secondary-teal/30 group-hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-secondary-teal font-semibold">{member.position}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="p-2 bg-neutral-100 rounded-full hover:bg-secondary-teal hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail size={14} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-neutral-100 rounded-full hover:bg-secondary-teal hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center text-secondary-teal font-bold text-sm group-hover:gap-2 transition-all">
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
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            We're always looking for passionate individuals who want to make a difference in advancing justice across Tanzania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/opportunities">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 rounded-full text-lg">
                View Open Positions
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-10 py-5 rounded-full text-lg">
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
