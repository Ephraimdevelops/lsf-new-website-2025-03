import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Scale, Users, Gavel, Building, Target, CheckCircle, Sparkles, TrendingUp, Award, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

interface FocusArea {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  objectives: string[];
  keyActivities: string[];
  targetBeneficiaries: string[];
  expectedOutcomes: string[];
  challenges: string[];
  successStories: { title: string; description: string }[];
}

const focusAreas: { [key: string]: FocusArea } = {
  'accessible-legal-aid': {
    id: 'accessible-legal-aid',
    title: 'Increasing Accessibility to Quality Legal Aid Services',
    description: 'Prioritizing the provision of accessible, affordable, and quality legal aid services to marginalized populations, with a strong emphasis on women and girls.',
    icon: <Scale className="h-8 w-8" />,
    objectives: [
      'Expand geographic coverage of legal aid services to underserved areas',
      'Improve quality and standardization of legal aid delivery',
      'Reduce barriers to accessing legal services for marginalized communities',
      'Strengthen capacity of legal aid providers across Tanzania'
    ],
    keyActivities: [
      'Mobile legal clinics reaching remote communities',
      'Training and certification of community paralegals',
      'Technology-enabled legal service delivery',
      'Partnerships with local organizations for service expansion'
    ],
    targetBeneficiaries: [
      'Women and girls facing legal challenges',
      'Rural communities with limited access to justice',
      'People living in poverty',
      'Persons with disabilities',
      'Youth and elderly populations'
    ],
    expectedOutcomes: [
      'Increased number of people accessing quality legal aid',
      'Reduced geographic and economic barriers to justice',
      'Improved legal literacy in target communities',
      'Strengthened network of legal aid providers'
    ],
    challenges: [
      'Limited resources for service expansion',
      'Geographic barriers in rural areas',
      'Cultural and language barriers',
      'Lack of awareness about available services'
    ],
    successStories: [
      {
        title: 'Mobile Legal Clinic Impact',
        description: 'Our mobile legal clinics have reached over 15,000 people in remote areas, providing crucial legal services where none existed before.'
      },
      {
        title: 'Paralegal Network Growth',
        description: 'We have trained and certified over 500 community paralegals who now serve as the first point of contact for legal issues in their communities.'
      }
    ]
  },
  'empowered-communities': {
    id: 'empowered-communities',
    title: 'Promoting Legally Empowered Communities',
    description: 'Advancing community legal empowerment—particularly for women, girls, and other marginalized groups—through legal education, awareness, and strengthening paralegal networks.',
    icon: <Users className="h-8 w-8" />,
    objectives: [
      'Increase legal literacy and awareness in communities',
      'Strengthen community-based legal empowerment structures',
      'Promote women\'s legal rights and gender equality',
      'Build sustainable legal empowerment initiatives'
    ],
    keyActivities: [
      'Community legal education programs',
      'Women\'s legal rights workshops',
      'Paralegal training and mentorship',
      'Community dialogue sessions on legal issues'
    ],
    targetBeneficiaries: [
      'Women and girls in rural and urban areas',
      'Community leaders and influencers',
      'Youth groups and organizations',
      'Religious and traditional leaders'
    ],
    expectedOutcomes: [
      'Increased legal knowledge in target communities',
      'Stronger community-based legal support systems',
      'Improved gender equality and women\'s rights',
      'Reduced legal disputes through community mediation'
    ],
    challenges: [
      'Traditional practices conflicting with legal rights',
      'Limited literacy levels in some communities',
      'Resistance to change in patriarchal structures',
      'Sustainability of community initiatives'
    ],
    successStories: [
      {
        title: 'Women\'s Legal Rights Campaign',
        description: 'Our community education programs have empowered over 10,000 women with knowledge of their legal rights, leading to increased reporting of violations.'
      },
      {
        title: 'Community Mediation Success',
        description: 'Trained community mediators have successfully resolved 85% of local disputes without formal court proceedings.'
      }
    ]
  },
  'conducive-environment': {
    id: 'conducive-environment',
    title: 'Enhancing a Conducive Environment for Sustainable Access to Justice',
    description: 'Supporting policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice.',
    icon: <Gavel className="h-8 w-8" />,
    objectives: [
      'Advocate for progressive legal and policy reforms',
      'Strengthen institutional frameworks for access to justice',
      'Promote coordination among justice sector stakeholders',
      'Monitor and evaluate justice sector performance'
    ],
    keyActivities: [
      'Policy research and analysis',
      'Stakeholder engagement and coalition building',
      'Legislative advocacy and lobbying',
      'Justice sector monitoring and evaluation'
    ],
    targetBeneficiaries: [
      'Civil society organizations',
      'Government institutions',
      'Legal professionals and practitioners',
      'Development partners and donors'
    ],
    expectedOutcomes: [
      'Improved legal and policy frameworks',
      'Stronger coordination in the justice sector',
      'Increased government commitment to access to justice',
      'Enhanced accountability in justice delivery'
    ],
    challenges: [
      'Political resistance to reforms',
      'Limited resources for advocacy efforts',
      'Competing priorities in government agenda',
      'Coordination challenges among stakeholders'
    ],
    successStories: [
      {
        title: 'Legal Aid Act Achievement',
        description: 'Our advocacy efforts led to the enactment of the Legal Aid Act, establishing a national framework for legal aid provision in Tanzania.'
      },
      {
        title: 'Mama Samia Campaign',
        description: 'The nationwide Mama Samia Legal Aid Campaign has increased awareness and operationalized legal aid services across all regions.'
      }
    ]
  },
  'institutional-development': {
    id: 'institutional-development',
    title: 'Institutional Development and Sustainability',
    description: 'Strengthening the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.',
    icon: <Building className="h-8 w-8" />,
    objectives: [
      'Strengthen organizational capacity and systems',
      'Diversify funding sources and ensure sustainability',
      'Improve operational efficiency and effectiveness',
      'Build sector-wide capacity for legal aid delivery'
    ],
    keyActivities: [
      'Organizational development and capacity building',
      'Financial management and resource mobilization',
      'Systems strengthening and digitalization',
      'Sector coordination and networking'
    ],
    targetBeneficiaries: [
      'LSF staff and management',
      'Partner organizations and grantees',
      'Legal aid sector stakeholders',
      'Donor community and investors'
    ],
    expectedOutcomes: [
      'Stronger and more resilient LSF organization',
      'Diversified and sustainable funding base',
      'Improved service delivery efficiency',
      'Enhanced sector coordination and collaboration'
    ],
    challenges: [
      'Donor dependency and funding uncertainties',
      'Limited local fundraising capacity',
      'Capacity gaps in partner organizations',
      'Competition for limited resources'
    ],
    successStories: [
      {
        title: 'Digital Transformation',
        description: 'We have successfully digitized our operations, improving efficiency and expanding our reach through technology platforms.'
      },
      {
        title: 'Financial Sustainability',
        description: 'Our diversified funding strategy has secured multi-year commitments from various donors, ensuring program continuity.'
      }
    ]
  }
};

