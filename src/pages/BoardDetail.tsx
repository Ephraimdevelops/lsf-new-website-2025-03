
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Mail, Linkedin, Award, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  education: string[];
  experience: string[];
  achievements: string[];
  joinedDate: string;
  location: string;
}

const boardMembers: { [key: string]: BoardMember } = {
  '1': {
    id: '1',
    name: 'Hon. Justice Mary Kimani',
    position: 'Board Chairperson',
    bio: 'Former High Court Judge with 25 years of experience in the judiciary and a strong advocate for access to justice.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'mary.kimani@lsf.or.tz',
    linkedin: '#',
    education: [
      'LLB, University of Dar es Salaam',
      'LLM Human Rights Law, University of London',
      'Certificate in Judicial Administration, National Judicial Institute'
    ],
    experience: [
      'High Court Judge (1998-2023)',
      'Magistrate, District Court (1990-1998)',
      'Legal Officer, Attorney General\'s Chambers (1985-1990)'
    ],
    achievements: [
      'Led landmark cases on women\'s property rights',
      'Established the first mobile court services in rural Tanzania',
      'Recipient of the Tanzania Legal Excellence Award 2022'
    ],
    joinedDate: 'January 2024',
    location: 'Dar es Salaam, Tanzania'
  },
  '2': {
    id: '2',
    name: 'Prof. David Mwalimu',
    position: 'Vice Chairperson',
    bio: 'Law Professor at University of Dar es Salaam, specializing in human rights law and legal empowerment.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'david.mwalimu@lsf.or.tz',
    linkedin: '#',
    education: [
      'PhD in Law, Harvard Law School',
      'LLM International Human Rights Law, Oxford University',
      'LLB, University of Dar es Salaam'
    ],
    experience: [
      'Professor of Law, University of Dar es Salaam (2010-Present)',
      'Senior Lecturer, University of Cape Town (2005-2010)',
      'Legal Advisor, Tanzania Human Rights Commission (2000-2005)'
    ],
    achievements: [
      'Published 45 academic papers on human rights',
      'Consultant to the African Union on legal empowerment',
      'Founding member of the East African Law Society'
    ],
    joinedDate: 'March 2023',
    location: 'Dar es Salaam, Tanzania'
  },
  '3': {
    id: '3',
    name: 'Ms. Sarah Ndugu',
    position: 'Secretary',
    bio: 'Civil society leader with extensive experience in community development and women\'s rights advocacy.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'sarah.ndugu@lsf.or.tz',
    education: [
      'MA Development Studies, University of Edinburgh',
      'BA Social Work, University of Dar es Salaam',
      'Certificate in Gender and Development, UNISA'
    ],
    experience: [
      'Executive Director, Women\'s Legal Aid Centre (2015-Present)',
      'Program Manager, ActionAid Tanzania (2010-2015)',
      'Community Development Officer, Plan International (2005-2010)'
    ],
    achievements: [
      'Led campaigns resulting in 3 policy changes for women\'s rights',
      'Trained over 500 community paralegals',
      'Winner of the Women in Leadership Award 2021'
    ],
    joinedDate: 'June 2023',
    location: 'Mwanza, Tanzania'
  },
  '4': {
    id: '4',
    name: 'Mr. James Mwenda',
    position: 'Treasurer',
    bio: 'Financial expert with 20 years in development finance and organizational management.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'james.mwenda@lsf.or.tz',
    education: [
      'MBA Finance, Strathmore University',
      'CPA (T), National Board of Accountants and Auditors',
      'BSc Accounting and Finance, University of Dar es Salaam'
    ],
    experience: [
      'Chief Financial Officer, Tanzania Development Bank (2018-Present)',
      'Finance Director, Oxfam Tanzania (2012-2018)',
      'Senior Accountant, World Vision Tanzania (2008-2012)'
    ],
    achievements: [
      'Managed over $100M in development funds',
      'Implemented financial systems for 50+ NGOs',
      'Certified Public Accountant and Auditor'
    ],
    joinedDate: 'September 2023',
    location: 'Dodoma, Tanzania'
  }
};

const BoardDetail = () => {
  const { boardId } = useParams();
  const member = boardId ? boardMembers[boardId] : null;

  if (!member) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Board Member Not Found</h1>
            <Link to="/about">
              <Button>Back to About</Button>
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
        icon={<Award className="h-8 w-8" />}
        badge="Board Member"
        title={member.name}
        description={member.position}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/about" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to About
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-2 space-y-12">
                {/* Biography */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Biography</h2>
                  <p className="text-lg text-neutral-gray leading-relaxed">{member.bio}</p>
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

export default BoardDetail;
