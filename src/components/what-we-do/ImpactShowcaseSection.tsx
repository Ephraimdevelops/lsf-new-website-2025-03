import { ArrowRight, BarChart3, FileText, Users, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/shared/Container";
import Typography from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";

const ImpactShowcaseSection = () => {
  return (
    <section className="py-24 bg-neutral-50">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Measurable Change
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            See the Impact
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Behind the statistics are stories of dignity restored, rights reclaimed, 
            and systems challenged. Explore our impact through real stories and data-backed change.
          </p>
        </div>

        {/* Two Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-secondary-orange rounded-xl flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Impact Dashboard
              </h3>
            </div>
            <p className="text-neutral-600 text-base mb-6 leading-relaxed">
              Explore comprehensive data on our reach, outcomes, and transformation across 
              all six focus areas with interactive visualizations.
            </p>
            <Link to="/impact">
              <Button className="bg-secondary-orange hover:bg-secondary-orange-dark text-white font-semibold transition-colors duration-200">
                View Our Impact Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-secondary-teal rounded-xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Women We Serve
              </h3>
            </div>
            <p className="text-neutral-600 text-base mb-6 leading-relaxed">
              Meet the women whose lives have been transformed through our programs 
              and see how legal empowerment creates lasting change.
            </p>
            <Link to="/impact/stories">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors duration-200"
              >
                Meet the Women We Serve
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Annual Report Highlight */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-14 hover:shadow-lg transition-shadow duration-300">
          <div className="text-center">
            <div className="inline-flex items-center bg-secondary-yellow/10 rounded-full px-6 py-2 mb-6">
              <FileText className="h-5 w-5 mr-2 text-secondary-yellow" />
              <span className="text-secondary-yellow font-semibold text-sm uppercase tracking-wider">
                Latest Annual Report
              </span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              2024 Annual Report
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Explore our 2024 Annual Report to understand how we delivered results across 
              six focus areas, ensured financial accountability, and what’s next for justice in Tanzania.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publications/annual-report-2024">
                <Button
                  size="lg"
                  className="bg-secondary-yellow hover:bg-secondary-yellow-dark text-neutral-900 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  Download 2024 Report
                </Button>
              </Link>
              <Link to="/impact/video">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <PlayCircle className="mr-3 h-6 w-6" />
                  Watch the Impact Video
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ImpactShowcaseSection;
