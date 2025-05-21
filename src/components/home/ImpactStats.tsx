
interface StatProps {
  value: string;
  label: string;
  description?: string;
}

const StatCard = ({ value, label, description }: StatProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform hover:translate-y-[-5px] duration-300">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-3">{value}</div>
      <div className="text-lg font-semibold mb-2">{label}</div>
      {description && (
        <p className="text-neutral-gray text-sm">{description}</p>
      )}
    </div>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-20 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">Our Impact</h2>
          <p className="max-w-2xl mx-auto text-neutral-gray text-lg">
            For over a decade, we've been making a significant impact in promoting justice across Tanzania.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            value="579,287+" 
            label="Legal Aid Cases" 
            description="Cases supported across Tanzania since 2011"
          />
          <StatCard 
            value="7M+" 
            label="Tanzanians Reached" 
            description="With legal education programs in 2024"
          />
          <StatCard 
            value="87.7%" 
            label="Women Empowered" 
            description="Feel confident to claim their rights after our support"
          />
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
