
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, Twitter, Users, ArrowRight } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';

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
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Users className="h-8 w-8" />}
        badge="Meet Our Team"
        title="Our Team"
        description="Meet the dedicated professionals and board members working to advance access to justice across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Team Staff Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Executive Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-neutral-gray">
              Our experienced team leads LSF's mission to advance legal empowerment and access to justice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.position}</p>
                    <p className="text-neutral-gray text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>

                    {/* Social Links */}
                    <div className="flex space-x-3 mb-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
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
                          className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter size={16} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium">View Profile</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-secondary-teal/10 text-secondary-teal text-sm font-medium px-4 py-2 rounded-full mb-4">
              Governance
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary-teal to-primary bg-clip-text text-transparent">
              Board of Directors
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-secondary-teal to-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-neutral-gray">
              Our board provides strategic oversight and governance, ensuring LSF remains accountable to our mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {boardMembers.map((member) => (
              <Link key={member.id} to={`/board/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-secondary-teal/30 group-hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark group-hover:text-secondary-teal transition-colors duration-300">{member.name}</h3>
                    <p className="text-secondary-teal font-semibold mb-3">{member.position}</p>
                    <p className="text-neutral-gray text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>

                    {/* Social Links */}
                    <div className="flex space-x-3 mb-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-secondary-teal hover:text-white transition-colors duration-300"
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
                          className="p-2 bg-gray-100 rounded-full hover:bg-secondary-teal hover:text-white transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center text-secondary-teal opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium">View Profile</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Join Our Team</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              We're always looking for passionate individuals who want to make a difference in advancing justice and legal empowerment across Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/opportunities">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                  View Open Positions
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
