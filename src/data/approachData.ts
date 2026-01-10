import { DollarSign, Users, Megaphone, BookOpen, Zap, Network, Target, CheckCircle, TrendingUp } from 'lucide-react';

export interface ApproachData {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  overview: string;
  objectives: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
  keyActivities: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
  integration: Array<{
    focusArea: string;
    description: string;
  }>;
  flagshipProjects: Array<{
    name: string;
    description: string;
    outcomes: Array<{
      value: string;
      label: string;
    }>;
  }>;
  achievements: Array<{
    value: string;
    metric: string;
    description: string;
  }>;
  whatsNext: Array<{
    title: string;
    description: string;
    timeline: string;
  }>;
  callToAction: {
    title: string;
    description: string;
    buttons: Array<{
      text: string;
      link: string;
      variant: 'primary' | 'secondary';
    }>;
  };
}

export const approachData: ApproachData[] = [
  {
    slug: 'grant-making',
    title: 'Grant-Making and Management',
    subtitle: 'Trusted fund management enabling frontline legal aid delivery',
    heroImage: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    overview: 'For over a decade, LSF has established itself as a trusted and capable fund manager, overseeing more than USD 47 million in donor contributions. Through robust grant-making architecture, we have successfully managed 200+ subgrantees across Tanzania, ensuring efficient disbursement, rigorous compliance, and impactful service delivery.',
    objectives: [
      {
        icon: Target,
        title: 'Resource Mobilization',
        description: 'Securing and efficiently managing donor funds to maximize impact across Tanzania'
      },
      {
        icon: Users,
        title: 'Partner Development',
        description: 'Building capacity of grassroots organizations to deliver quality legal aid services'
      },
      {
        icon: CheckCircle,
        title: 'Accountability',
        description: 'Maintaining highest standards of financial transparency and compliance'
      },
      {
        icon: TrendingUp,
        title: 'Impact Scaling',
        description: 'Expanding reach and effectiveness of legal aid through strategic partnerships'
      }
    ],
    keyActivities: [
      {
        icon: DollarSign,
        title: 'Fund Management',
        description: 'Comprehensive financial oversight and disbursement systems'
      },
      {
        icon: Users,
        title: 'Capacity Building',
        description: 'Technical assistance and training for partner organizations'
      },
      {
        icon: BookOpen,
        title: 'Monitoring & Evaluation',
        description: 'Rigorous tracking of outcomes and impact measurement'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Funding 100+ frontline organizations providing direct legal aid services to marginalized communities'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Supporting paralegal training programs and community legal education initiatives'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Financing policy advocacy and institutional strengthening efforts'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Building capacity of the entire legal aid ecosystem for sustainability'
      }
    ],
    flagshipProjects: [
      {
        name: 'Civil Society Support Program',
        description: 'Comprehensive funding and capacity building program supporting 100+ grassroots legal aid organizations across Tanzania.',
        outcomes: [
          { value: '100+', label: 'Organizations Supported' },
          { value: '$47M', label: 'Funds Managed' },
          { value: '2.8M', label: 'Beneficiaries Reached' }
        ]
      },
      {
        name: 'Partner Development Initiative',
        description: 'Multi-year capacity building program strengthening organizational systems, financial management, and service delivery of CSO partners.',
        outcomes: [
          { value: '200+', label: 'Organizations Trained' },
          { value: '85%', label: 'Capacity Improvement' },
          { value: '95%', label: 'Compliance Rate' }
        ]
      }
    ],
    achievements: [
      {
        value: '$47M+',
        metric: 'Funds Managed',
        description: 'Successfully managed over 15 years with 100% accountability'
      },
      {
        value: '200+',
        metric: 'Subgrantees',
        description: 'Partner organizations supported across all regions of Tanzania'
      },
      {
        value: '100%',
        metric: 'Compliance Rate',
        description: 'Perfect track record of donor compliance and reporting'
      }
    ],
    whatsNext: [
      {
        title: 'Digital Grant Management System',
        description: 'Implementing advanced digital platform for streamlined grant processing and monitoring',
        timeline: '2025-2026'
      },
      {
        title: 'Expanded Partner Network',
        description: 'Growing network to include private sector and faith-based organizations',
        timeline: '2025-2027'
      }
    ],
    callToAction: {
      title: 'Partner in Grant-Making',
      description: 'Join our proven track record of effective fund management and impactful grant-making for access to justice.',
      buttons: [
        { text: 'Become a Donor', link: '/partnerships/donors', variant: 'primary' },
        { text: 'Financial Reports', link: '/publications/financial', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'direct-implementation',
    title: 'Direct Project Implementation',
    subtitle: 'Hands-on delivery of transformative legal empowerment programs',
    heroImage: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    overview: 'Since 2023, LSF has strategically expanded its role to include direct project implementation, enhancing agility and impact on the ground. We implement high-impact projects that strengthen women\'s access to justice, economic empowerment, and community-level legal services.',
    objectives: [
      {
        icon: Target,
        title: 'Direct Impact',
        description: 'Delivering immediate, measurable outcomes for beneficiaries'
      },
      {
        icon: Users,
        title: 'Community Engagement',
        description: 'Building direct relationships with communities and stakeholders'
      },
      {
        icon: Zap,
        title: 'Innovation',
        description: 'Testing and scaling innovative approaches to legal empowerment'
      },
      {
        icon: TrendingUp,
        title: 'Learning',
        description: 'Generating insights to improve sector-wide programming'
      }
    ],
    keyActivities: [
      {
        icon: Users,
        title: 'Program Design',
        description: 'Developing community-centered legal empowerment interventions'
      },
      {
        icon: Megaphone,
        title: 'Service Delivery',
        description: 'Direct provision of legal aid and empowerment services'
      },
      {
        icon: BookOpen,
        title: 'Impact Measurement',
        description: 'Comprehensive monitoring and evaluation of outcomes'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Direct delivery of legal aid services through mobile clinics and community centers'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Implementing paralegal training and legal education programs'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Pilot testing innovative approaches for policy influence and scaling'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Building implementation capacity and learning for sector improvement'
      }
    ],
    flagshipProjects: [
      {
        name: 'Sauti ya Mwanamke (IMPAWLA)',
        description: 'EU-funded project (€4M) through Enabel deploying 4,000+ paralegals to address GBV, land rights, and legal empowerment.',
        outcomes: [
          { value: '168', label: 'Districts' },
          { value: '4,000+', label: 'Paralegals' },
          { value: '60%', label: 'ADR Resolution' }
        ]
      },
      {
        name: 'Wanawake Tunaweza',
        description: 'North-South Cooperation initiative in Longido District empowering 209 Maasai women through VICOBA groups and 1,214 girls through education.',
        outcomes: [
          { value: '209', label: 'Women Trained' },
          { value: '1,214', label: 'Girls Reached' },
          { value: '11', label: 'VICOBA Groups' }
        ]
      }
    ],
    achievements: [
      {
        value: '75,000+',
        metric: 'Direct Beneficiaries',
        description: 'People directly served through implementation projects'
      },
      {
        value: '27',
        metric: 'Regions Reached',
        description: 'Geographic coverage across Tanzania mainland'
      },
      {
        value: '82%',
        metric: 'Success Rate',
        description: 'Average project outcome achievement rate'
      }
    ],
    whatsNext: [
      {
        title: 'Climate Justice Integration',
        description: 'Expanding programs to include climate-related legal issues and land rights',
        timeline: '2025-2027'
      },
      {
        title: 'Youth Empowerment Program',
        description: 'New initiative targeting young people for legal leadership development',
        timeline: '2025-2026'
      }
    ],
    callToAction: {
      title: 'Implement Change Together',
      description: 'Partner with us in implementing transformative programs that create lasting change for women and marginalized communities.',
      buttons: [
        { text: 'Fund a Project', link: '/partnerships/projects', variant: 'primary' },
        { text: 'Project Reports', link: '/publications/projects', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'advocacy-policy',
    title: 'Policy Influence and Advocacy',
    subtitle: 'Shaping laws and policies for inclusive access to justice',
    heroImage: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
    overview: 'LSF has played a pivotal role in shaping Tanzania\'s access to justice landscape. We champion evidence-based policy reform, lead national campaigns, and build coalitions that drive systemic change for inclusive and sustainable access to justice.',
    objectives: [
      {
        icon: Megaphone,
        title: 'Policy Reform',
        description: 'Advocating for inclusive laws and policies that promote access to justice'
      },
      {
        icon: Users,
        title: 'Coalition Building',
        description: 'Convening stakeholders for coordinated advocacy efforts'
      },
      {
        icon: BookOpen,
        title: 'Evidence Generation',
        description: 'Producing research and data to inform policy decisions'
      },
      {
        icon: Target,
        title: 'Implementation Support',
        description: 'Ensuring effective operationalization of progressive policies'
      }
    ],
    keyActivities: [
      {
        icon: Megaphone,
        title: 'Legislative Advocacy',
        description: 'Direct engagement with parliament and government institutions'
      },
      {
        icon: Users,
        title: 'Community Mobilization',
        description: 'Grassroots advocacy and awareness campaigns'
      },
      {
        icon: Network,
        title: 'Stakeholder Convening',
        description: 'Multi-sector platforms for policy dialogue and action'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Advocating for policies that ensure affordable and quality legal aid services'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Promoting policies that support community-based legal empowerment'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Leading systemic policy reform for enabling justice environment'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Advocating for policies that strengthen justice institutions'
      }
    ],
    flagshipProjects: [
      {
        name: 'Legal Aid Act Advocacy',
        description: 'Led the development and enactment of Tanzania\'s Legal Aid Act, establishing national framework for legal aid provision.',
        outcomes: [
          { value: 'Enacted', label: 'Legal Aid Act' },
          { value: 'National', label: 'Framework Established' },
          { value: '100%', label: 'Stakeholder Support' }
        ]
      },
      {
        name: 'Mama Samia Legal Aid Campaign',
        description: 'Nationwide campaign operationalizing the Legal Aid Act and fostering coordinated stakeholder engagement.',
        outcomes: [
          { value: '31', label: 'Regions Covered' },
          { value: '2.8M', label: 'People Reached' },
          { value: '500+', label: 'Stakeholders Engaged' }
        ]
      }
    ],
    achievements: [
      {
        value: '15+',
        metric: 'Policy Reforms',
        description: 'Major policy changes influenced or led by LSF advocacy'
      },
      {
        value: '1',
        metric: 'Major Act',
        description: 'Legal Aid Act successfully championed and enacted'
      },
      {
        value: '500+',
        metric: 'Stakeholders',
        description: 'Organizations and individuals engaged in advocacy efforts'
      }
    ],
    whatsNext: [
      {
        title: 'Gender Justice Policy Framework',
        description: 'Developing comprehensive policy framework for gender-responsive justice',
        timeline: '2025-2026'
      },
      {
        title: 'Digital Justice Policy',
        description: 'Advocating for policies supporting digital transformation of justice services',
        timeline: '2025-2027'
      }
    ],
    callToAction: {
      title: 'Advocate for Justice',
      description: 'Join our advocacy efforts to create systemic change and build a justice system that works for everyone.',
      buttons: [
        { text: 'Join Advocacy', link: '/advocacy/join', variant: 'primary' },
        { text: 'Policy Briefs', link: '/publications/policy', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'research-learning',
    title: 'Research, Monitoring, and Learning',
    subtitle: 'Evidence-based programming and knowledge generation',
    heroImage: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    overview: 'LSF actively invests in research, monitoring, and learning to ensure evidence-based programming and informed policy engagement. By partnering with academic institutions and research bodies, we generate insights that guide program design, track legal empowerment trends, and advocate for data-driven reforms.',
    objectives: [
      {
        icon: BookOpen,
        title: 'Evidence Generation',
        description: 'Producing high-quality research on access to justice and legal empowerment'
      },
      {
        icon: TrendingUp,
        title: 'Program Improvement',
        description: 'Using data and learning to continuously improve interventions'
      },
      {
        icon: Users,
        title: 'Knowledge Sharing',
        description: 'Disseminating learning across the sector for collective improvement'
      },
      {
        icon: Target,
        title: 'Policy Influence',
        description: 'Using evidence to inform policy development and reform'
      }
    ],
    keyActivities: [
      {
        icon: BookOpen,
        title: 'Applied Research',
        description: 'Conducting studies on legal empowerment trends and effective interventions'
      },
      {
        icon: TrendingUp,
        title: 'Data Analytics',
        description: 'Comprehensive monitoring and evaluation systems'
      },
      {
        icon: Network,
        title: 'Knowledge Platforms',
        description: 'Creating platforms for sharing learning and best practices'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Researching effective models for expanding access to quality legal services'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Evaluating community empowerment approaches and measuring impact'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Generating evidence for policy reform and institutional strengthening'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Learning from implementation to improve organizational effectiveness'
      }
    ],
    flagshipProjects: [
      {
        name: 'Tanzania Justice Landscape Study',
        description: 'Comprehensive research mapping access to justice challenges and opportunities across Tanzania.',
        outcomes: [
          { value: '31', label: 'Regions Studied' },
          { value: '10,000+', label: 'Respondents' },
          { value: '50+', label: 'Policy Recommendations' }
        ]
      },
      {
        name: 'Legal Empowerment Impact Assessment',
        description: 'Longitudinal study measuring the impact of legal empowerment interventions on women and marginalized communities.',
        outcomes: [
          { value: '5,000', label: 'Beneficiaries Tracked' },
          { value: '3', label: 'Years Duration' },
          { value: '15', label: 'Research Papers' }
        ]
      }
    ],
    achievements: [
      {
        value: '25+',
        metric: 'Research Studies',
        description: 'Comprehensive studies on access to justice and legal empowerment'
      },
      {
        value: '50+',
        metric: 'Publications',
        description: 'Research papers, policy briefs, and knowledge products'
      },
      {
        value: '100%',
        metric: 'Evidence-Based',
        description: 'All programs informed by research and evaluation findings'
      }
    ],
    whatsNext: [
      {
        title: 'AI-Powered Legal Research',
        description: 'Developing artificial intelligence tools for legal research and case analysis',
        timeline: '2025-2026'
      },
      {
        title: 'Regional Learning Network',
        description: 'Establishing East African network for sharing legal empowerment research',
        timeline: '2025-2027'
      }
    ],
    callToAction: {
      title: 'Generate Knowledge Together',
      description: 'Partner with us in producing and sharing evidence that advances access to justice for all.',
      buttons: [
        { text: 'Research Partnerships', link: '/partnerships/research', variant: 'primary' },
        { text: 'Research Library', link: '/publications/research', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'technology-innovation',
    title: 'Technology and Innovation',
    subtitle: 'Digital solutions for expanded access to legal services',
    heroImage: '/lovable-uploads/b2226752-4a54-463b-af38-a1dd2b57350b.png',
    overview: 'LSF invests in digital legal aid tools and innovative approaches to close the access gap for low-literacy, remote, or low-tech communities. Our technology initiatives include the Haki Yangu App, USSD/IVR services, and WhatsApp bots that bring legal services directly to people\'s phones.',
    objectives: [
      {
        icon: Zap,
        title: 'Digital Access',
        description: 'Expanding access to legal services through digital platforms'
      },
      {
        icon: Users,
        title: 'User-Centered Design',
        description: 'Creating inclusive technology solutions for diverse users'
      },
      {
        icon: TrendingUp,
        title: 'Efficiency',
        description: 'Improving service delivery efficiency through technology'
      },
      {
        icon: Network,
        title: 'Integration',
        description: 'Connecting digital tools with traditional service delivery'
      }
    ],
    keyActivities: [
      {
        icon: Zap,
        title: 'App Development',
        description: 'Creating user-friendly mobile applications for legal aid'
      },
      {
        icon: Network,
        title: 'Digital Infrastructure',
        description: 'Building systems for case management and service delivery'
      },
      {
        icon: Users,
        title: 'Digital Literacy',
        description: 'Training communities and partners in technology use'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Providing digital channels for accessing legal advice and services'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Using technology to scale legal education and paralegal training'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Leveraging data from digital platforms to inform policy advocacy'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Building technological capacity across the legal aid sector'
      }
    ],
    flagshipProjects: [
      {
        name: 'Haki Yangu Mobile App',
        description: 'Comprehensive mobile application providing legal information, case tracking, and connection to legal aid providers.',
        outcomes: [
          { value: '15,000+', label: 'Active Users' },
          { value: '5,000+', label: 'Cases Tracked' },
          { value: '95%', label: 'User Satisfaction' }
        ]
      },
      {
        name: 'Digital Legal Aid Platform',
        description: 'Integrated platform connecting legal aid providers, beneficiaries, and support services through digital channels.',
        outcomes: [
          { value: '100+', label: 'Providers Connected' },
          { value: '10,000+', label: 'Consultations' },
          { value: '24/7', label: 'Service Availability' }
        ]
      }
    ],
    achievements: [
      {
        value: '15,000+',
        metric: 'App Downloads',
        description: 'People using digital legal aid tools and platforms'
      },
      {
        value: '24/7',
        metric: 'Service Access',
        description: 'Round-the-clock availability of digital legal assistance'
      },
      {
        value: '5',
        metric: 'Digital Tools',
        description: 'Different technology platforms serving diverse user needs'
      }
    ],
    whatsNext: [
      {
        title: 'AI Legal Assistant',
        description: 'Developing artificial intelligence chatbot for basic legal guidance',
        timeline: '2025-2026'
      },
      {
        title: 'Blockchain Legal Records',
        description: 'Implementing blockchain technology for secure legal document management',
        timeline: '2026-2027'
      }
    ],
    callToAction: {
      title: 'Innovate for Justice',
      description: 'Join us in developing and scaling innovative technology solutions that expand access to justice.',
      buttons: [
        { text: 'Tech Partnerships', link: '/partnerships/technology', variant: 'primary' },
        { text: 'Download Haki Yangu', link: '/legal-help', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'partnerships-networking',
    title: 'Partnerships and Networking',
    subtitle: 'Building coalitions for amplified impact and systemic change',
    heroImage: '/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png',
    overview: 'LSF\'s impact is amplified through strong and diverse partnerships. We collaborate with civil society organizations, development partners, government entities, and private sector actors to co-create solutions and deliver value-added services to communities. Our convening power bridges local grassroots efforts with national policy influence.',
    objectives: [
      {
        icon: Network,
        title: 'Coalition Building',
        description: 'Creating powerful networks for coordinated action on justice issues'
      },
      {
        icon: Users,
        title: 'Stakeholder Engagement',
        description: 'Engaging diverse actors in access to justice initiatives'
      },
      {
        icon: TrendingUp,
        title: 'Impact Amplification',
        description: 'Multiplying impact through strategic collaborations'
      },
      {
        icon: Target,
        title: 'Resource Mobilization',
        description: 'Leveraging partnerships for sustainable resource mobilization'
      }
    ],
    keyActivities: [
      {
        icon: Network,
        title: 'Network Development',
        description: 'Building and maintaining strategic partnership networks'
      },
      {
        icon: Users,
        title: 'Convening',
        description: 'Facilitating multi-stakeholder dialogues and collaboration'
      },
      {
        icon: BookOpen,
        title: 'Knowledge Exchange',
        description: 'Creating platforms for sharing learning and best practices'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid',
        description: 'Partnering with service providers to expand geographic reach and service quality'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Building networks of community-based organizations for local empowerment'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Convening stakeholders for coordinated advocacy and policy influence'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Creating partnerships that strengthen the entire justice ecosystem'
      }
    ],
    flagshipProjects: [
      {
        name: 'Tanzania Legal Aid Network',
        description: 'National network of 200+ organizations working together to improve access to justice across Tanzania.',
        outcomes: [
          { value: '200+', label: 'Network Members' },
          { value: '31', label: 'Regions Covered' },
          { value: '100%', label: 'Coordination Achieved' }
        ]
      },
      {
        name: 'Multi-Stakeholder Platform',
        description: 'Convening platform bringing together government, civil society, private sector, and development partners.',
        outcomes: [
          { value: '50+', label: 'Organizations' },
          { value: '12', label: 'Annual Convenings' },
          { value: '15', label: 'Joint Initiatives' }
        ]
      }
    ],
    achievements: [
      {
        value: '200+',
        metric: 'Strategic Partners',
        description: 'Organizations across sectors collaborating for access to justice'
      },
      {
        value: '15+',
        metric: 'Years Networking',
        description: 'Building and maintaining effective partnerships'
      },
      {
        value: '100%',
        metric: 'Coordination',
        description: 'Successful coordination of multi-stakeholder initiatives'
      }
    ],
    whatsNext: [
      {
        title: 'Regional Partnerships',
        description: 'Expanding partnership networks across East Africa for regional learning',
        timeline: '2025-2026'
      },
      {
        title: 'Private Sector Engagement',
        description: 'Developing innovative partnerships with private sector for sustainability',
        timeline: '2025-2027'
      }
    ],
    callToAction: {
      title: 'Partner for Impact',
      description: 'Join our network of partners working together to transform access to justice in Tanzania and beyond.',
      buttons: [
        { text: 'Become a Partner', link: '/partnerships/join', variant: 'primary' },
        { text: 'Partnership Directory', link: '/partners', variant: 'secondary' }
      ]
    }
  }
];