import { ArrowRight, BarChart3, FileText, Users, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const ImpactShowcaseSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(89,181,176,0.1)_0%,transparent_50%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <BarChart3 className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              MEASURABLE CHANGE
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold text-white">
            See the Impact
          </Typography>
          <Typography variant="body" className="text-white/90 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
            Behind the statistics are stories of dignity restored, rights reclaimed, and systems challenged. Explore our impact through real stories and data-backed change.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-orange to-secondary-orange/80 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-white">
                  Impact Dashboard
                </Typography>
              </div>
              <Typography variant="body" className="text-white/80 mb-6 leading-relaxed">
                Explore comprehensive data on our reach, outcomes, and transformation across all six focus areas with interactive visualizations.
              </Typography>
              <Link to="/impact">
                <Button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-semibold group-hover:translate-x-2 transition-all duration-300">
                  View Our Impact Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-teal to-secondary-teal/80 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-white">
                  Women We Serve
                </Typography>
              </div>
              <Typography variant="body" className="text-white/80 mb-6 leading-relaxed">
                Meet the women whose lives have been transformed through our programs and see how legal empowerment creates lasting change.
              </Typography>
              <Link to="/impact/stories">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold group-hover:translate-x-2 transition-all duration-300">
                  Meet the Women We Serve
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Annual Report Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <FileText className="h-5 w-5 mr-3 text-secondary-yellow" />
              <Typography variant="overline" className="text-secondary-yellow font-bold tracking-wider text-sm">
                LATEST ANNUAL REPORT
              </Typography>
            </div>
            <Typography variant="h2" className="mb-8 text-4xl font-bold text-white">
              2024 Annual Report
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 max-w-4xl mx-auto text-lg leading-relaxed">
              Explore our 2024 Annual Report to understand how we delivered results across these six focus areas, our financial accountability, and what's next.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publications/annual-report-2024">
                <Button size="lg" className="bg-secondary-yellow hover:bg-secondary-yellow/90 text-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                  <FileText className="mr-3 h-6 w-6" />
                  Download 2024 Report
                </Button>
              </Link>
              <Link to="/impact/video">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
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