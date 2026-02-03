import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, ArrowRight, Users, Gavel, CheckCircle2, Shield } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import CinematicHero from '@/components/shared/CinematicHero';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/shared/SEOHead';

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
      <SEOHead
        title="Our Team"
        description="Meet the dedicated LSF Secretariat and Board of Directors working tirelessly to advance access to justice."
        canonicalUrl="https://lsftz.org/team"
      />
      <CinematicHero
        title="Our Team"
        badge="Meet the Experts"
        description="Our dedicated professionals and board members drive LSF's mission to advance access to justice across Tanzania."
        backgroundImage="/lovable-uploads/team-hero-bg.png"
      />

      {/* AGM Section (Supreme Body) - Executive Redesign */}
      <section className="py-10 bg-white relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/brand-pattern.png')] bg-cover bg-center" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Side: Text Content */}
            <div className="text-left">
              {/* Executive Badge */}
              <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-neutral-900 text-xs font-bold uppercase tracking-widest">Supreme Decision-Making Body</span>
              </div>

              {/* Heading */}
              <div className="relative mb-5">
                <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
                  Annual General <span className="text-primary">Meeting</span>
                </h2>
                {/* Decorative Gavel Watermark */}
                <Gavel className="absolute -top-6 left-64 h-16 w-16 text-primary/5 rotate-12 pointer-events-none hidden md:block" />
              </div>

              {/* Content */}
              <p className="text-neutral-600 text-lg leading-relaxed mb-8 font-light border-l-4 border-primary pl-6">
                The AGM sits at the apex of our governance structure. It serves as the ultimate authority, approving strategic directions, financial statements, and appointing the Board of Directors—ensuring LSF remains deeply rooted in community accountability.
              </p>

              {/* Decorative Separator */}
              <div className="flex items-center gap-4 opacity-20">
                <div className="h-px w-20 bg-neutral-900"></div>
                <Gavel className="h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Right Side: Floating Creative Mandates */}
            <div className="hidden lg:flex flex-col gap-6 relative">
              {/* Decorative Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/5 via-teal-500/5 to-transparent rounded-full blur-3xl -z-10"></div>

              {/* Mandate 1: Board - Primary */}
              <div className="bg-white p-6  border-primary w-4/5 self-start hover:-translate-y-2 transition-transform duration-500 relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-lg">Appoints Board</h4>
                    <p className="text-neutral-500 text-sm mt-1">Ensures qualified, community-rooted oversight.</p>
                  </div>
                </div>
              </div>

              {/* Mandate 2: Strategy - Teal - Staggered Right */}
              <div className="bg-white p-6  w-4/5 self-end hover:-translate-y-2 transition-transform duration-500 delay-100 relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-teal-50/50 rounded-xl text-teal-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-lg">Approves Strategy</h4>
                    <p className="text-neutral-500 text-sm mt-1">Sets the 5-year direction for legal empowerment.</p>
                  </div>
                </div>
              </div>

              {/* Mandate 3: Finance - Primary - Staggered Left/Center */}
              <div className="bg-white p-6 w-4/5 self-center hover:-translate-y-2 transition-transform duration-500 delay-200 relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-lg">Financial Integrity</h4>
                    <p className="text-neutral-500 text-sm mt-1">Ratifies audited accounts & ensures transparency.</p>
                  </div>
                </div>
              </div>
            </div>

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
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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

      {/* Team Staff Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Badge className="mb-4 bg-primary text-white border-0 rounded-full px-6 py-2">
              <Users className="h-4 w-4 mr-2" />
              Secretariat
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Executive Team
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl border-l-4 border-primary pl-6">
              Our experienced Secretariat managing day-to-day operations to advance legal empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Link key={member.id} to={`/team/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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