const FocusAreaDetail = () => {
  const { focusAreaId } = useParams();
  const focusArea = focusAreaId ? focusAreas[focusAreaId] : null;

  if (!focusArea) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-black">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-8">Focus Area Not Found</h1>
            <Link to="/">
              <Button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <div className="text-secondary-orange">
                {focusArea.icon}
              </div>
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Strategic Focus Area
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-4xl md:text-6xl font-bold">
              {focusArea.title}
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              {focusArea.description}
            </Typography>
            
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-16 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Focus Areas
            </Link>
          </div>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-primary-dark text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-60 h-60 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Objectives */}
              <div>
                <div className="inline-flex items-center bg-secondary-teal/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-secondary-teal/30">
                  <Target className="h-6 w-6 mr-4 text-secondary-teal" />
                  <Typography variant="overline" className="text-secondary-teal font-bold text-lg">
                    KEY OBJECTIVES
                  </Typography>
                </div>
                
                <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold text-white">
                  Our Strategic Goals
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {focusArea.objectives.map((objective, index) => (
                    <div key={index} className="group">
                      <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 h-full relative overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary-teal/20 to-secondary-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-secondary-teal/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="h-6 w-6 text-secondary-teal" />
                          </div>
                          <Typography variant="body" className="text-white/90 leading-relaxed">
                            {objective}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Activities */}
              <div>
                <div className="inline-flex items-center bg-secondary-orange/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-secondary-orange/30">
                  <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
                  <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                    KEY ACTIVITIES
                  </Typography>
                </div>
                
                <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold text-white">
                  How We Execute
                </Typography>
                
                <div className="space-y-6">
                  {focusArea.keyActivities.map((activity, index) => (
                    <div key={index} className="group flex items-start bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary-orange to-secondary-teal rounded-full flex items-center justify-center mt-1 mr-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <Typography variant="body" className="text-white/90 text-lg leading-relaxed">
                        {activity}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <div className="inline-flex items-center bg-secondary-yellow/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-secondary-yellow/30">
                  <Award className="h-6 w-6 mr-4 text-secondary-yellow" />
                  <Typography variant="overline" className="text-secondary-yellow font-bold text-lg">
                    EXPECTED OUTCOMES
                  </Typography>
                </div>
                
                <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold text-white">
                  Measuring Success
                </Typography>
                
                <div className="space-y-6">
                  {focusArea.expectedOutcomes.map((outcome, index) => (
                    <div key={index} className="group flex items-start bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary-yellow to-secondary-teal rounded-full flex items-center justify-center mt-1 mr-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <Typography variant="body" className="text-white/90 text-lg leading-relaxed">
                        {outcome}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Stories */}
              <div>
                <div className="inline-flex items-center bg-primary/30 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/40">
                  <Sparkles className="h-6 w-6 mr-4 text-white" />
                  <Typography variant="overline" className="text-white font-bold text-lg">
                    SUCCESS STORIES
                  </Typography>
                </div>
                
                <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold text-white">
                  Real Impact Stories
                </Typography>
                
                <div className="space-y-8">
                  {focusArea.successStories.map((story, index) => (
                    <div key={index} className="group">
                      <div className="bg-gradient-to-r from-primary/20 to-secondary-teal/20 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:from-primary/30 hover:to-secondary-teal/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-secondary-orange/20 to-secondary-teal/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                          <Typography variant="h3" className="text-2xl font-bold mb-4 text-white">
                            {story.title}
                          </Typography>
                          <Typography variant="body" className="text-white/90 leading-relaxed">
                            {story.description}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Target Beneficiaries */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex items-center bg-secondary-teal/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-secondary-teal/30">
                    <Users className="h-5 w-5 mr-3 text-secondary-teal" />
                    <Typography variant="overline" className="text-secondary-teal font-bold">
                      TARGET BENEFICIARIES
                    </Typography>
                  </div>
                  
                  <div className="space-y-4">
                    {focusArea.targetBeneficiaries.map((beneficiary, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-2 h-2 bg-secondary-teal rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                        <Typography variant="bodySmall" className="text-white/90 leading-relaxed">
                          {beneficiary}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex items-center bg-secondary-orange/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-secondary-orange/30">
                    <Globe className="h-5 w-5 mr-3 text-secondary-orange" />
                    <Typography variant="overline" className="text-secondary-orange font-bold">
                      KEY CHALLENGES
                    </Typography>
                  </div>
                  
                  <div className="space-y-4">
                    {focusArea.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="w-2 h-2 bg-secondary-orange rounded-full mt-3 mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                        <Typography variant="bodySmall" className="text-white/90 leading-relaxed">
                          {challenge}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-br from-secondary-teal/20 to-secondary-orange/20 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center hover:-translate-y-2 transition-all duration-300">
                  <Heart className="h-16 w-16 text-secondary-orange mx-auto mb-6" />
                  <Typography variant="h3" className="text-white mb-4">
                    Join This Mission
                  </Typography>
                  <Typography variant="body" className="text-white/90 mb-6">
                    Be part of the change in this focus area
                  </Typography>
                  <Button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-8 py-3 rounded-full">
                    Get Involved
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default FocusAreaDetail;
