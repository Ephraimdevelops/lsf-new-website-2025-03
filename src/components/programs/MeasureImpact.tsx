import { BarChart3, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const MeasureImpact = () => {
  const metrics = [
    {
      value: "126,000+",
      label: "Beneficiaries Reached",
      change: "+32% from 2023",
      color: "text-secondary-orange"
    },
    {
      value: "8,450",
      label: "Legal Cases Supported",
      change: "+18% from 2023",
      color: "text-secondary-teal"
    },
    {
      value: "85%",
      label: "Increase in Legal Literacy",
      change: "Among program participants",
      color: "text-primary"
    },
    {
      value: "92%",
      label: "Survivor Satisfaction Rate",
      change: "Protection outcomes met",
      color: "text-secondary-yellow"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-neutral-50/30 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(89,181,176,0.03)_0%,transparent_50%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <BarChart3 className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold tracking-wider text-sm">
              MEASURING OUR IMPACT
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold">
            Data-Driven
            <span className="block text-primary">
              Results
            </span>
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed mb-12">
            Our Monitoring, Evaluation, and Learning (MEL) system ensures every project is data-informed and results-driven. From baseline surveys to real-time dashboards, we measure outcomes and continuously adapt to increase effectiveness.
          </Typography>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>

                <Typography variant="h3" className={`text-4xl font-bold mb-2 ${metric.color}`}>
                  {metric.value}
                </Typography>

                <Typography variant="h4" className="font-semibold mb-3 text-primary">
                  {metric.label}
                </Typography>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Typography variant="bodySmall" className="text-green-600 font-medium">
                    {metric.change}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MEL Framework Section */}
        <div className="bg-gradient-to-br from-white to-neutral-50/50 rounded-3xl p-12 border border-neutral-100/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography variant="h3" className="text-3xl font-bold mb-6 text-primary">
                Our MEL Framework
              </Typography>
              <Typography variant="body" className="text-neutral-600 mb-8 text-lg leading-relaxed">
                We employ rigorous monitoring and evaluation methodologies to track progress, measure impact, and ensure accountability to our beneficiaries and funders.
              </Typography>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary-teal rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <Typography variant="body" className="text-neutral-700">
                    Baseline surveys and regular assessments
                  </Typography>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary-teal rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <Typography variant="body" className="text-neutral-700">
                    Real-time monitoring dashboards
                  </Typography>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary-teal rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <Typography variant="body" className="text-neutral-700">
                    Outcome tracking and impact evaluation
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/publications">
                  <Button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                    Explore Our MEL Framework
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                    View 2024 Project Outcomes
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-8 border border-primary/10">
                <img
                  src="/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png"
                  alt="MEL Framework Visualization"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeasureImpact;