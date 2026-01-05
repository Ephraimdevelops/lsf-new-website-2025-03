import { ArrowRight, BarChart3, FileText, Users, PlayCircle, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

const ImpactShowcaseSection = () => {
  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <Container size="xl" className="relative z-10"> {/* Restored to xl */}
        {/* Section Header */}
        <div className="text-left mb-20 max-w-4xl"> {/* text-left, max-w-4xl to match hero */}
          <div className="inline-flex items-center bg-primary/20 backdrop-blur-sm rounded-full px-8 py-2.5 mb-8 border border-primary/30">
            <BarChart3 className="h-5 w-5 mr-3 text-primary-light" />
            <span className="text-primary-light font-bold text-base uppercase tracking-widest">
              Measurable Change
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
            See the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">Impact</span>
          </h2>
          <p className="text-2xl md:text-3xl text-white/70 max-w-4xl leading-relaxed font-light">
            Behind the statistics are stories of dignity restored and rights reclaimed.
            Explore our impact through real stories and data.
          </p>
        </div>

        {/* Two Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Card 1 */}
          <div className="group bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_-5px_var(--primary)] text-white">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:text-primary-light transition-colors">
              Impact Dashboard
            </h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Explore comprehensive data on our reach, outcomes, and transformation across
              all six focus areas with interactive visualizations.
            </p>
            <Link to="/impact">
              <Button size="lg" className="bg-white text-black hover:bg-primary-light font-bold rounded-full w-full sm:w-auto">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white border border-white/20">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:text-primary-light transition-colors">
              Women We Serve
            </h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Meet the women whose lives have been transformed through our programs
              and see how legal empowerment creates lasting change.
            </p>
            <Link to="/impact/stories">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white hover:text-black font-bold rounded-full w-full sm:w-auto"
              >
                Meet the Women
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Annual Report Highlight */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-left md:max-w-xl">
              <div className="inline-flex items-center bg-black/20 rounded-full px-4 py-1.5 mb-6 text-white/90 text-sm font-bold uppercase tracking-wider">
                <FileText className="h-4 w-4 mr-2" />
                Latest Annual Report
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                2024 Annual Report
              </h2>
              <p className="text-xl text-white/90 leading-relaxed mb-0">
                Dive deep into our results, financial accountability, and future roadmap
                for justice in Tanzania.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Link to="/publications/annual-report-2024">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-neutral-100 px-10 py-6 text-xl font-bold rounded-2xl shadow-xl w-full"
                >
                  <Download className="mr-3 h-6 w-6" />
                  Download Report
                </Button>
              </Link>
              <Link to="/impact/video">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-black/10 px-8 py-4 font-bold rounded-xl w-full justify-start md:justify-center border border-white/20"
                >
                  <PlayCircle className="mr-3 h-5 w-5" />
                  Watch Summary Video
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
