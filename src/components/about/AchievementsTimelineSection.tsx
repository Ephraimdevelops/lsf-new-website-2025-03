import { useEffect, useState } from 'react';
import Typography from '@/components/shared/Typography';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const timelineData = [
  {
    year: '2011',
    title: 'Foundation & Vision',
    description:
      'Launched as a national basket-fund mechanism to advance legal empowerment across Tanzania, laying the groundwork for transformative justice initiatives nationwide.',
    image: '/lovable-uploads/mwanamke shamba.png',
  },
  {
    year: '2015',
    title: 'Paralegal Network Established',
    description:
      'Trained over 4,628 paralegals and established paralegal units in all 158 districts. About 89% remained active, resolving 70% of cases at community level.',
    image: '/lovable-uploads/lsf-paralegal-servicing.jpeg',
  },
  {
    year: '2017',
    title: 'Legal Aid Act Advocacy',
    description:
      'Played a pivotal role in advocating for the Legal Aid Act (2017), leading to the formal recognition and regulation of paralegals across Tanzania.',
    image: '/lovable-uploads/msaada kisheria lsf yazindua .webp',
  },
  {
    year: '2020',
    title: 'Scaling Legal Aid & Education',
    description:
      'Secured TZS 5.6 billion (~USD 2.4M) in support from DANIDA, provided legal aid to nearly 100,000 people—60% women—with a 60% resolution rate, and reached over 6 million people through legal education.',
    image: '/lovable-uploads/Danida-lsf-signing.jpg',
  },
  {
    year: '2021',
    title: '10 Years of Impact',
    description:
      'Celebrated LSF’s 10th anniversary. By then, over 90,000 cases had been handled and 6 million people reached through legal education. Continued to drive domestication of the Legal Aid Act through stakeholder engagement.',
    image: '/lovable-uploads/lsf-10years-annivervasry.jpg',
  },
  {
    year: '2022',
    title: 'National Reach & Gender Justice',
    description:
      'Reached 6.4 million directly and 10 million indirectly through mass media. Addressed 8,113 GBV cases, resolved 3,176 inheritance disputes—63% in favour of women. Supported 4,195 paralegals and over 200 organisations, disbursing TZS 4.7 billion in grants.',
    image: '/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png',
  },
  {
    year: '2023',
    title: 'Recognition & Leadership in Legal Reform',
    description:
      'Disbursed TZS 3.1 billion in grants across Mainland and Zanzibar, focusing on women and children. Expanded outreach through targeted community legal aid initiatives.coordinating legal aid clinics (serving 456 individuals) and shaping discussions around women’s leadership and youth participation. Received official commendation from senior government officials, including a Certificate of Recognition from the Deputy Prime Minister.',
    image: '/lovable-uploads/wanawake tunaweza beenficiaries.jpg',
  },
  {
    year: '2024',
    title: 'Legal Services Facility and Enabel Sign Agreement to Enhance Access to Justice in Tanzania.',
    description:
    'Signed a TZS 10.7 billion (€4 million) grant agreement with Enabel to launch the 26-month IMPAWLA project, funded under the EU’s Gender Transformative Action programme. The initiative will expand access to quality legal aid, address GBV, and empower women, girls, and marginalised groups through both formal and informal justice systems.',
    image: '/lovable-uploads/LSf-enabel-un-signing.jpeg',
  },
  {
    year: '2011–2024',
    title: 'Cumulative Impact',
    description:
      'Since inception, LSF has reached over 40 million Tanzanians with legal aid and education, handled 426,000+ cases with a 76% resolution rate, and secured legal entitlements for at least 34,214 women in property and inheritance rights cases.',
    image: '/lovable-uploads/enabel -un-lsf.png',
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
    <section className="relative bg-neutral-dark 900 text-white py-20 overflow-hidden">
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${activeItem.image})` }}
      ></div>
      <div className="relative z-10 container mx-auto px-4">

              {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-primary/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg-white tracking-widest">
              WHERE WE REACHED
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            Our Strategic <span className="block">Reach</span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-gray-100">
            From grassroots to national impact — discover our growing footprint in legal empowerment across Tanzania.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {timelineData.map((item, index) => (
            <button
              key={item.year}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 border rounded-full text-lg font-medium transition ${
                activeIndex === index
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image - Reduced Size */}
          <div className="w-full h-full max-w-l mx-auto rounded overflow-hidden">
            <img
              src={activeItem.image}
              alt={`Map ${activeItem.year}`}
              className="w-full h-auto max-h-100 rounded-xl shadow-lg object-cover transition duration-500"
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-4xl font-medium mb-6">{activeItem.title}</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              {activeItem.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}