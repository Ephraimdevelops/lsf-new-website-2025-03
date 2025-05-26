
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowRight, Award, Users, Globe, Landmark, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import AnimatedStats from '../components/about/AnimatedStats';
import TestimonialCarousel from '../components/about/TestimonialCarousel';
import ImpactHighlight from '../components/home/ImpactHighlight';

interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
}

const boardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Hon. Justice Mary Kimani',
    position: 'Board Chairperson',
    bio: 'Former High Court Judge with 25 years of experience in the judiciary and a strong advocate for access to justice.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Prof. David Mwalimu',
    position: 'Vice Chairperson',
    bio: 'Law Professor at University of Dar es Salaam, specializing in human rights law and legal empowerment.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Ms. Sarah Ndugu',
    position: 'Secretary',
    bio: 'Civil society leader with extensive experience in community development and women\'s rights advocacy.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    name: 'Mr. James Mwenda',
    position: 'Treasurer',
    bio: 'Financial expert with 20 years in development finance and organizational management.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Info className="h-8 w-8" />}
        badge="Who We Are"
        title="About LSF"
        description="Learn about our mission to increase access to justice for all, in particular for women, through a legal empowerment approach across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

       {/* Interactive Timeline */}
      <InteractiveTimeline />

      {/* Board Members Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Board of Directors
            </h2>
            <p className="text-lg text-neutral-dark">
              Our board provides strategic oversight and governance, ensuring LSF remains accountable to our mission and stakeholders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.position}</p>
                    <p className="text-neutral-gray text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
       <ImpactHighlight />

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Vision & Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-neutral-dark">
                A society that is just, equal, accountable and respects the dignity and rights of all people, particularly women.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary-teal"></div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-neutral-dark">
                To provide financial and technical support to civil society organizations in Tanzania towards increasing access to justice for all, in particular for women through legal empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Principles That Guide Our Work
            </h2>
            <p className="text-lg text-neutral-dark">
              At LSF, our work is guided by a set of core values that define our approach to increasing access to justice for all Tanzanians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-neutral-dark">
                We are committed to the highest standards of honesty, transparency, and ethical behavior in all our work.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-teal/10 p-3 rounded-full inline-flex mb-4">
                <Users className="h-6 w-6 text-secondary-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusion</h3>
              <p className="text-neutral-dark">
                We believe in equal rights and opportunities for all, particularly focusing on marginalized groups and women.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-orange/10 p-3 rounded-full inline-flex mb-4">
                <Landmark className="h-6 w-6 text-secondary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accountability</h3>
              <p className="text-neutral-dark">
                We take responsibility for our actions and decisions, and maintain transparent processes in all our operations.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-yellow/10 p-3 rounded-full inline-flex mb-4">
                <Globe className="h-6 w-6 text-secondary-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-neutral-dark">
                We embrace creative approaches and innovative solutions to overcome barriers to justice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us in Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Together, we can build a more just society where everyone has access to justice. Support our work through donations, partnerships, or by spreading awareness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="secondary" size="lg">Make a Donation</Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
