
import { CheckCircle } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface StatProps {
  value: string;
  label: string;
  description?: string;
}

const StatCard = ({ value, label, description }: StatProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-transform hover:translate-y-[-5px] duration-300 group border border-gray-100">
      <Typography variant="display" className="text-primary mb-2 text-3xl md:text-4xl">{value}</Typography>
      <Typography variant="h4" className="mb-2 text-neutral-dark">{label}</Typography>
      {description && (
        <Typography variant="bodySmall" className="text-neutral-gray">{description}</Typography>
      )}
    </div>
  );
};

const ImpactStats = () => {
  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Typography variant="h2" className="text-white mb-4">
            Our Impact
          </Typography>
          <Typography variant="body" className="text-white/90">
            We strive to increase justice for all, particularly for women
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </Container>
    </Section>
  );
};

export default ImpactStats;
