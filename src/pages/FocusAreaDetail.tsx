
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowLeft, Scale, Users, Gavel, Building, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Focus Area Not Found</h1>
            <Link to="/">
              <Button>Back to Home</Button>
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
        icon={focusArea.icon}
        badge="Strategic Focus Area"
        title={focusArea.title}
        description={focusArea.description}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Objectives */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark flex items-center">
                    <Target className="h-8 w-8 text-primary mr-3" />
                    Key Objectives
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {focusArea.objectives.map((objective, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                          <p className="text-neutral-gray">{objective}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Activities */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Key Activities</h2>
                  <div className="space-y-4">
                    {focusArea.keyActivities.map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray text-lg">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcomes */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Expected Outcomes</h2>
                  <div className="space-y-4">
                    {focusArea.expectedOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-teal rounded-full mt-3 mr-4 flex-shrink-0"></div>
                        <p className="text-neutral-gray text-lg">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Stories */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-neutral-dark">Success Stories</h2>
                  <div className="space-y-6">
                    {focusArea.successStories.map((story, index) => (
                      <div key={index} className="bg-gradient-to-r from-primary/5 to-secondary-teal/5 p-6 rounded-xl border-l-4 border-primary">
                        <h3 className="text-xl font-semibold mb-3 text-neutral-dark">{story.title}</h3>
                        <p className="text-neutral-gray">{story.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Target Beneficiaries */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-neutral-dark">Target Beneficiaries</h3>
                    <div className="space-y-3">
                      {focusArea.targetBeneficiaries.map((beneficiary, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <p className="text-sm text-neutral-gray">{beneficiary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-neutral-dark">Key Challenges</h3>
                    <div className="space-y-3">
                      {focusArea.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-secondary-orange rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <p className="text-sm text-neutral-gray">{challenge}</p>
                        </div>
                      ))}
                    </div>
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

export default FocusAreaDetail;
