import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Mail, Linkedin, Twitter, Users, Crown, ArrowRight, Quote, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();

  const member = useQuery(
    api.team.getById,
    id ? { id: id as Id<"team_members"> } : "skip"
  );

  // Related members query - don't block rendering on this
  const allMembers = useQuery(api.team.get);
  const relatedMembers = (allMembers || [])
    .filter(m => m._id !== id && m.type === member?.type)
    .slice(0, 3);

  // Only show spinner if member is loading (undefined = loading)
  if (member === undefined) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary-teal/5 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-secondary-teal border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-neutral-500 text-sm">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary-teal/5 to-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-light text-neutral-900 mb-4">Team Member Not Found</h1>
            <Link to="/team">
              <Button className="rounded-full px-8">View Our Team</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isBoard = member.type === 'board';
  const isAgm = member.type === 'agm';

  return (
    <Layout>
      <div className="bg-gradient-to-b from-secondary-teal/5 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-24 pb-16">
          {/* Back Navigation */}
          <Link
            to="/team"
            className="inline-flex items-center text-neutral-600 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Team
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Profile Image */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto">
                <img
                  src={member.image || '/lovable-uploads/placeholder.svg'}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 to-secondary-teal/20 -z-10"></div>
              </div>
            </div>

            {/* Info */}
            <div>
              {/* Type Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isBoard
                    ? 'bg-secondary-orange/10 text-secondary-orange'
                    : isAgm
                      ? 'bg-teal-500/10 text-teal-600'
                      : 'bg-primary/10 text-primary'
                  }`}>
                  {isBoard ? <Crown size={16} /> : isAgm ? <Gavel size={16} /> : <Users size={16} />}
                  {isBoard ? 'Board of Directors' : isAgm ? 'AGM Member' : 'Executive Team'}
                </span>
              </div>

              {/* Name & Position */}
              <h1 className="text-4xl lg:text-5xl font-light text-neutral-900 mb-4 leading-tight">
                {member.name}
              </h1>
              <p className="text-xl text-secondary-teal font-medium mb-8">
                {member.position}
              </p>

              {/* Social Links */}
              {(member.email || member.linkedin || member.twitter) && (
                <div className="flex gap-3 mb-8">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all shadow-sm border border-neutral-100"
                      title="Email"
                    >
                      <Mail size={20} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-neutral-100"
                      title="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={`https://twitter.com/${member.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-600 hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-neutral-100"
                      title="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                </div>
              )}

              {/* CTA */}
              <Link to="/contact">
                <Button className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="container mx-auto px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-neutral-100">
              <h2 className="text-2xl font-medium text-neutral-900 mb-6">About {member.name.split(' ')[0]}</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line text-lg">
                  {member.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote/Mission Section */}
        <div className="container mx-auto px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-secondary-teal/10 rounded-3xl p-8 lg:p-12 border border-neutral-100 text-center">
              <Quote className="h-10 w-10 text-primary/30 mx-auto mb-4" />
              <p className="text-xl lg:text-2xl font-light text-neutral-800 italic leading-relaxed mb-6">
                "{member.quote || "At LSF, we believe that access to justice is a fundamental right, not a privilege. Every day, we work to make this vision a reality for all Tanzanians."}"
              </p>
              <p className="text-primary font-medium">{member.name}</p>
              <p className="text-neutral-500 text-sm">{member.position}</p>
            </div>
          </div>
        </div>

        {/* Related Team Members */}
        {relatedMembers.length > 0 && (
          <div className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-medium text-neutral-900 mb-8 text-center">
                More {isBoard ? 'Board Members' : isAgm ? 'AGM Members' : 'Team Members'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedMembers.map(person => (
                  <Link
                    key={person._id}
                    to={`/team/${person._id}`}
                    className="group"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100 hover:shadow-lg transition-all hover:-translate-y-1">
                      <img
                        src={person.image || '/lovable-uploads/placeholder.svg'}
                        alt={person.name}
                        className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 group-hover:scale-105 transition-transform"
                      />
                      <h3 className="font-medium text-neutral-900 text-center group-hover:text-primary transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-sm text-neutral-500 text-center">{person.position}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/team">
                  <Button variant="outline" className="rounded-full px-8 group">
                    View Full Team
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamDetail;
