
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Detailed opportunity data
const opportunities = {
  '1': {
    id: '1',
    title: 'Community Paralegal Coordinator',
    type: 'Full-time',
    location: 'Dar es Salaam',
    duration: '2 years',
    salary: 'Competitive package',
    deadline: '2024-07-15',
    description: 'Lead and coordinate our community paralegal program across multiple districts, providing training and support to grassroots legal aid providers. This role involves strategic planning, capacity building, and direct community engagement.',
    responsibilities: [
      'Develop and implement community paralegal training programs',
      'Coordinate with district-level legal aid providers',
      'Monitor and evaluate program effectiveness',
      'Provide technical support to community paralegals',
      'Facilitate partnerships with local organizations',
      'Prepare reports and documentation for stakeholders'
    ],
    requirements: [
      'Law degree or equivalent qualification',
      '3+ years experience in legal aid or community development',
      'Fluency in Swahili and English',
      'Strong community engagement and leadership skills',
      'Experience in training and capacity building',
      'Excellent communication and report writing skills'
    ],
    benefits: [
      'Competitive salary and benefits package',
      'Professional development opportunities',
      'Health insurance coverage',
      'Transportation allowance',
      'Annual leave and sick leave',
      'Opportunity to make a meaningful impact'
    ],
    category: 'Employment',
    department: 'Programs'
  },
  '2': {
    id: '2',
    title: 'Legal Research Intern',
    type: 'Internship',
    location: 'Remote/Hybrid',
    duration: '6 months',
    salary: 'Stipend provided',
    deadline: '2024-06-30',
    description: 'Support our policy research initiatives by conducting legal research, analyzing legislation, and contributing to publications on access to justice. This internship provides excellent exposure to legal research methodologies.',
    responsibilities: [
      'Conduct legal research on access to justice issues',
      'Analyze legislation and policy documents',
      'Assist in preparing research reports and publications',
      'Support advocacy and policy initiatives',
      'Participate in research meetings and workshops',
      'Maintain research databases and documentation'
    ],
    requirements: [
      'Law student (final year) or recent graduate',
      'Strong research and analytical skills',
      'Excellent writing and communication abilities',
      'Interest in human rights and access to justice',
      'Computer literacy and research database skills',
      'Self-motivated and detail-oriented'
    ],
    benefits: [
      'Monthly stipend',
      'Mentorship from senior legal professionals',
      'Certificate of completion',
      'Networking opportunities',
      'Skills development in legal research',
      'Potential for future employment opportunities'
    ],
    category: 'Internship',
    department: 'Research & Policy'
  },
  '3': {
    id: '3',
    title: 'Volunteer Legal Clinic Assistant',
    type: 'Volunteer',
    location: 'Multiple locations',
    duration: 'Flexible',
    salary: 'Volunteer position',
    deadline: 'Ongoing',
    description: 'Assist in our mobile legal clinics, helping community members access legal information and connect with appropriate legal services. This volunteer role provides hands-on experience in community legal aid.',
    responsibilities: [
      'Assist in mobile legal clinic operations',
      'Help community members complete legal forms',
      'Provide basic legal information and guidance',
      'Connect clients with appropriate legal services',
      'Support clinic logistics and administration',
      'Maintain client records and documentation'
    ],
    requirements: [
      'Interest in community service and legal aid',
      'Basic legal knowledge preferred but not required',
      'Weekend availability for clinic operations',
      'Own transportation or ability to travel',
      'Good communication skills',
      'Commitment to confidentiality and ethics'
    ],
    benefits: [
      'Valuable hands-on legal experience',
      'Community service certificate',
      'Training in legal aid provision',
      'Networking with legal professionals',
      'Transportation reimbursement',
      'Opportunity to make a direct impact'
    ],
    category: 'Volunteer',
    department: 'Community Outreach'
  },
  '4': {
    id: '4',
    title: 'Digital Innovation Fellow',
    type: 'Fellowship',
    location: 'Dar es Salaam',
    duration: '1 year',
    salary: 'Fellowship stipend',
    deadline: '2024-08-01',
    description: 'Develop and implement digital solutions to improve access to legal services, including mobile apps and online platforms. This fellowship focuses on leveraging technology for justice delivery.',
    responsibilities: [
      'Design and develop digital legal aid platforms',
      'Create mobile applications for legal service delivery',
      'Implement online legal information systems',
      'Collaborate with legal and technical teams',
      'Test and refine digital solutions',
      'Train staff on new technologies'
    ],
    requirements: [
      'Computer science, IT, or related field degree',
      'Mobile app development experience (Android/iOS)',
      'Web development skills (HTML, CSS, JavaScript)',
      'Understanding of legal technology trends',
      'Innovation mindset and problem-solving skills',
      'Portfolio of previous tech projects'
    ],
    benefits: [
      'Annual fellowship stipend',
      'Access to cutting-edge technology',
      'Mentorship from tech and legal experts',
      'Conference and training opportunities',
      'Portfolio development support',
      'Potential for permanent placement'
    ],
    category: 'Fellowship',
    department: 'Innovation & Technology'
  }
};

const OpportunityDetail = () => {
  const { opportunityId } = useParams();
  const opportunity = opportunities[opportunityId as keyof typeof opportunities];

  if (!opportunity) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunity Not Found</h1>
          <Link to="/opportunities">
            <Button>Back to Opportunities</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge={opportunity.category}
        title={opportunity.title}
        description={`Join our ${opportunity.department} team and make a meaningful impact on access to justice in Tanzania.`}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link to="/opportunities" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Opportunities
          </Link>

          {/* Opportunity Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                  opportunity.category === 'Internship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                  opportunity.category === 'Volunteer' ? 'bg-secondary-orange/10 text-secondary-orange' :
                  'bg-neutral-dark/10 text-neutral-dark'
                }`}>
                  {opportunity.category}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-gray">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  {opportunity.duration}
                </div>
                <div className="flex items-center">
                  <Briefcase size={14} className="mr-2" />
                  {opportunity.type}
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray leading-relaxed">{opportunity.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-primary mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-secondary-teal mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Compensation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-secondary-orange mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Department</h4>
                    <p className="text-neutral-gray">{opportunity.department}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Compensation</h4>
                    <p className="text-neutral-gray">{opportunity.salary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Application Deadline</h4>
                    <p className="text-neutral-gray">{new Date(opportunity.deadline).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Now */}
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-gray mb-4">
                    Send your CV and cover letter to join our mission of advancing access to justice.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                    Apply Now
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Ask Questions
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Need More Information?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-gray text-sm">
                    Contact our HR team for additional details about this position.
                  </p>
                  <Link to="/contact" className="text-primary text-sm hover:underline">
                    Get in touch →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpportunityDetail;
