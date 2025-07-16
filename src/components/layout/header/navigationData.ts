export const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Who we are and our mission',
    subItems: [
      { name: 'Who We Are', href: '/about', description: 'Our story and mission' },
      { name: 'Our Vision & Mission', href: '/about#mission', description: 'What drives us' },
      { name: 'Our Team', href: '/team', description: 'Meet our leadership' },
      { name: 'Partners & Donors', href: '/partners', description: 'Strategic collaborations' },
    ]
  },
  { 
    name: 'What We Do', 
    href: '/what-we-do',
    description: 'Our comprehensive approach to justice',
    subItems: [
      { name: 'What We Do', href: '/what-we-do', description: 'Overview of our work' },
      { name: 'Programs', href: '/programs', description: 'Our flagship initiatives' },
    ]
  },
  { 
    name: 'Our Impact', 
    href: '/impact',
    description: 'Measurable change and real stories',
    subItems: [
      { name: 'Impact Dashboard', href: '/impact', description: 'Data and outcomes' },
      { name: 'Success Stories', href: '/heroes', description: 'Real impact stories' },
      { name: 'Reports & Achievements', href: '/impact#reports', description: 'Annual reports and milestones' },
    ]
  },
  { 
    name: "What's New", 
    href: '/news',
    description: 'Latest updates and insights',
    subItems: [
      { name: 'News & Blog', href: '/news', description: 'Latest articles and insights' },
      { name: 'Press Releases', href: '/news#press', description: 'Official announcements' },
      { name: 'Opportunities', href: '/opportunities', description: 'New opportunities' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Publications and learning materials',
    subItems: [
      { name: 'Publications & Reports', href: '/publications', description: 'Research and reports' },
      { name: 'Legal Resources', href: '/resources#legal', description: 'Legal toolkits and guides' },
      { name: 'Whistleblowing', href: '/whistleblower', description: 'whistleblower policy' },
    ]
  },
];