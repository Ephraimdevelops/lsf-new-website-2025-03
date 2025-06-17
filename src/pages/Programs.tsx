
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import TestimonialSection from '@/components/shared/TestimonialSection';
import PartnershipsSection from '@/components/shared/PartnershipsSection';
import GetInvolvedCTA from '@/components/what-we-do/GetInvolvedCTA';
import { 
  Target, 
  Users, 
  BookOpen, 
  Scale, 
  Heart, 
  Globe, 
  Award,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Programs = () => {
  const programs = [
    {
      id: 1,
      title: "Grant Making Program",
      description: "Supporting legal aid organizations through strategic funding and capacity building to expand access to justice across Tanzania.",
      longDescription: "Our flagship grant-making program provides critical funding to legal aid organizations, community-based organizations, and civil society groups working to advance access to justice.",
      category: "Funding",
      status: "Active",
      duration: "2020-2025",
      budget: "$12M",
      beneficiaries: "180+ organizations",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
      icon: <DollarSign className="h-8 w-8" />,
      color: "from-primary to-primary-dark",
      keyAchievements: [
        "Disbursed $47M+ in grants",
        "Supported 105,562+ community groups", 
        "Reached 426,349+ legal aid beneficiaries",
        "Trained 39.8M+ people through legal education"
      ],
      focusAreas: ["Legal Aid Coordination", "Capacity Building", "Access to Justice", "Community Empowerment"],
      partners: ["USAID", "Ford Foundation", "Open Society Foundation"]
    },
    {
      id: 2,
      title: "Capacity Building Initiative",
      description: "Strengthening the skills and knowledge of legal aid providers and community paralegals through comprehensive training programs.",
      longDescription: "Building sustainable capacity within Tanzania's legal aid sector through training, mentorship, and institutional development programs.",
      category: "Training",
      status: "Active", 
      duration: "2019-2024",
      budget: "$3.5M",
      beneficiaries: "2,500+ paralegals",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
      icon: <Users className="h-8 w-8" />,
      color: "from-secondary-teal to-secondary-teal/80",
      keyAchievements: [
        "Trained 2,500+ community paralegals",
        "Certified 500+ legal aid providers",
        "Established 50+ legal clinics",
        "Developed 20+ training modules"
      ],
      focusAreas: ["Paralegal Training", "Legal Clinic Development", "Quality Standards", "Mentorship"],
      partners: ["Tanzania Law Society", "Institute of Judicial Administration", "Legal Aid Providers"]
    },
    {
      id: 3,
      title: "Gender Justice Program",
      description: "Advancing women's rights through targeted legal empowerment initiatives focusing on property rights and gender-based violence.",
      longDescription: "Promoting gender equality and women's rights through legal empowerment, advocacy, and access to justice initiatives.",
      category: "Rights",
      status: "Active",
      duration: "2018-2025",
      budget: "$5.2M", 
      beneficiaries: "62% women",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      icon: <Heart className="h-8 w-8" />,
      color: "from-secondary-yellow to-secondary-yellow/80",
      keyAchievements: [
        "Resolved 5,600+ GBV cases",
        "Secured 3,200+ property rights",
        "Trained 800+ women advocates",
        "Influenced 8 gender-related policies"
      ],
      focusAreas: ["Women's Property Rights", "GBV Prevention", "Legal Literacy", "Policy Advocacy"],
      partners: ["UN Women", "Tanzania Women Lawyers Association", "Women's Rights Organizations"]
    },
    {
      id: 4,
      title: "Digital Innovation Project",
      description: "Leveraging technology to expand access to legal information and services through the Haki Yangu mobile application and digital platforms.",
      longDescription: "Harnessing digital technology to democratize access to legal information and connect citizens with legal aid services.",
      category: "Technology",
      status: "Active",
      duration: "2021-2024",
      budget: "$2.8M",
      beneficiaries: "50,000+ users",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      icon: <Globe className="h-8 w-8" />,
      color: "from-secondary-orange to-secondary-orange/80",
      keyAchievements: [
        "Launched Haki Yangu app",
        "50,000+ app downloads",
        "15,000+ legal queries resolved",
        "Available in 3 languages"
      ],
      focusAreas: ["Mobile Technology", "Legal Information Access", "Digital Literacy", "Innovation"],
      partners: ["GSMA", "Tech Companies", "Mobile Network Operators"]
    },
    {
      id: 5,
      title: "Policy Advocacy Initiative", 
      description: "Advocating for legal and policy reforms that strengthen access to justice and protect the rights of vulnerable populations.",
      longDescription: "Working with government and stakeholders to create an enabling policy environment for legal empowerment and access to justice.",
      category: "Advocacy",
      status: "Active",
      duration: "2017-2025",
      budget: "$1.9M",
      beneficiaries: "National impact",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      icon: <Scale className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      keyAchievements: [
        "Influenced 12 policy reforms",
        "Established 25+ government partnerships", 
        "Contributed to 5 legislative changes",
        "Published 15+ policy briefs"
      ],
      focusAreas: ["Legal Aid Act", "Justice Sector Reform", "Human Rights", "Legislative Advocacy"],
      partners: ["Ministry of Justice", "Judiciary", "Parliament", "Civil Society"]
    },
    {
      id: 6,
      title: "Research & Learning Program",
      description: "Generating evidence and knowledge to inform policy and practice in the legal empowerment and access to justice sector.",
      longDescription: "Conducting research, documenting best practices, and facilitating learning to strengthen the legal aid ecosystem.",
      category: "Research",
      status: "Active",
      duration: "2016-2025", 
      budget: "$1.5M",
      beneficiaries: "Sector-wide",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      keyAchievements: [
        "Published 25+ research reports",
        "Documented 50+ best practices",
        "Hosted 30+ learning events",
        "Built knowledge management system"
      ],
      focusAreas: ["Impact Assessment", "Best Practices", "Knowledge Management", "Evidence-Based Advocacy"],
      partners: ["Universities", "Research Institutions", "Think Tanks"]
    }
  ];

  const upcomingPrograms = [
    {
      title: "Climate Justice Initiative",
      description: "Addressing legal challenges related to climate change and environmental justice in Tanzania.",
      launchDate: "Q2 2024",
      budget: "$4M",
      image: "https://images.unsplash.com/photo-1569163163395-4d8b29d5be3c?w=400&h=250&fit=crop",
      status: "Planning"
    },
    {
      title: "Youth Legal Empowerment",
      description: "Engaging young people as agents of change in promoting access to justice in their communities.",
      launchDate: "Q3 2024", 
      budget: "$2.5M",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=250&fit=crop",
      status: "Development"
    }
  ];

  const testimonials = [
    {
      quote: "The Grant Making Program transformed our organization's capacity to serve vulnerable communities. We've increased our client base by 400% and expanded to three new regions.",
      author: "Sarah Mwalimu",
      role: "Executive Director",
      organization: "Coastal Legal Aid Network",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "Through the Capacity Building Initiative, I gained the skills to become a certified paralegal. I've now helped resolve over 200 cases in my community.",
      author: "James Kimaro",
      role: "Community Paralegal",
      organization: "Moshi Legal Clinic",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "The Digital Innovation Project brought legal services to my doorstep. Through the Haki Yangu app, I was able to understand my rights and get the help I needed.",
      author: "Fatuma Hassan",
      role: "App User",
      organization: "Dar es Salaam",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba051ff?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    }
  ];

  const partnerData = [
    { name: "USAID", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", description: "Primary funding partner", category: "international" },
    { name: "Ford Foundation", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", description: "Strategic partner", category: "international" },
    { name: "Tanzania Law Society", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", description: "Professional body", category: "civil-society" },
    { name: "Ministry of Justice", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop", description: "Government partner", category: "government" }
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
        icon={<Target className="h-8 w-8" />}
        badge="OUR PROGRAMS"
        title="Comprehensive Programs for Legal Empowerment"
        description="Our diverse portfolio of programs addresses every aspect of legal empowerment, from direct service delivery to policy advocacy, ensuring sustainable impact across Tanzania's justice landscape."
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop"
      />

      {/* Program Overview Stats */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Programs at a Glance
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Six comprehensive programs working together to transform Tanzania's legal aid landscape
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="elevated" hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <Typography variant="h3" className="text-primary mb-2">6</Typography>
              <Typography variant="h4" className="mb-2">Active Programs</Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Comprehensive coverage
              </Typography>
            </Card>

            <Card variant="elevated" hover className="text-center">
              <div className="w-16 h-16 bg-secondary-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-secondary-orange" />
              </div>
              <Typography variant="h3" className="text-secondary-orange mb-2">$27M+</Typography>
              <Typography variant="h4" className="mb-2">Total Investment</Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Program budgets
              </Typography>
            </Card>

            <Card variant="elevated" hover className="text-center">
              <div className="w-16 h-16 bg-secondary-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary-teal" />
              </div>
              <Typography variant="h3" className="text-secondary-teal mb-2">500K+</Typography>
              <Typography variant="h4" className="mb-2">Direct Beneficiaries</Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Lives impacted
              </Typography>
            </Card>

            <Card variant="elevated" hover className="text-center">
              <div className="w-16 h-16 bg-secondary-yellow/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-secondary-yellow" />
              </div>
              <Typography variant="h3" className="text-secondary-yellow mb-2">184</Typography>
              <Typography variant="h4" className="mb-2">Districts Covered</Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Nationwide reach
              </Typography>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Detailed Program Showcase */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <BookOpen className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                ACTIVE PROGRAMS
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Our Comprehensive Program Portfolio
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Each program is designed to address specific challenges in Tanzania's justice system, 
              working together to create a comprehensive ecosystem of legal empowerment.
            </Typography>
          </div>

          <div className="space-y-16">
            {programs.map((program, index) => (
              <div key={program.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Card variant="elevated" hover className="overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-80`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                          <div className="text-white">
                            {program.icon}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {program.category}
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {program.status}
                      </div>
                    </div>
                  </Card>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="space-y-6">
                    <div>
                      <Typography variant="h3" className="mb-4 group-hover:text-primary transition-colors">
                        {program.title}
                      </Typography>
                      <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                        {program.longDescription}
                      </Typography>
                    </div>

                    {/* Program Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-primary mr-2" />
                          <Typography variant="bodySmall" className="text-neutral-gray">Duration</Typography>
                        </div>
                        <Typography variant="h4" className="text-primary">{program.duration}</Typography>
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <DollarSign className="h-4 w-4 text-secondary-orange mr-2" />
                          <Typography variant="bodySmall" className="text-neutral-gray">Budget</Typography>
                        </div>
                        <Typography variant="h4" className="text-secondary-orange">{program.budget}</Typography>
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-lg col-span-2">
                        <div className="flex items-center mb-2">
                          <UserCheck className="h-4 w-4 text-secondary-teal mr-2" />
                          <Typography variant="bodySmall" className="text-neutral-gray">Beneficiaries</Typography>
                        </div>
                        <Typography variant="h4" className="text-secondary-teal">{program.beneficiaries}</Typography>
                      </div>
                    </div>

                    {/* Key Achievements */}
                    <div>
                      <Typography variant="h4" className="mb-3 flex items-center">
                        <Award className="h-5 w-5 text-primary mr-2" />
                        Key Achievements
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {program.keyAchievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <Typography variant="bodySmall" className="text-neutral-gray">
                              {achievement}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Focus Areas */}
                    <div>
                      <Typography variant="h4" className="mb-3">Focus Areas</Typography>
                      <div className="flex flex-wrap gap-2">
                        {program.focusAreas.map((area, areaIndex) => (
                          <span 
                            key={areaIndex}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link to={`/programs/${program.id}`}>
                        <Button size="lg" className="group">
                          Learn More About This Program
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Upcoming Programs */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-secondary-orange/10 rounded-full px-6 py-3 mb-6">
              <TrendingUp className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                UPCOMING INITIATIVES
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Future Programs in Development
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              New programs launching soon to address emerging challenges in access to justice
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingPrograms.map((program, index) => (
              <Card key={index} variant="elevated" hover className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-secondary-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {program.status}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Typography variant="h4" className="text-white mb-2">
                      {program.title}
                    </Typography>
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {program.description}
                  </Typography>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-neutral-50 rounded-lg text-center">
                      <Typography variant="bodySmall" className="text-neutral-gray mb-1">Launch Date</Typography>
                      <Typography variant="h4" className="text-primary">{program.launchDate}</Typography>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg text-center">
                      <Typography variant="bodySmall" className="text-neutral-gray mb-1">Budget</Typography>
                      <Typography variant="h4" className="text-secondary-orange">{program.budget}</Typography>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    Get Updates on This Program
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Program Impact Visualization */}
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Interconnected Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Our programs work synergistically to create comprehensive change across the legal aid ecosystem
            </Typography>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.slice(0, 6).map((program, index) => (
                <Card key={program.id} variant="flat" className="text-center group hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {program.icon}
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-2">
                    {program.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray mb-3">
                    {program.description}
                  </Typography>
                  <Typography variant="caption" className="text-primary font-semibold">
                    {program.beneficiaries}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <TestimonialSection
        title="Program Impact Stories"
        subtitle="Hear from program participants and beneficiaries about the transformative impact of our initiatives"
        testimonials={testimonials}
      />

      {/* Partners Section */}
      <PartnershipsSection
        title="Program Partners"
        subtitle="Collaborating with diverse stakeholders to maximize program effectiveness and reach"
        partners={partnerData}
      />

      {/* Call to Action */}
      <GetInvolvedCTA />
    </Layout>
  );
};

export default Programs;
