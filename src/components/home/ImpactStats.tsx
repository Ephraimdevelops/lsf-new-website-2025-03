
import { CheckCircle } from 'lucide-react';

interface StatProps {
  value: string;
  label: string;
  description?: string;
}

const StatCard = ({ value, label, description }: StatProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px] duration-300">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-3 font-panton">{value}</div>
      <div className="text-lg font-semibold mb-2 font-panton">{label}</div>
      {description && (
        <p className="text-neutral-dark text-sm font-calibri">{description}</p>
      )}
    </div>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-20 md:py-24 pattern-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton text-white">Our Impact</h2>
          <p className="max-w-3xl mx-auto text-white/90 text-lg font-calibri">
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
