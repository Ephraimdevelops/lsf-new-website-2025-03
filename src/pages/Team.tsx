
import Layout from '../components/layout/Layout';
import { Facebook, Linkedin, Mail, Twitter } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks?: {
    email?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

const TeamMember = ({ name, role, bio, imageUrl, socialLinks }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg">
      <div className="h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-primary font-medium mb-4">{role}</p>
        <p className="text-neutral-gray mb-4 text-sm">{bio}</p>
        
        {socialLinks && (
          <div className="flex space-x-3">
            {socialLinks.email && (
              <a href={`mailto:${socialLinks.email}`} className="text-gray-500 hover:text-primary transition-colors" aria-label={`Email ${name}`}>
                <Mail size={18} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors" aria-label={`${name}'s LinkedIn`}>
                <Linkedin size={18} />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors" aria-label={`${name}'s Twitter`}>
                <Twitter size={18} />
              </a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors" aria-label={`${name}'s Facebook`}>
                <Facebook size={18} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Team = () => {
  // Leadership team data
  const leadershipTeam: TeamMemberProps[] = [
    {
      name: "Dr. Amina Karume",
      role: "Chief Executive Officer",
      bio: "Dr. Karume has over 20 years of experience in human rights law and access to justice programming across East Africa. She leads LSF's strategic direction and oversees all operations.",
      imageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "akarume@lsftz.org",
        linkedin: "https://linkedin.com/",
      }
    },
    {
      name: "John Mbwambo",
      role: "Director of Programs",
      bio: "John oversees LSF's program implementation, monitoring, and evaluation. He has extensive experience in legal empowerment and gender justice programming.",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "jmbwambo@lsftz.org",
        linkedin: "https://linkedin.com/",
        twitter: "https://twitter.com/"
      }
    },
    {
      name: "Grace Nyagawa",
      role: "Director of Finance",
      bio: "Grace leads LSF's financial management and ensures compliance with donor requirements and regulations. She has over 15 years of experience in financial management in the non-profit sector.",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "gnyagawa@lsftz.org",
        linkedin: "https://linkedin.com/"
      }
    },
    {
      name: "David Makala",
      role: "Director of Climate Justice",
      bio: "David leads LSF's Climate Justice program, bringing expertise in environmental law and community-based adaptation strategies. He previously worked with international environmental organizations.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "dmakala@lsftz.org",
        linkedin: "https://linkedin.com/",
        twitter: "https://twitter.com/"
      }
    }
  ];

  // Program team data
  const programTeam: TeamMemberProps[] = [
    {
      name: "Maria Joseph",
      role: "Gender Justice Program Manager",
      bio: "Maria leads LSF's Gender Justice program, focusing on advancing women's rights and addressing gender-based violence across Tanzania.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "mjoseph@lsftz.org"
      }
    },
    {
      name: "Joseph Baraka",
      role: "Legal Empowerment Program Manager",
      bio: "Joseph coordinates LSF's legal aid network and oversees capacity building for paralegals and legal aid organizations throughout Tanzania.",
      imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "jbaraka@lsftz.org"
      }
    },
    {
      name: "Fatma Ibrahim",
      role: "Digital Transformation Lead",
      bio: "Fatma leads LSF's Digital Transformation program, developing innovative tech solutions to improve access to justice in remote communities.",
      imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "fibrahim@lsftz.org",
        linkedin: "https://linkedin.com/",
        twitter: "https://twitter.com/"
      }
    },
    {
      name: "Peter Mwanza",
      role: "Monitoring and Evaluation Specialist",
      bio: "Peter oversees the monitoring and evaluation of LSF's programs, ensuring effectiveness and measuring impact across all interventions.",
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "pmwanza@lsftz.org"
      }
    },
    {
      name: "Esther Kimani",
      role: "Communications Manager",
      bio: "Esther leads LSF's communication strategy, managing public relations, digital presence, and knowledge sharing across stakeholder networks.",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "ekimani@lsftz.org",
        twitter: "https://twitter.com/"
      }
    },
    {
      name: "Samuel Mushi",
      role: "Grants Manager",
      bio: "Samuel manages LSF's grant-making processes, working closely with legal aid organizations to strengthen their capacity and reach.",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      socialLinks: {
        email: "smushi@lsftz.org"
      }
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-teal pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
            <p className="text-xl opacity-90">
              Meet the dedicated professionals working to promote access to justice across Tanzania.
            </p>
          </div>
        </div>
      </section>
      
      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              Our leadership team brings decades of combined experience in access to justice, 
              legal empowerment, and development work in Tanzania and beyond.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageUrl={member.imageUrl}
                socialLinks={member.socialLinks}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Program Team */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Program Team</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              Our program team implements LSF's strategic vision, manages partnerships, 
              and ensures that our work creates meaningful impact in communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programTeam.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageUrl={member.imageUrl}
                socialLinks={member.socialLinks}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-neutral-gray mb-8">
              We're always looking for passionate individuals to join our mission of 
              promoting access to justice for all in Tanzania. Check our current openings 
              or submit your resume for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/careers" className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors duration-300">
                Current Openings
              </a>
              <a href="/contact" className="border border-primary text-primary px-8 py-3 rounded-md font-bold hover:bg-primary/10 transition-colors duration-300">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Board of Directors */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Board of Directors</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto mb-8">
            Our Board of Directors provides strategic guidance and oversight to ensure 
            that LSF effectively fulfills its mission and maintains the highest standards 
            of transparency and accountability.
          </p>
          <a href="/board" className="text-primary font-bold hover:underline">
            Learn about our Board of Directors
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
