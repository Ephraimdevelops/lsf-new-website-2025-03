
interface StatProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-neutral-gray">{label}</div>
    </div>
  );
};

const ImpactStats = () => {
  return (
    <section className="py-12 md:py-20 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="max-w-2xl mx-auto text-neutral-gray">
            For over a decade, we've been making a significant impact in promoting justice across Tanzania.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value="500,000+" label="People Reached" />
          <StatCard value="28" label="Districts Covered" />
          <StatCard value="150+" label="Legal Aid Partners" />
          <StatCard value="70%" label="Women Beneficiaries" />
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
