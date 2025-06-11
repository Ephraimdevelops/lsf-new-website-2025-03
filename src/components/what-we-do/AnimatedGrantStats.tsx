
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Card from '@/components/shared/Card';
import Typography from '@/components/shared/Typography';
import ProgressIndicator from '@/components/shared/ProgressIndicator';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  percentage?: number;
  color: 'primary' | 'secondary-orange' | 'secondary-teal' | 'secondary-yellow';
  delay?: number;
}

const StatCard = ({ icon, title, value, percentage, color, delay = 0 }: StatCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      variant="elevated" 
      className={`p-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="flex items-start mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}/20 text-${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <Typography variant="h4" className="mb-1">
            {value}
          </Typography>
          <Typography variant="bodySmall" className="text-neutral-gray">
            {title}
          </Typography>
        </div>
      </div>
      
      {percentage !== undefined && (
        <ProgressIndicator 
          value={percentage} 
          max={100} 
          color={color}
          label="Progress"
          className="mt-3"
        />
      )}
    </Card>
  );
};

interface AnimatedGrantStatsProps {
  stats: Array<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    percentage?: number;
    color: 'primary' | 'secondary-orange' | 'secondary-teal' | 'secondary-yellow';
  }>;
}

const AnimatedGrantStats = ({ stats }: AnimatedGrantStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          percentage={stat.percentage}
          color={stat.color}
          delay={index * 150}
        />
      ))}
    </div>
  );
};

export default AnimatedGrantStats;
