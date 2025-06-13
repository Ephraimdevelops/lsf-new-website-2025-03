
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, GraduationCap, Heart, ArrowRight, Calendar, Star, Globe, Award, Target, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
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
  status: 'new' | 'close-soon' | 'open' | 'expired';
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
    impact: 'Directly impact 50,000+ community members',
    status: 'close-soon'
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
    impact: 'Reach 100,000+ users through digital platforms',
    status: 'new'
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
    deadline: '2024-06-30',
    status: 'open'
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
    deadline: 'Ongoing',
    status: 'open'
  },
  {
    id: '5',
    title: 'Policy Advocacy Officer',
    type: 'Full-time',
    location: 'Dodoma',
    duration: '3 years',
    description: 'Drive policy reform initiatives by engaging with government stakeholders, conducting policy analysis, and advocating for legislative changes that improve access to justice.',
    requirements: ['Masters in Law or Public Policy', '5+ years advocacy experience', 'Government relations experience', 'Excellent communication skills'],
    category: 'Employment',
    deadline: '2024-08-15',
    impact: 'Influence national policy reforms',
    status: 'new'
  },
  {
    id: '6',
    title: 'Climate Justice Specialist',
    type: 'Contract',
    location: 'Arusha',
    duration: '18 months',
    description: 'Lead our climate justice initiatives by providing legal support to communities affected by environmental issues and advocating for stronger environmental protection laws.',
    requirements: ['Environmental law background', 'Community mobilization skills', 'Climate change expertise', 'Field work experience'],
    category: 'Contract',
    deadline: '2024-07-30',
    impact: 'Support 50+ climate-affected communities',
    status: 'close-soon'
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
  const getStatusBadge = (status: string, deadline: string) => {
    const isDeadlinePassed = new Date(deadline) < new Date() && deadline !== 'Ongoing';
    
    if (isDeadlinePassed) {
      return {
        text: 'Expired',
        className: 'bg-red-500 text-white',
        icon: <AlertTriangle className="h-3 w-3" />
      };
    }
    
    switch (status) {
      case 'new':
        return {
          text: 'New',
          className: 'bg-green-500 text-white',
          icon: <Star className="h-3 w-3" />
        };
      case 'close-soon':
        return {
          text: 'Closing Soon',
          className: 'bg-orange-500 text-white',
          icon: <Clock className="h-3 w-3" />
        };
      case 'open':
        return {
          text: 'Open',
          className: 'bg-blue-500 text-white',
          icon: <CheckCircle className="h-3 w-3" />
        };
      default:
        return {
          text: 'Open',
          className: 'bg-blue-500 text-white',
          icon: <CheckCircle className="h-3 w-3" />
        };
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (deadline === 'Ongoing') return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

      {/* All Opportunities with Uniform Cards */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary mb-4 block">
              CURRENT OPPORTUNITIES
            </Typography>
            <Typography variant="h2" className="mb-6">
              Join Our Team
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Explore all available positions and find the perfect opportunity to contribute to justice in Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {opportunities.map((opportunity) => {
              const statusBadge = getStatusBadge(opportunity.status, opportunity.deadline);
              const daysUntilDeadline = getDaysUntilDeadline(opportunity.deadline);
              const isExpired = opportunity.deadline !== 'Ongoing' && new Date(opportunity.deadline) < new Date();
              
              return (
                <div key={opportunity.id} className="group">
                  <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full transform hover:-translate-y-2 ${isExpired ? 'opacity-75' : ''}`}>
                    {/* Header with Status */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                            opportunity.category === 'Fellowship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                            opportunity.category === 'Internship' ? 'bg-secondary-green/10 text-secondary-green' :
                            opportunity.category === 'Contract' ? 'bg-secondary-yellow/10 text-secondary-yellow' :
                            'bg-secondary-orange/10 text-secondary-orange'
                          }`}>
                            {opportunity.category}
                          </span>
                          {opportunity.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gold text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusBadge.className} gap-1`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      <Typography variant="h3" className={`mb-3 group-hover:text-primary transition-colors ${isExpired ? 'text-gray-500' : ''}`}>
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
                          <Briefcase className="h-4 w-4 mr-1" />
                          {opportunity.type}
                        </div>
                      </div>

                      {/* Deadline Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-neutral-gray">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {opportunity.deadline === 'Ongoing' ? 'Ongoing' : new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                        {daysUntilDeadline !== null && (
                          <span className={`text-xs font-medium ${
                            daysUntilDeadline < 0 ? 'text-red-600' :
                            daysUntilDeadline <= 7 ? 'text-orange-600' :
                            daysUntilDeadline <= 14 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {daysUntilDeadline < 0 ? 'Expired' :
                             daysUntilDeadline === 0 ? 'Due today' :
                             daysUntilDeadline === 1 ? '1 day left' :
                             `${daysUntilDeadline} days left`}
                          </span>
                        )}
                      </div>
                      
                      {opportunity.impact && (
                        <div className="bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-lg text-sm font-medium mt-4">
                          <Globe className="h-4 w-4 inline mr-2" />
                          {opportunity.impact}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
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
                        {opportunity.requirements.length > 3 && (
                          <li className="text-primary text-sm font-medium">
                            +{opportunity.requirements.length - 3} more requirements
                          </li>
                        )}
                      </ul>
                      
                      <div className="flex gap-3">
                        <Link to={`/opportunities/${opportunity.id}`} className="flex-1">
                          <Button 
                            className={`w-full font-bold ${
                              isExpired 
                                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                                : 'bg-primary hover:bg-primary-dark'
                            }`}
                            disabled={isExpired}
                          >
                            {isExpired ? 'Position Expired' : 'View Details'}
                            {!isExpired && <ArrowRight className="ml-2 h-4 w-4" />}
                          </Button>
                        </Link>
                        {!isExpired && (
                          <Button variant="outline" className="px-6 font-bold border-primary text-primary hover:bg-primary hover:text-white">
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Join LSF */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
