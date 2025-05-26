
import { CheckCircle } from 'lucide-react';
import Typography from '@/components/shared/Typography';

interface StatProps {
  value: string;
  label: string;
  description?: string;
}

const StatCard = ({ value, label, description }: StatProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center transition-transform hover:translate-y-[-5px] duration-300 group">
      <div className="text-4xl md:text-5xl font-black text-primary mb-3">{value}</div>
      <div className="text-lg font-semibold mb-2">{label}</div>
      {description && (
        <p className="text-neutral-dark text-sm">{description}</p>
      )}
    </div>
  );
};

const ImpactStats = () => {
  return (
    <section className="pattern-bg py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="display" className="text-white mb-4">
            Our Impact
          </Typography>
          <p className="max-w-3xl mx-auto text-white/90 text-lg">
            We strive to increase justice for all, particularly for women
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            value="$47M+" 
            label="Disbursed as Grants" 
            description="Financial support provided to legal aid organizations"
          />
          <StatCard 
            value="105,562+" 
            label="Supported Groups" 
            description="Community organizations receiving our assistance"
          />
          <StatCard 
            value="426,349+" 
            label="Legal Aid Beneficiaries" 
            description="Individuals receiving direct legal support"
          />
          <StatCard 
            value="39.8M+" 
            label="Legal Education Beneficiaries" 
            description="People reached through awareness programs"
          />
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
