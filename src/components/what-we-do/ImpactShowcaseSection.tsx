import { ArrowRight, BarChart3, FileText, Users, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const ImpactShowcaseSection = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <Container size="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
            <BarChart3 className="h-5 w-5 mr-3 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              MEASURABLE CHANGE
            </span>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold text-neutral-900">
            See the Impact
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
            Behind the statistics are stories of dignity restored, rights reclaimed, and systems challenged. Explore our impact through real stories and data-backed change.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg border border-neutral-200 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-secondary-orange rounded-lg flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="text-2xl font-bold text-neutral-900">
                Impact Dashboard
              </Typography>
            </div>
            <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
              Explore comprehensive data on our reach, outcomes, and transformation across all six focus areas with interactive visualizations.
            </Typography>
            <Link to="/impact">
              <Button className="bg-secondary-orange hover:bg-secondary-orange-dark text-white font-semibold transition-colors duration-200">
                View Our Impact Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-secondary-teal rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="text-2xl font-bold text-neutral-900">
                Women We Serve
              </Typography>
            </div>
            <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
              Meet the women whose lives have been transformed through our programs and see how legal empowerment creates lasting change.
            </Typography>
            <Link to="/impact/stories">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors duration-200">
                Meet the Women We Serve
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Clean Annual Report Section */}
        <div className="bg-white rounded-lg border border-neutral-200 p-12">
          <div className="text-center">
            <div className="inline-flex items-center bg-secondary-yellow/10 rounded-full px-6 py-3 mb-8">
              <FileText className="h-5 w-5 mr-3 text-secondary-yellow" />
              <span className="text-secondary-yellow font-semibold text-sm uppercase tracking-wider">
                LATEST ANNUAL REPORT
              </span>
            </div>
            <Typography variant="h2" className="mb-8 text-4xl font-bold text-neutral-900">
              2024 Annual Report
            </Typography>
            <Typography variant="body" className="text-neutral-600 mb-12 max-w-4xl mx-auto text-lg leading-relaxed">
              Explore our 2024 Annual Report to understand how we delivered results across these six focus areas, our financial accountability, and what's next.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publications/annual-report-2024">
                <Button size="lg" className="bg-secondary-yellow hover:bg-secondary-yellow-dark text-neutral-900 px-8 py-4 text-lg font-semibold rounded-lg">
                  <FileText className="mr-3 h-6 w-6" />
                  Download 2024 Report
                </Button>
              </Link>
              <Link to="/impact/video">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-lg">
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