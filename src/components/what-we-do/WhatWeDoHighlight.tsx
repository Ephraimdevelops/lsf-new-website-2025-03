import { 
  ArrowRight, 
  DollarSign, 
  Users, 
  Megaphone, 
  BookOpen, 
  Zap,
  Scale, 
  GraduationCap, 
  Heart, 
  FileText, 
  Building, 
  Lightbulb,
  CheckCircle,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const WhatWeDoHighlight = () => {
  return (
    <section className="py-8 bg-white mb-0">
      <div className="container max-w-7xl mx-auto px-2">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Content */}
          <div className="flex flex-col py-6">
            <div className="text-left mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-neutral-600/10 via-purple-600/10 to-pink-600/10 rounded-full px-6 py-2 mb-4 border border-blue-600/20">
                <Target className="h-5 w-5 text-neutral-600 mr-3" />
                <Typography variant="overline" className="font-bold text-base tracking-wider text-gray-900">
                  Our Strategy
                </Typography>
              </div>
              <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold text-gray-900">
                Focus Areas <span className="block bg-gradient-to-r from-primary-300 bg-clip-text">
                  & Approaches
                </span>
              </Typography>
            </div>
            <div>
              <Typography variant="body" className="text-lg text-gray-600 mb-6 leading-relaxed">
                At the LSF, we champion access to justice through an integrated model grounded in legal empowerment. Our work is guided by two complementary pillars: <span className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Strategic Approaches</span> (how we work) and <span className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Strategic Focus Areas</span> (where we focus). These intersect to deliver lasting, rights-based change for women, marginalized communities, and the justice ecosystem at large.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group gradient-button text-white px-6 py-2 rounded-full font-semibold">
                  <Link to="/about">
                    Learn Our Story
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border border-blue-600 text-blue-600 hover:bg-blue-600/10 px-6 py-2 rounded-full font-semibold">
                  <Link to="/what-we-do">
                    Explore Our Work
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-full">
            <img 
              src="/lovable-uploads/image copy.png" 
              alt="Haki Yangu App Interface" 
              className="w-full h-full object-cover rounded-lg image-overlay"
            />
          </div>
        </div>
          {/* Stats Section */}
      <div className="bg-neutral-dark text-white overflow-hidden py-16">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.8M+</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Tanzanians Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4,000+</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Trained Paralegals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">31</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Regions Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">78%</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Cases Resolved</div>
            </div>
          </div>
        </Container>
      </div>
      </div>
    </section>
  );
};

export default WhatWeDoHighlight;