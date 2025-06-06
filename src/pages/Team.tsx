
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, Twitter, Users, ArrowRight } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  type: 'team' | 'board';
}

const teamMembers: TeamMember[] = [
  // Team Members
  {
    id: '1',
    name: 'Dr. Fatuma Mwalimu',
    position: 'Executive Director',
    bio: 'Leading LSF with over 15 years of experience in legal empowerment and human rights advocacy across Tanzania. Dr. Mwalimu holds a PhD in Law from the University of London and has been instrumental in establishing LSF as a leading organization in legal empowerment.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'fatuma@lsf.or.tz',
    type: 'team'
  },
  {
    id: '2',
    name: 'John Mwangi',
    position: 'Programs Director',
    bio: 'Overseeing program implementation and community partnerships across all 184 districts of Tanzania. John brings over 10 years of experience in development programming and has successfully managed programs worth over USD 25 million.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'john@lsf.or.tz',
    type: 'team'
  },
  {
    id: '3',
    name: 'Grace Kimani',
    position: 'Legal Affairs Coordinator',
    bio: 'Coordinating legal aid services and training programs for community paralegals nationwide. Grace is an advocate of the High Court of Tanzania and has trained over 1,000 community paralegals across the country.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'grace@lsf.or.tz',
    type: 'team'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    position: 'Communications Manager',
    bio: 'Managing public communications, advocacy campaigns, and stakeholder engagement initiatives. Ahmed has increased LSF\'s media visibility by 300% and led the successful Mama Samia Legal Aid Campaign.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'ahmed@lsf.or.tz',
    twitter: '#',
    type: 'team'
  },
  {
    id: '5',
    name: 'Dr. Amina Juma',
    position: 'Research & Policy Director',
    bio: 'Leading research initiatives and policy advocacy to strengthen legal frameworks. Dr. Juma has authored over 20 research papers on legal empowerment and has been instrumental in influencing policy changes at national level.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'amina@lsf.or.tz',
    type: 'team'
  },
  {
    id: '6',
    name: 'Michael Ngozi',
    position: 'Finance Manager',
    bio: 'Managing financial operations and ensuring compliance with donor requirements. Michael is a certified accountant with 12 years of experience in NGO financial management and has successfully managed LSF\'s financial operations.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'michael@lsf.or.tz',
    type: 'team'
  },
  // Board Members
  {
    id: 'board-1',
    name: 'Hon. Justice Mary Kimani',
    position: 'Board Chairperson',
    bio: 'Former High Court Judge with 25 years of experience in the judiciary and a strong advocate for access to justice. Justice Kimani has led landmark cases on women\'s property rights and established the first mobile court services in rural Tanzania.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    email: 'mary.kimani@lsf.or.tz',
    linkedin: '#',
    type: 'board'
  },
  {
    id: 'board-2',
    name: 'Prof. David Mwalimu',
    position: 'Vice Chairperson',
    bio: 'Law Professor at University of Dar es Salaam, specializing in human rights law and legal empowerment. Prof. Mwalimu has published 45 academic papers and serves as a consultant to the African Union on legal empowerment.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    email: 'david.mwalimu@lsf.or.tz',
    linkedin: '#',
    type: 'board'
  },
  {
    id: 'board-3',
    name: 'Ms. Sarah Ndugu',
    position: 'Secretary',
    bio: 'Civil society leader with extensive experience in community development and women\'s rights advocacy. Sarah has led campaigns resulting in 3 policy changes for women\'s rights and trained over 500 community paralegals.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    email: 'sarah.ndugu@lsf.or.tz',
    type: 'board'
  },
  {
    id: 'board-4',
    name: 'Mr. James Mwenda',
    position: 'Treasurer',
    bio: 'Financial expert with 20 years in development finance and organizational management. James has managed over $100M in development funds and implemented financial systems for 50+ NGOs across Tanzania.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    email: 'james.mwenda@lsf.or.tz',
    type: 'board'
  },
  {
    id: 'board-5',
    name: 'Dr. Rehema Mwalimu',
    position: 'Board Member',
    bio: 'Development expert with 18 years of experience in international development and gender equality. Dr. Mwalimu has worked with UN Women and has extensive experience in legal empowerment programs across East Africa.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    email: 'rehema@lsf.or.tz',
    linkedin: '#',
    type: 'board'
  }
];

const Team = () => {
  const teamStaff = teamMembers.filter(member => member.type === 'team');
  const boardMembers = teamMembers.filter(member => member.type === 'board');

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
            {teamStaff.map((member) => (
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
              <Link key={member.id} to={`/board/${member.id.replace('board-', '')}`} className="group block">
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
