import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Scale, 
  MapPin, 
  Heart,
  BarChart3
} from 'lucide-react';

const keyStats = [
  {
    value: 2800000,
    suffix: '+',
    label: 'Tanzanians Reached',
    description: 'With legal aid & education',
    icon: <Users className="h-8 w-8" />,
    color: 'text-primary'
  },
  {
    value: 4000,
    suffix: '+',
    label: 'Paralegals Trained',
    description: 'Active in communities',
    icon: <Scale className="h-8 w-8" />,
    color: 'text-secondary-teal'
  },
  {
    value: 184,
    suffix: '',
    label: 'Community Justice Units',
    description: 'Supported nationwide',
    icon: <Target className="h-8 w-8" />,
    color: 'text-secondary-orange'
  },
  {
    value: 31,
    suffix: '/31',
    label: 'Regions Covered',
    description: 'Including Zanzibar',
    icon: <MapPin className="h-8 w-8" />,
    color: 'text-secondary-yellow'
  },
  {
    value: 60,
    suffix: '%+',
    label: 'Women & Girls',
    description: 'Of total beneficiaries',
    icon: <Heart className="h-8 w-8" />,
    color: 'text-pink-500'
  },
  {
    value: 78,
    suffix: '%',
    label: 'Cases Resolved',
    description: 'At community level',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'text-green-500'
  }
];

export const ImpactStats = () => {
  return (
    <Section variant="default" padding="xl">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            Impact by the Numbers
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-3xl mx-auto">
            Our commitment to transparency means we measure and report on every aspect of our work.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {keyStats.map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className={`mb-6 flex justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  className={`${stat.color} font-heading`}
                />
              </div>
              <Typography variant="h4" className="mb-3">
                {stat.label}
              </Typography>
              <Typography variant="bodySmall" className="text-muted-foreground">
                {stat.description}
              </Typography>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};