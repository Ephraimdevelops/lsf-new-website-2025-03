
import { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Scale, Heart } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <Users className="h-8 w-8" />,
    value: 426349,
    suffix: '+',
    label: 'Direct Beneficiaries',
    color: 'text-primary'
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    value: 184,
    suffix: '',
    label: 'Districts Covered',
    color: 'text-secondary-teal'
  },
  {
    icon: <Scale className="h-8 w-8" />,
    value: 180,
    suffix: '+',
    label: 'Partner Organizations',
    color: 'text-secondary-orange'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    value: 13,
    suffix: '',
    label: 'Years of Impact',
    color: 'text-secondary-yellow'
  }
];

const AnimatedStats = () => {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let currentValue = 0;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.value) {
          currentValue = stat.value;
          clearInterval(timer);
        }
        
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(currentValue);
          return newValues;
        });
      }, duration / steps);
    });
  };

  return (
    <div ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-lg text-neutral-dark">
            Transforming lives through legal empowerment across Tanzania
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-md mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <span className={stat.color}>
                    {animatedValues[index].toLocaleString()}
                  </span>
                  <span className={`${stat.color} text-2xl`}>{stat.suffix}</span>
                </div>
                <div className="text-neutral-dark font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedStats;
