
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Users, Megaphone, TrendingUp } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import LegalAidDialog from '@/components/shared/LegalAidDialog';

interface HighlightItem {
  id: string;
  type: 'blog' | 'report' | 'event' | 'campaign';
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  link: string;
}

const highlights: HighlightItem[] = [
  {
    id: '1',
    type: 'blog',
    title: 'Empowering Rural Women Through Legal Education',
    description: 'Our latest initiative reaches over 5,000 women across remote villages, providing essential knowledge about land rights and inheritance laws.',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    date: '2024-06-10',
    category: 'Women\'s Rights',
    link: '/news/1'
  },
  {
    id: '2',
    type: 'report',
    title: 'Annual Impact Report 2024: Transforming Communities',
    description: 'Comprehensive analysis of our work reaching 426,349+ beneficiaries and disbursing $47M+ in grants across Tanzania.',
    image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
    date: '2024-06-08',
    category: 'Impact Assessment',
    link: '/publications/annual-report-2024'
  },
  {
    id: '3',
    type: 'event',
    title: 'National Legal Aid Conference 2024',
    description: 'Join 500+ legal practitioners, paralegals, and community leaders for Tanzania\'s largest legal empowerment gathering.',
    image: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
    date: '2024-07-15',
    category: 'Professional Development',
    link: '/events/national-conference-2024'
  },
  {
    id: '4',
    type: 'campaign',
    title: '#HakiYanguApp: Digital Justice for All',
    description: 'Our revolutionary mobile app has now helped over 15,000 Tanzanians access legal aid with just a few taps.',
    image: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
    date: '2024-06-05',
    category: 'Digital Innovation',
    link: '/programs/haki-yangu-app'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'blog':
      return <FileText className="h-5 w-5" />;
    case 'report':
      return <TrendingUp className="h-5 w-5" />;
    case 'event':
      return <Users className="h-5 w-5" />;
    case 'campaign':
      return <Megaphone className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'blog':
      return 'bg-primary text-white';
    case 'report':
      return 'bg-secondary-teal text-white';
    case 'event':
      return 'bg-secondary-orange text-white';
    case 'campaign':
      return 'bg-secondary-yellow text-neutral-dark';
    default:
      return 'bg-primary text-white';
  }
};

const HighlightsSection = () => {
  const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredHighlight = highlights[activeIndex];

  return (
    <>
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-secondary-teal/5 rounded-full blur-3xl"></div>
        </div>

        <Container size="xl" className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <TrendingUp className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                LATEST HIGHLIGHTS
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
              Driving Change Across
              <span className="block text-primary">Tanzania</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
              Stay updated with our latest initiatives, groundbreaking reports, upcoming events, and digital innovations transforming access to justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Content */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-2xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img 
                      src={featuredHighlight.image}
                      alt={featuredHighlight.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Type badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${getTypeColor(featuredHighlight.type)}`}>
                        {getTypeIcon(featuredHighlight.type)}
                        <span className="ml-2 capitalize">{featuredHighlight.type}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(featuredHighlight.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {featuredHighlight.category}
                      </span>
                    </div>
                    
                    <Typography variant="h2" className="mb-4 text-2xl md:text-3xl font-bold text-neutral-dark">
                      {featuredHighlight.title}
                    </Typography>
                    
                    <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                      {featuredHighlight.description}
                    </Typography>
                    
                    <div className="flex flex-wrap gap-4">
                      <Link to={featuredHighlight.link}>
                        <Button className="bg-primary hover:bg-primary-dark text-white">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={() => setLegalAidDialogOpen(true)}
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Get Legal Help
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar with other highlights */}
            <div className="space-y-4">
              <Typography variant="h3" className="text-neutral-dark mb-6">More Updates</Typography>
              
              {highlights.map((item, index) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
                    index === activeIndex 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded capitalize">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <Typography variant="h4" className="text-sm font-bold text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-xs text-neutral-gray line-clamp-2 mt-1">
                        {item.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <LegalAidDialog 
        open={legalAidDialogOpen} 
        onOpenChange={setLegalAidDialogOpen} 
      />
    </>
  );
};

export default HighlightsSection;
