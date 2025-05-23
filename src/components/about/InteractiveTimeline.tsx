
import { useState, useEffect } from 'react';
import { Calendar, Users, Award, Globe } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2011',
    title: 'LSF Established',
    description: 'Legal Services Facility founded to increase access to justice for all Tanzanians, particularly women.',
    icon: <Award className="h-6 w-6" />,
    stats: 'Founded'
  },
  {
    year: '2015',
    title: 'National Expansion',
    description: 'Extended legal aid services to all 184 districts across Tanzania through strategic partnerships.',
    icon: <Globe className="h-6 w-6" />,
    stats: '184 Districts'
  },
  {
    year: '2018',
    title: 'Digital Innovation',
    description: 'Launched digital platforms to improve access to legal information and services.',
    icon: <Users className="h-6 w-6" />,
    stats: '50,000+ Reached'
  },
  {
    year: '2023',
    title: 'Impact Milestone',
    description: 'Reached over 426,000 direct beneficiaries through comprehensive legal empowerment programs.',
    icon: <Calendar className="h-6 w-6" />,
    stats: '426,000+ Lives'
  }
];

const InteractiveTimeline = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('timeline');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="timeline" className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            Over a decade of advancing justice and empowering communities across Tanzania
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-secondary-teal rounded-full"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row-reverse' : ''
                } transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setActiveEvent(index)}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeEvent === index 
                    ? 'bg-primary text-white scale-110 shadow-lg' 
                    : 'bg-white border-4 border-primary text-primary'
                }`}>
                  {event.icon}
                </div>

                {/* Event Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 ${
                    activeEvent === index ? 'shadow-xl scale-105' : ''
                  }`}>
                    <div className="text-primary font-bold text-xl mb-2">{event.year}</div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-neutral-dark mb-3">{event.description}</p>
                    {event.stats && (
                      <div className="text-secondary-teal font-bold text-sm">{event.stats}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
