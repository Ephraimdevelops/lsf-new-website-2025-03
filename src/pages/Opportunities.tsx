
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  type: string;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  category: string;
  deadline: string;
}

const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Community Paralegal Coordinator',
    type: 'Full-time',
    location: 'Dar es Salaam',
    duration: '2 years',
    description: 'Lead and coordinate our community paralegal program across multiple districts, providing training and support to grassroots legal aid providers.',
    requirements: ['Law degree or equivalent', '3+ years experience in legal aid', 'Swahili and English fluency', 'Strong community engagement skills'],
    category: 'Employment',
    deadline: '2024-07-15'
  },
  {
    id: '2',
    title: 'Legal Research Intern',
    type: 'Internship',
    location: 'Remote/Hybrid',
    duration: '6 months',
    description: 'Support our policy research initiatives by conducting legal research, analyzing legislation, and contributing to publications on access to justice.',
    requirements: ['Law student (final year) or recent graduate', 'Research and writing skills', 'Interest in human rights law', 'Computer literacy'],
    category: 'Internship',
    deadline: '2024-06-30'
  },
  {
    id: '3',
    title: 'Volunteer Legal Clinic Assistant',
    type: 'Volunteer',
    location: 'Multiple locations',
    duration: 'Flexible',
    description: 'Assist in our mobile legal clinics, helping community members access legal information and connect with appropriate legal services.',
    requirements: ['Interest in community service', 'Basic legal knowledge preferred', 'Weekend availability', 'Transportation'],
    category: 'Volunteer',
    deadline: 'Ongoing'
  },
  {
    id: '4',
    title: 'Digital Innovation Fellow',
    type: 'Fellowship',
    location: 'Dar es Salaam',
    duration: '1 year',
    description: 'Develop and implement digital solutions to improve access to legal services, including mobile apps and online platforms.',
    requirements: ['Computer science or related field', 'Mobile app development experience', 'Understanding of legal tech', 'Innovation mindset'],
    category: 'Fellowship',
    deadline: '2024-08-01'
  }
];

const categories = ['All', 'Employment', 'Internship', 'Volunteer', 'Fellowship'];

const Opportunities = () => {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge="Join Our Mission"
        title="Career Opportunities"
        description="Be part of a team that's transforming access to justice across Tanzania. Discover meaningful career opportunities that make a real difference."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Opportunities Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20 h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                        opportunity.category === 'Internship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                        opportunity.category === 'Volunteer' ? 'bg-secondary-orange/10 text-secondary-orange' :
                        'bg-neutral-dark/10 text-neutral-dark'
                      }`}>
                        {opportunity.category}
                      </span>
                      <span className="text-sm text-neutral-gray">
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark group-hover:text-primary transition-colors duration-300">
                      {opportunity.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-gray">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {opportunity.duration}
                      </div>
                      <div className="flex items-center">
                        <Briefcase size={14} className="mr-1" />
                        {opportunity.type}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-neutral-gray mb-4 leading-relaxed">
                      {opportunity.description}
                    </p>
                    
                    <h4 className="font-semibold text-neutral-dark mb-2">Key Requirements:</h4>
                    <ul className="text-sm text-neutral-gray space-y-1 mb-6">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full bg-primary hover:bg-primary-dark">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Join Us */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Join LSF?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Meaningful Impact</h3>
                <p className="text-neutral-gray">
                  Work directly with communities to create lasting change and advance access to justice across Tanzania.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-secondary-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3">Professional Growth</h3>
                <p className="text-neutral-gray">
                  Develop your skills through training programs, mentorship, and exposure to diverse legal challenges.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3">Collaborative Team</h3>
                <p className="text-neutral-gray">
                  Join a diverse, passionate team committed to justice, equality, and community empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary-teal">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl opacity-90 mb-8">
              Don't see the right opportunity? We're always interested in hearing from passionate individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Send Us Your CV
              </Button>
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Opportunities;
