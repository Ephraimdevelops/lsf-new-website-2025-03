
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, GraduationCap, Heart, ArrowRight, Calendar, Star, Globe, Award, Target, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

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
  featured?: boolean;
  impact?: string;
}

const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Community Paralegal Coordinator',
    type: 'Full-time',
    location: 'Dar es Salaam',
    duration: '2 years',
    description: 'Lead and coordinate our community paralegal program across multiple districts, providing training and support to grassroots legal aid providers who are transforming access to justice.',
    requirements: ['Law degree or equivalent', '3+ years experience in legal aid', 'Swahili and English fluency', 'Strong community engagement skills'],
    category: 'Employment',
    deadline: '2024-07-15',
    featured: true,
    impact: 'Directly impact 50,000+ community members'
  },
  {
    id: '2',
    title: 'Digital Innovation Fellow',
    type: 'Fellowship',
    location: 'Dar es Salaam',
    duration: '1 year',
    description: 'Develop and implement digital solutions to improve access to legal services, including mobile apps and online platforms that bridge the digital divide.',
    requirements: ['Computer science or related field', 'Mobile app development experience', 'Understanding of legal tech', 'Innovation mindset'],
    category: 'Fellowship',
    deadline: '2024-08-01',
    featured: true,
    impact: 'Reach 100,000+ users through digital platforms'
  },
  {
    id: '3',
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
    id: '4',
    title: 'Volunteer Legal Clinic Assistant',
    type: 'Volunteer',
    location: 'Multiple locations',
    duration: 'Flexible',
    description: 'Assist in our mobile legal clinics, helping community members access legal information and connect with appropriate legal services.',
    requirements: ['Interest in community service', 'Basic legal knowledge preferred', 'Weekend availability', 'Transportation'],
    category: 'Volunteer',
    deadline: 'Ongoing'
  }
];

const whyJoinReasons = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Meaningful Impact",
    description: "Work directly with communities to create lasting change and advance access to justice across Tanzania.",
    gradient: "from-primary/10 to-primary/20",
    iconColor: "text-primary"
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Professional Growth",
    description: "Develop your skills through training programs, mentorship, and exposure to diverse legal challenges.",
    gradient: "from-secondary-teal/10 to-secondary-teal/20",
    iconColor: "text-secondary-teal"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Team",
    description: "Join a diverse, passionate team committed to justice, equality, and community empowerment.",
    gradient: "from-secondary-orange/10 to-secondary-orange/20",
    iconColor: "text-secondary-orange"
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Career Development",
    description: "Access continuous learning opportunities and career advancement in the legal aid sector.",
    gradient: "from-secondary-green/10 to-secondary-green/20",
    iconColor: "text-secondary-green"
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Purpose-Driven Work",
    description: "Every day contributes to building a more just and equitable society for all Tanzanians.",
    gradient: "from-secondary-yellow/10 to-secondary-yellow/20",
    iconColor: "text-secondary-yellow"
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation Focus",
    description: "Be part of cutting-edge approaches to legal aid delivery and justice innovation.",
    gradient: "from-primary/10 to-secondary-teal/20",
    iconColor: "text-primary"
  }
];

const Opportunities = () => {
  const featuredOpportunities = opportunities.filter(opp => opp.featured);
  const regularOpportunities = opportunities.filter(opp => !opp.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge="JOIN OUR MISSION"
        title="We need you..."
        description="Be part of a team that's transforming access to justice across Tanzania. Discover meaningful opportunities that create lasting impact in communities nationwide."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Quick Actions */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4">
              View Open Positions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4">
              Submit Your CV
            </Button>
            <div className="text-center">
              <Typography variant="bodySmall" className="text-neutral-gray">
                Have questions? <Link to="/contact" className="text-primary hover:underline font-semibold">Contact us</Link>
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="text-center mb-16">
              <Typography variant="overline" className="text-primary mb-4 block">
                FEATURED OPPORTUNITIES
              </Typography>
              <Typography variant="h2" className="mb-6">
                High-Impact Positions
              </Typography>
              <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
                These roles offer exceptional opportunities to drive meaningful change 
                and advance justice across Tanzania's communities.
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary-teal rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full">
                    {/* Featured Badge */}
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-secondary-orange text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        FEATURED
                      </div>
                    </div>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-8 border-b border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                          opportunity.category === 'Fellowship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                          'bg-secondary-orange/10 text-secondary-orange'
                        }`}>
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                            opportunity.category === 'Fellowship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                            'bg-secondary-orange/10 text-secondary-orange'
                          }`}>
                            {opportunity.category}
                          </span>
                        </div>
                      </div>
                      
                      <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                        {opportunity.title}
                      </Typography>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-gray mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {opportunity.duration}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {opportunity.impact && (
                        <div className="bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-lg text-sm font-medium">
                          <Globe className="h-4 w-4 inline mr-2" />
                          {opportunity.impact}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <Typography variant="bodySmall" className="text-neutral-gray mb-6 leading-relaxed">
                        {opportunity.description}
                      </Typography>
                      
                      <Typography variant="h4" className="mb-4">
                        Key Requirements:
                      </Typography>
                      <ul className="space-y-2 mb-8">
                        {opportunity.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start text-sm text-neutral-gray">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex gap-3">
                        <Link to={`/opportunities/${opportunity.id}`} className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary-dark font-bold">
                            View Details & Apply
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* All Opportunities */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary mb-4 block">
              ALL OPPORTUNITIES
            </Typography>
            <Typography variant="h2" className="mb-6">
              Find Your Role
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Explore all available positions and find the perfect opportunity to contribute to justice in Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {regularOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-primary/20 h-full transform hover:-translate-y-2">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
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
                    
                    <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                      {opportunity.title}
                    </Typography>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-gray">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {opportunity.duration}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {opportunity.type}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Typography variant="bodySmall" className="text-neutral-gray mb-4 leading-relaxed">
                      {opportunity.description}
                    </Typography>
                    
                    <Typography variant="h4" className="mb-3">
                      Key Requirements:
                    </Typography>
                    <ul className="text-sm text-neutral-gray space-y-1 mb-6">
                      {opportunity.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                      {opportunity.requirements.length > 3 && (
                        <li className="text-primary text-sm font-medium">
                          +{opportunity.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                    
                    <div className="flex gap-2">
                      <Link to={`/opportunities/${opportunity.id}`} className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary-dark font-bold">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" className="px-6 font-bold border-primary text-primary hover:bg-primary hover:text-white">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Join LSF */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6">
              Why Join LSF?
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Join a team committed to justice, equality, and community empowerment. Discover what makes working with us unique.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyJoinReasons.map((reason, index) => (
              <div key={index} className="group">
                <div className="text-center h-full">
                  <div className={`w-20 h-20 bg-gradient-to-br ${reason.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={reason.iconColor}>
                      {reason.icon}
                    </div>
                  </div>
                  <Typography variant="h3" className="mb-4">
                    {reason.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                    {reason.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary-teal">
        <Container>
          <div className="text-center text-white">
            <Typography variant="h2" className="text-white mb-6">
              Ready to Make a Difference?
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 max-w-2xl mx-auto">
              Don't see the right opportunity? We're always interested in hearing from passionate individuals who want to contribute to justice in Tanzania.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-4">
                Send Us Your CV
              </Button>
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold px-8 py-4">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Opportunities;
