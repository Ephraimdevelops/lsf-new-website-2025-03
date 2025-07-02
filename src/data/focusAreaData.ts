import { Scale, Users, Gavel, Building, DollarSign, FileText, Megaphone, BookOpen } from 'lucide-react';

export interface FocusAreaData {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  whyItMatters: {
    overview: string;
    statistics: Array<{
      value: string;
      description: string;
    }>;
  };
  ourApproach: {
    description: string;
    methods: Array<{
      icon: any;
      title: string;
      description: string;
    }>;
  };
  featuredProjects: Array<{
    name: string;
    description: string;
    regions: string;
    beneficiaries: string;
    outcome: string;
  }>;
  impact: {
    metrics: Array<{
      value: string;
      label: string;
    }>;
    testimonial: {
      quote: string;
      author: string;
      title: string;
    };
  };
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

export const focusAreaData: FocusAreaData[] = [
  {
    slug: 'accessible-legal-aid',
    title: 'Accessible Legal Aid',
    subtitle: 'Ensuring every woman and marginalized person can access legal assistance',
    heroImage: '/lovable-uploads/02e8bc92-1854-4945-9da0-b4293427f46d.png',
    whyItMatters: {
      overview: 'In Tanzania, millions of people—particularly women and marginalized communities—face significant barriers to accessing quality legal aid. Geographic isolation, financial constraints, and limited legal literacy create a justice gap that perpetuates inequality and vulnerability.',
      statistics: [
        {
          value: '80%',
          description: 'of Tanzanians have limited access to legal services'
        },
        {
          value: '2.8M',
          description: 'women lack adequate legal representation'
        }
      ]
    },
    ourApproach: {
      description: 'LSF addresses these barriers through innovative service delivery models that bring legal aid directly to communities while building local capacity for sustainable access to justice.',
      methods: [
        {
          icon: DollarSign,
          title: 'Grant-Making',
          description: 'Supporting 100+ frontline legal aid organizations with funding and capacity building'
        },
        {
          icon: Users,
          title: 'Direct Implementation',
          description: 'Operating mobile clinics and community legal centers in underserved areas'
        },
        {
          icon: Megaphone,
          title: 'Policy Advocacy',
          description: 'Championing the Legal Aid Act and national framework for accessible services'
        },
        {
          icon: BookOpen,
          title: 'Innovation',
          description: 'Developing digital tools like Haki Yangu app for remote legal assistance'
        }
      ]
    },
    featuredProjects: [
      {
        name: 'Sauti ya Mwanamke',
        description: 'EU-funded project strengthening women\'s access to justice and voice in governance through paralegal networks and legal empowerment.',
        regions: '15',
        beneficiaries: '45,000',
        outcome: '78% case resolution rate'
      },
      {
        name: 'Mobile Legal Clinics',
        description: 'Bringing legal services directly to remote communities through mobile legal aid units and trained paralegals.',
        regions: '25',
        beneficiaries: '18,000',
        outcome: '95% satisfaction rate'
      }
    ],
    impact: {
      metrics: [
        { value: '2.8M+', label: 'Tanzanians Reached' },
        { value: '4,000+', label: 'Trained Paralegals' },
        { value: '100+', label: 'Partner Organizations' },
        { value: '78%', label: 'Cases Successfully Resolved' }
      ],
      testimonial: {
        quote: 'LSF\'s legal aid program helped me secure my land rights when my late husband\'s family tried to take our property. Now I can provide for my children with dignity.',
        author: 'Fatuma Mwalimu',
        title: 'Beneficiary, Mbeya Region'
      }
    },
    callToAction: {
      title: 'Support Accessible Justice',
      description: 'Help us continue expanding access to quality legal aid services for women and marginalized communities across Tanzania.',
      buttons: [
        { text: 'Donate Now', link: '/donate', variant: 'primary' },
        { text: 'View Impact Report', link: '/publications/impact-report', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'empowered-communities',
    title: 'Empowered Communities',
    subtitle: 'Building legal knowledge and capacity within communities',
    heroImage: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    whyItMatters: {
      overview: 'Strong, legally empowered communities are the foundation of sustainable access to justice. When communities understand their rights and have local advocates, they can prevent disputes, resolve conflicts peacefully, and hold institutions accountable.',
      statistics: [
        {
          value: '60%',
          description: 'of disputes can be resolved at community level with proper legal empowerment'
        },
        {
          value: '75%',
          description: 'of women report increased confidence after legal education'
        }
      ]
    },
    ourApproach: {
      description: 'We invest in community-centered empowerment by training paralegals, conducting legal awareness programs, and building local capacity for rights protection and advocacy.',
      methods: [
        {
          icon: Users,
          title: 'Paralegal Training',
          description: 'Comprehensive certification programs creating community-based legal advocates'
        },
        {
          icon: BookOpen,
          title: 'Legal Education',
          description: 'Rights awareness workshops and educational campaigns in local languages'
        },
        {
          icon: Megaphone,
          title: 'Community Mobilization',
          description: 'Organizing communities around legal issues and collective action'
        },
        {
          icon: Gavel,
          title: 'Dispute Resolution',
          description: 'Training in alternative dispute resolution and mediation techniques'
        }
      ]
    },
    featuredProjects: [
      {
        name: 'Wanawake Tunaweza',
        description: 'Empowering women economically and legally, particularly in rural communities, through comprehensive training and support programs.',
        regions: '12',
        beneficiaries: '30,000',
        outcome: '85% economic improvement'
      },
      {
        name: 'Youth Legal Champions',
        description: 'Training young people as legal advocates and community mobilizers for peer-to-peer rights education.',
        regions: '20',
        beneficiaries: '25,000',
        outcome: '90% knowledge retention'
      }
    ],
    impact: {
      metrics: [
        { value: '4,000+', label: 'Paralegals Trained' },
        { value: '184', label: 'Communities Served' },
        { value: '85%', label: 'Local Dispute Resolution Rate' },
        { value: '31', label: 'Regions Covered' }
      ],
      testimonial: {
        quote: 'Through LSF\'s paralegal training, I became a community advocate and have helped over 200 families resolve legal issues. I am proud to serve my community.',
        author: 'John Mwalimu',
        title: 'Community Paralegal, Dodoma'
      }
    },
    callToAction: {
      title: 'Empower Your Community',
      description: 'Join our efforts to build legally empowered communities across Tanzania through education, training, and local advocacy.',
      buttons: [
        { text: 'Partner With Us', link: '/partnerships', variant: 'primary' },
        { text: 'Training Resources', link: '/resources/training', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'conducive-environment',
    title: 'Conducive Environment',
    subtitle: 'Creating systemic change for sustainable access to justice',
    heroImage: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
    whyItMatters: {
      overview: 'Individual legal aid cases, while important, cannot alone solve systemic barriers to justice. Creating a conducive environment requires policy reform, institutional strengthening, and advocacy for structural changes that benefit all Tanzanians.',
      statistics: [
        {
          value: '15+',
          description: 'policy reforms influenced by LSF advocacy'
        },
        {
          value: '500+',
          description: 'justice sector professionals trained'
        }
      ]
    },
    ourApproach: {
      description: 'We work systematically to create enabling conditions for justice through policy advocacy, institutional capacity building, and multi-stakeholder collaboration.',
      methods: [
        {
          icon: Megaphone,
          title: 'Policy Advocacy',
          description: 'Evidence-based advocacy for legal reforms and inclusive policies'
        },
        {
          icon: Gavel,
          title: 'Institutional Strengthening',
          description: 'Capacity building for courts, legal aid boards, and justice institutions'
        },
        {
          icon: Users,
          title: 'Coalition Building',
          description: 'Convening stakeholders for coordinated action on justice issues'
        },
        {
          icon: BookOpen,
          title: 'Research & Evidence',
          description: 'Generating evidence to inform policy and institutional reforms'
        }
      ]
    },
    featuredProjects: [
      {
        name: 'Legal Aid Act Implementation',
        description: 'Leading advocacy for the Legal Aid Act and supporting its implementation across Tanzania to establish national framework for legal aid.',
        regions: 'National',
        beneficiaries: 'All Citizens',
        outcome: 'Act Enacted & Operationalized'
      },
      {
        name: 'Mama Samia Legal Aid Campaign',
        description: 'Nationwide campaign to operationalize the Legal Aid Act and foster coordinated stakeholder engagement in legal empowerment.',
        regions: '31',
        beneficiaries: '2.8M',
        outcome: 'National Awareness Raised'
      }
    ],
    impact: {
      metrics: [
        { value: '15+', label: 'Policy Reforms Influenced' },
        { value: '500+', label: 'Professionals Trained' },
        { value: '30+', label: 'Laws Influenced' },
        { value: '100+', label: 'Stakeholder Organizations' }
      ],
      testimonial: {
        quote: 'LSF\'s policy advocacy has been instrumental in creating a more inclusive and accessible justice system for all Tanzanians.',
        author: 'Hon. Dr. Tulia Ackson',
        title: 'Speaker of Parliament'
      }
    },
    callToAction: {
      title: 'Advocate for Justice',
      description: 'Join our advocacy efforts to create systemic change and build a justice system that works for everyone.',
      buttons: [
        { text: 'Join Our Advocacy', link: '/advocacy', variant: 'primary' },
        { text: 'Policy Resources', link: '/resources/policy', variant: 'secondary' }
      ]
    }
  },
  {
    slug: 'institutional-development',
    title: 'Institutional Development',
    subtitle: 'Building sustainable capacity for long-term impact',
    heroImage: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    whyItMatters: {
      overview: 'Sustainable impact requires strong institutions. LSF invests in organizational development, financial sustainability, and strategic partnerships to ensure our mission continues for generations to come.',
      statistics: [
        {
          value: '$47M+',
          description: 'in development funds managed over 15 years'
        },
        {
          value: '200+',
          description: 'strategic partnerships established'
        }
      ]
    },
    ourApproach: {
      description: 'We strengthen institutional capacity through robust governance, financial sustainability, technology integration, and strategic partnerships that amplify our collective impact.',
      methods: [
        {
          icon: Building,
          title: 'Organizational Development',
          description: 'Building robust governance systems and management capacity'
        },
        {
          icon: DollarSign,
          title: 'Financial Sustainability',
          description: 'Diversifying funding sources and improving resource management'
        },
        {
          icon: Users,
          title: 'Partnership Building',
          description: 'Strengthening the broader legal aid ecosystem through collaboration'
        },
        {
          icon: BookOpen,
          title: 'Knowledge Management',
          description: 'Capturing and sharing learning for sector-wide improvement'
        }
      ]
    },
    featuredProjects: [
      {
        name: 'Strategic Plan 2025-2030',
        description: 'Comprehensive institutional development plan focusing on sustainability, innovation, and expanded impact across Tanzania.',
        regions: 'National',
        beneficiaries: 'Sector-wide',
        outcome: 'Strategic Direction Set'
      },
      {
        name: 'Partner Capacity Program',
        description: 'Comprehensive capacity building program for CSO partners, strengthening organizational systems and service delivery.',
        regions: '31',
        beneficiaries: '200+ CSOs',
        outcome: '80% capacity improvement'
      }
    ],
    impact: {
      metrics: [
        { value: '15+', label: 'Years of Operation' },
        { value: '$47M+', label: 'Resources Mobilized' },
        { value: '200+', label: 'Partner Organizations' },
        { value: '95%', label: 'Donor Satisfaction Rate' }
      ],
      testimonial: {
        quote: 'LSF\'s institutional strength and commitment to sustainability makes them an ideal partner for long-term justice initiatives.',
        author: 'Dr. Sarah Mitchell',
        title: 'International Development Advisor'
      }
    },
    callToAction: {
      title: 'Build Sustainable Justice',
      description: 'Partner with us to strengthen institutions and build lasting capacity for access to justice across Tanzania.',
      buttons: [
        { text: 'Become a Partner', link: '/partnerships', variant: 'primary' },
        { text: 'Annual Report', link: '/publications/annual-report', variant: 'secondary' }
      ]
    }
  }
];