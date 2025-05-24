
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, Twitter } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Fatuma Mwalimu',
    position: 'Executive Director',
    bio: 'Leading LSF with over 15 years of experience in legal empowerment and human rights advocacy across Tanzania.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'fatuma@lsf.or.tz'
  },
  {
    id: '2',
    name: 'John Mwangi',
    position: 'Programs Director',
    bio: 'Overseeing program implementation and community partnerships across all 184 districts of Tanzania.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'john@lsf.or.tz'
  },
  {
    id: '3',
    name: 'Grace Kimani',
    position: 'Legal Affairs Coordinator',
    bio: 'Coordinating legal aid services and training programs for community paralegals nationwide.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'grace@lsf.or.tz'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    position: 'Communications Manager',
    bio: 'Managing public communications, advocacy campaigns, and stakeholder engagement initiatives.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'ahmed@lsf.or.tz'
  }
];

const Team = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-secondary-teal py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl opacity-90">
              Meet the dedicated professionals working to advance access to justice across Tanzania
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.position}</p>
                    <p className="text-neutral-gray text-sm leading-relaxed mb-4">{member.bio}</p>

                    {/* Social Links */}
                    <div className="flex space-x-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
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
                        >
                          <Twitter size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Team</h2>
            <p className="text-lg text-neutral-dark mb-8">
              We're always looking for passionate individuals who want to make a difference in advancing justice and legal empowerment across Tanzania.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
