
import { TrendingUp } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import NewsSection from './news/NewsSection';
import PublicationsSection from './news/PublicationsSection';

const CompactNewsUpdates = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Beautiful Glowing Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 right-36 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-28 w-64 h-64 bg-secondary-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-secondary-orange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary-orange/10 to-secondary-teal/10 backdrop-blur-md rounded-full px-9 py-5 mb-8">
            <TrendingUp className="h-7 w-7 mr-4 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange tracking-widest font-black text-lg">
              NEWS & RESEARCH
            </Typography>
          </div>
          <Typography variant="display" className="mb-8 font-heading text-6xl lg:text-7xl">
            Latest <span className="text-secondary-orange">Stories</span> &amp; <span className="text-secondary-teal">Publications</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-2xl leading-relaxed">
            Discover our most recent impact stories and cutting-edge research transforming Tanzania's justice landscape.
          </Typography>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          <NewsSection />
          <PublicationsSection />
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
