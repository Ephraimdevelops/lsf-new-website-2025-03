
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Mail, Linkedin, Twitter, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  education: string[];
  experience: string[];
  specializations: string[];
  achievements: string[];
  joinedDate: string;
  location: string;
}

const teamMembers: { [key: string]: TeamMember } = {
  '1': {
    id: '1',
    name: 'Dr. Fatuma Mwalimu',
    position: 'Executive Director',
    bio: 'Leading LSF with over 15 years of experience in legal empowerment and human rights advocacy across Tanzania.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'fatuma@lsf.or.tz',
    linkedin: '#',
    education: [
      'PhD in Law, University of London',
      'LLM Human Rights Law, Harvard Law School',
      'LLB, University of Dar es Salaam'
    ],
    experience: [
      'Executive Director, Legal Services Facility (2020-Present)',
      'Regional Director, Legal Aid Network Africa (2015-2020)',
      'Senior Legal Officer, Tanzania Women Lawyers Association (2010-2015)',
      'Legal Aid Coordinator, University of Dar es Salaam (2008-2010)'
    ],
    specializations: [
      'Legal Empowerment',
      'Human Rights Law',
      'Gender and Law',
      'Access to Justice',
      'Organizational Leadership'
    ],
    achievements: [
      'Led LSF to manage over USD 47 million in donor funds',
      'Recipient of the African Women in Leadership Award 2022',
      'Published author on legal empowerment in Tanzania',
      'Keynote speaker at 20+ international conferences'
    ],
    joinedDate: 'January 2020',
    location: 'Dar es Salaam, Tanzania'
  },
  '2': {
    id: '2',
    name: 'John Mwangi',
    position: 'Programs Director',
    bio: 'Overseeing program implementation and community partnerships across all 184 districts of Tanzania.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'john@lsf.or.tz',
    linkedin: '#',
    education: [
      'MA Development Studies, University of Cape Town',
      'BA Social Sciences, University of Dar es Salaam',
      'Certificate in Project Management, PMI'
    ],
    experience: [
      'Programs Director, Legal Services Facility (2021-Present)',
      'Senior Program Manager, Oxfam Tanzania (2018-2021)',
      'Project Coordinator, ActionAid Tanzania (2015-2018)',
      'Field Officer, Plan International Tanzania (2012-2015)'
    ],
    specializations: [
      'Program Management',
      'Community Development',
      'Stakeholder Engagement',
      'Monitoring & Evaluation',
      'Grant Management'
    ],
    achievements: [
      'Successfully managed programs worth USD 25 million',
      'Established partnerships with 200+ community organizations',
      'Developed innovative program delivery models',
      'Certified Project Management Professional (PMP)'
    ],
    joinedDate: 'March 2021',
    location: 'Dar es Salaam, Tanzania'
  },
  '3': {
    id: '3',
    name: 'Grace Kimani',
    position: 'Legal Affairs Coordinator',
    bio: 'Coordinating legal aid services and training programs for community paralegals nationwide.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'grace@lsf.or.tz',
    linkedin: '#',
    education: [
      'LLM Legal Practice, University of Dar es Salaam',
      'LLB, Mzumbe University',
      'Diploma in Paralegal Studies, Open University of Tanzania'
    ],
    experience: [
      'Legal Affairs Coordinator, Legal Services Facility (2019-Present)',
      'Senior Legal Officer, Tanzania Legal Aid Society (2016-2019)',
      'Legal Assistant, Dar es Salaam Law Chambers (2014-2016)',
      'Paralegal Trainer, Community Legal Services (2012-2014)'
    ],
    specializations: [
      'Legal Aid Services',
      'Paralegal Training',
      'Family Law',
      'Land Rights',
      'Community Legal Education'
    ],
    achievements: [
      'Trained over 1,000 community paralegals',
      'Developed national paralegal training curriculum',
      'Led successful legal aid cases for women\'s rights',
      'Advocate of the High Court of Tanzania'
    ],
    joinedDate: 'June 2019',
    location: 'Mwanza, Tanzania'
  },
  '4': {
    id: '4',
    name: 'Ahmed Hassan',
    position: 'Communications Manager',
    bio: 'Managing public communications, advocacy campaigns, and stakeholder engagement initiatives.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'ahmed@lsf.or.tz',
    linkedin: '#',
    twitter: '#',
    education: [
      'MA Communications and Media Studies, University of Nairobi',
      'BA Journalism, University of Dar es Salaam',
      'Certificate in Digital Marketing, Google'
    ],
    experience: [
      'Communications Manager, Legal Services Facility (2022-Present)',
      'Senior Communications Officer, UNDP Tanzania (2019-2022)',
      'Media Relations Specialist, Tanzania Broadcasting Corporation (2016-2019)',
      'Journalist, The Guardian Tanzania (2014-2016)'
    ],
    specializations: [
      'Strategic Communications',
      'Digital Marketing',
      'Media Relations',
      'Campaign Management',
      'Content Creation'
    ],
    achievements: [
      'Increased LSF\'s media visibility by 300%',
      'Led successful Mama Samia Legal Aid Campaign',
      'Award-winning journalist for investigative reporting',
      'Speaker at 15+ communications conferences'
    ],
    joinedDate: 'September 2022',
    location: 'Dar es Salaam, Tanzania'
  }
};

const TeamDetail = () => {
  const { teamId } = useParams();
  const member = teamId ? teamMembers[teamId] : null;

  if (!member) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
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
      <HeroSection
        icon={<Users className="h-8 w-8" />}
        badge="Team Member"
        title={member.name}
        description={member.position}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/team" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Profile Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-8">
                  <div className="h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-2 text-neutral-dark">{member.name}</h1>
                    <p className="text-primary font-semibold mb-4">{member.position}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-neutral-gray">
                        <Calendar size={16} className="mr-2" />
                        Joined: {member.joinedDate}
                      </div>
                      <div className="flex items-center text-sm text-neutral-gray">
                        <MapPin size={16} className="mr-2" />
                        {member.location}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex space-x-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-3 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <Mail size={18} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <Twitter size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-2 space-y-12">
                {/* Biography */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">About</h2>
                  <p className="text-lg text-neutral-gray leading-relaxed">{member.bio}</p>
                </div>

                {/* Specializations */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {member.specializations.map((spec, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Education</h2>
                  <div className="space-y-4">
                    {member.education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Professional Experience</h2>
                  <div className="space-y-4">
                    {member.experience.map((exp, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-teal rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray">{exp}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Key Achievements</h2>
                  <div className="space-y-4">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-orange rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamDetail;
