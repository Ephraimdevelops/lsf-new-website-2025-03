import { useEffect, useState } from 'react';
import Typography from '@/components/shared/Typography';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const timelineData = [
  {
    year: '2015',
    title: 'Foundation & Vision',
    description: 'This is the year the strategy began. We set our roots and defined our legal empowerment mission.',
    image: '/lovable-uploads/e1ab15b7-1be8-4b43-a3c3-0e4c6b7a0c02.png',
  },
  {
    year: '2016',
    title: 'Community Legal Awareness',
    description: 'Increased access to justice through community legal education sessions and training.',
    image: '/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png',
  },
  {
    year: '2018',
    title: 'Expansion & Collaboration',
    description: 'We expanded to 50+ districts and formed partnerships with local paralegal units.',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
  },
  {
    year: '2020',
    title: 'Strengthening Legal Aid',
    description: 'Focused on policy-level interventions and expanding our legal aid framework.',
    image: '/lovable-uploads/697177d1-fcb8-4356-b773-aca9e11107aa.png',
  },
  {
    year: '2021',
    title: 'Nationwide Coverage',
    description: 'Our reach now covers all regions in Tanzania with over 2,000 trained paralegals.',
    image: '/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png',
  },
  {
    year: '2023',
    title: 'Digital Innovation',
    description: 'Launch of our digital justice tools and AI-powered support systems.',
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
  },
  {
    year: '2024',
    title: 'Deepening Access & Data Insights',
    description: 'Nationwide data mapping and monitoring tools now drive our program delivery.',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
  },
];

export default function OurReachTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate timeline every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % timelineData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const activeItem = timelineData[activeIndex];

  return (
    <section className="relative bg-gray-900 text-white py-20 overflow-hidden">
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${activeItem.image})` }}
      ></div>
      <div className="relative z-10 container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
              WHERE WE REACHED
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            Our Strategic <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">Reach</span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-gray-300">
            From grassroots to national impact — discover our growing footprint in legal empowerment across Tanzania.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {timelineData.map((item, index) => (
            <button
              key={item.year}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                activeIndex === index
                  ? 'bg-secondary-orange text-white border-secondary-orange'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="w-full h-30 rounded overflow-hidden">
            <img
              src={activeItem.image}
              alt={`Map ${activeItem.year}`}
              className="w-full h-30 rounded-xl shadow-lg transition duration-500"
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{activeItem.title}</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              {activeItem.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}