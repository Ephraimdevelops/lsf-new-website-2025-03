
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import TestimonialSection from '@/components/shared/TestimonialSection';
import FAQSection from '@/components/shared/FAQSection';
import GetInvolvedCTA from '@/components/what-we-do/GetInvolvedCTA';
import ImpactStatsSection from '@/components/what-we-do/ImpactStatsSection';
import { BookOpen, Users, Target, Award, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Programs = () => {
  const programs = [
    {
      id: 'legal-aid-coordination',
      title: 'Legal Aid Coordination Program',
      description: 'Strengthening the coordination and delivery of legal aid services across Tanzania through strategic partnerships and capacity building.',
      image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&h=400&fit=crop',
      duration: '2020-2025',
      beneficiaries: '500,000+',
      regions: '31 Regions',
      status: 'Active',
      keyActivities: [
        'Training and mentoring legal aid providers',
        'Developing standardized service delivery protocols',
        'Creating referral networks between organizations',
        'Monitoring and evaluation of legal aid services'
      ]
    },
    {
      id: 'paralegal-development',
      title: 'Community Paralegal Development',
      description: 'Building a network of trained community paralegals to provide accessible legal assistance at the grassroots level.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
      duration: '2019-2024',
      beneficiaries: '200,000+',
      regions: '26 Regions',
      status: 'Active',
      keyActivities: [
        'Paralegal training and certification',
        'Community legal education programs',
        'Mobile legal clinics in rural areas',
        'Digital case management systems'
      ]
    },
    {
      id: 'women-rights',
      title: 'Women\'s Legal Rights Initiative',
      description: 'Advancing women\'s access to justice through targeted legal aid, education, and advocacy for gender-responsive legal reforms.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
      duration: '2021-2026',
      beneficiaries: '150,000+',
      regions: '20 Regions',
      status: 'Active',
      keyActivities: [
        'Gender-based violence legal support',
        'Property rights advocacy and education',
        'Women\'s legal literacy programs',
        'Policy advocacy for gender equality'
      ]
    },
    {
      id: 'climate-justice',
      title: 'Climate Justice and Environmental Rights',
      description: 'Supporting communities affected by climate change through legal empowerment and environmental justice advocacy.',
      image: 'https://images.unsplash.com/photo-1569163139394-de44cb40ef4b?w=600&h=400&fit=crop',
      duration: '2022-2027',
      beneficiaries: '75,000+',
      regions: '15 Regions',
      status: 'Active',
      keyActivities: [
        'Environmental rights education',
        'Climate litigation support',
        'Community adaptation planning',
        'Policy advocacy for climate justice'
      ]
    },
    {
      id: 'digital-access',
      title: 'Digital Access to Justice Platform',
      description: 'Leveraging technology to improve access to legal information and services, especially in remote areas.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
      duration: '2023-2028',
      beneficiaries: '1,000,000+',
      regions: 'National',
      status: 'Launching',
      keyActivities: [
        'Online legal information portal',
        'Mobile legal aid applications',
        'Virtual legal consultations',
        'Digital legal literacy programs'
      ]
    },
    {
      id: 'youth-empowerment',
      title: 'Youth Legal Empowerment Program',
      description: 'Empowering young Tanzanians with legal knowledge and skills to advocate for their rights and contribute to justice reforms.',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop',
      duration: '2023-2025',
      beneficiaries: '50,000+',
      regions: '12 Regions',
      status: 'Active',
      keyActivities: [
        'Youth legal education workshops',
        'Peer-to-peer legal mentoring',
        'Youth advocacy training',
        'Student legal clinic programs'
      ]
    }
  ];

  const testimonials = [
    {
      quote: "The Legal Aid Coordination Program has transformed how we deliver services to our communities. The training and support have been invaluable.",
      author: "Maria Mwanga",
      role: "Director",
      organization: "Dodoma Legal Aid Center",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "Through the paralegal program, I've been able to help over 200 families in my community resolve land disputes and access their rights.",
      author: "James Malima",
      role: "Community Paralegal",
      organization: "Mwanza Region",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "The women's rights initiative gave me the knowledge and confidence to start my own business and support other women in my village.",
      author: "Fatuma Said",
      role: "Beneficiary",
      organization: "Coastal Region",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba051ff?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How can my organization apply for program partnerships?",
      answer: "Organizations can apply for partnerships by submitting a detailed proposal through our online portal. We evaluate applications based on alignment with our strategic objectives, organizational capacity, and potential impact on target communities."
    },
    {
      question: "What support do program partners receive?",
      answer: "Partners receive financial support, technical assistance, capacity building training, monitoring and evaluation support, and access to our network of legal aid providers and experts."
    },
    {
      question: "How do you measure program impact?",
      answer: "We use a comprehensive monitoring and evaluation framework that tracks both quantitative metrics (number of beneficiaries, cases resolved) and qualitative indicators (satisfaction levels, capacity improvements, systemic changes)."
    },
    {
      question: "Can individuals benefit directly from these programs?",
      answer: "Yes, individuals can benefit through our partner organizations that provide direct legal aid services, community education programs, and paralegal assistance in their local areas."
    },
    {
      question: "How long do programs typically run?",
      answer: "Our programs typically run for 3-5 years, allowing sufficient time for capacity building, implementation, and sustainable impact. Extensions are possible based on performance and continued need."
    }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <HeroSection
        icon={<BookOpen className="h-8 w-8" />}
        badge="OUR PROGRAMS"
        title="Comprehensive Programs for Legal Empowerment"
        description="Our strategic programs address critical gaps in Tanzania's legal aid landscape, building sustainable systems that ensure every citizen can access justice and claim their rights effectively."
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop"
      />

      {/* Impact Stats */}
      <ImpactStatsSection />

      {/* Programs Overview */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary font-bold mb-4">
              ACTIVE PROGRAMS
            </Typography>
            <Typography variant="h2" className="mb-6">
              Strategic Initiatives Driving Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Each program is designed to address specific challenges in Tanzania's justice system, 
              creating lasting impact through strategic partnerships and community empowerment.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card key={index} variant="elevated" hover className="group overflow-hidden">
                <div className="relative">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    program.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {program.status}
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                    {program.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {program.description}
                  </Typography>
                  
                  {/* Program Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-neutral-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-4 w-4 text-primary mr-1" />
                      </div>
                      <Typography variant="bodySmall" className="font-semibold text-primary">
                        {program.beneficiaries}
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Beneficiaries
                      </Typography>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <MapPin className="h-4 w-4 text-secondary-teal mr-1" />
                      </div>
                      <Typography variant="bodySmall" className="font-semibold text-secondary-teal">
                        {program.regions}
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Coverage
                      </Typography>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Calendar className="h-4 w-4 text-secondary-orange mr-1" />
                      </div>
                      <Typography variant="bodySmall" className="font-semibold text-secondary-orange">
                        {program.duration}
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Duration
                      </Typography>
                    </div>
                  </div>
                  
                  {/* Key Activities */}
                  <div className="mb-6">
                    <Typography variant="h4" className="mb-3">
                      Key Activities
                    </Typography>
                    <ul className="space-y-2">
                      {program.keyActivities.slice(0, 3).map((activity, activityIndex) => (
                        <li key={activityIndex} className="flex items-start text-sm text-neutral-gray">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={`/programs/${program.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Learn More About This Program
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Program Application Process */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              How to Partner With Us
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Our partnership process ensures alignment with strategic objectives and sustainable impact
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Expression of Interest",
                description: "Submit initial proposal outlining your organization's capacity and proposed program approach.",
                icon: <Target className="h-6 w-6" />
              },
              {
                step: "2", 
                title: "Due Diligence Review",
                description: "We conduct comprehensive assessment of organizational capacity and program feasibility.",
                icon: <Users className="h-6 w-6" />
              },
              {
                step: "3",
                title: "Partnership Agreement",
                description: "Formal agreement outlining roles, responsibilities, and performance indicators.",
                icon: <BookOpen className="h-6 w-6" />
              },
              {
                step: "4",
                title: "Implementation & Support",
                description: "Ongoing technical assistance, monitoring, and capacity building throughout program duration.",
                icon: <Award className="h-6 w-6" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {item.icon}
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <Typography variant="h4" className="mb-3">
                  {item.title}
                </Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  {item.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <TestimonialSection
        title="Voices from Our Programs"
        subtitle="Hear from partners and beneficiaries about the impact of our program initiatives"
        testimonials={testimonials}
      />

      {/* FAQ Section */}
      <FAQSection
        title="Program Partnership Questions"
        subtitle="Common questions about our programs and partnership opportunities"
        faqs={faqs}
      />

      {/* Call to Action */}
      <GetInvolvedCTA />
    </Layout>
  );
};

export default Programs;
