import { HeroSlide, Region } from './types';

// Function to get hero slides from localStorage or return defaults
export const getHeroSlides = (): HeroSlide[] => {
  if (typeof window !== 'undefined') {
    const savedSlides = localStorage.getItem('hero-slides');
    if (savedSlides) {
      try {
        return JSON.parse(savedSlides);
      } catch (error) {
        console.error('Error parsing hero slides from localStorage:', error);
      }
    }
  }
  
  // Return default slides if none found or error occurred
  return defaultHeroSlides;
};

// Default hero slides (fallback)
const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'empowerment',
    title: 'Justice is not a privilege.',
    subtitle: 'It\'s a fundamental right for every Tanzanian.',
    description: 'From bustling urban centers to remote rural villages, our comprehensive network of paralegals, mobile clinics, and digital platforms ensures that quality legal aid, education, and advocacy reach those who need it most—because no Tanzanian should be denied justice due to geography, poverty, or lack of knowledge.',
    category: 'Legal Empowerment',
    image: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
    stat: '426,000+',
    statLabel: 'Lives Transformed'
  },
  {
    id: 'reach',
    title: 'Every district. Every community.',
    subtitle: 'Legal aid that reaches the unreachable.',
    description: 'Our network of over 500 trained paralegals spans all 184 districts of Tanzania, bringing justice directly to communities that have been historically underserved. Through mobile clinics, community workshops, and innovative digital tools, we ensure that distance is never a barrier to accessing legal support.',
    category: 'National Coverage',
    image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
    stat: '184',
    statLabel: 'Districts Covered'
  },
  {
    id: 'innovation',
    title: 'Digital tools. Real solutions.',
    subtitle: 'Technology that bridges the justice gap.',
    description: 'Through our revolutionary Haki Yangu App and comprehensive digital platforms, we\'re transforming how Tanzanians access legal information, connect with qualified paralegals, and resolve disputes. Innovation meets impact as we build the future of accessible justice in Tanzania.',
    category: 'Digital Innovation',
    image: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
    stat: '15,000+',
    statLabel: 'App Users Helped'
  }
];

// Keep the original export for backward compatibility
export const heroSlides = getHeroSlides();

export const regions: Region[] = [
  { name: "All Regions", phone: "+255 870 119 363" },
  { name: "Dar es Salaam", phone: "+255 717 111 764" },
  { name: "Mwanza", phone: "+255 769 517 305" },
  { name: "Arusha", phone: "+255 629 296 306" },
  { name: "Dodoma", phone: "+255 754 110 307" },
  { name: "Tanga", phone: "+255 711 032 998" },
  { name: "Morogoro", phone: "+255 800 110 309" },
  { name: "Mbeya", phone: "+255 745 887 221" },
  { name: "Iringa", phone: "+255 762 334 556" }
];
