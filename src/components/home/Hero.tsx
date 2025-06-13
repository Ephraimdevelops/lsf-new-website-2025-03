import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Phone, Download, Users, Scale, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  stat: string;
  statLabel: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 'empowerment',
    title: 'Justice is not a privilege.',
    subtitle: 'It\'s a fundamental right for every Tanzanian.',
    description: 'From bustling urban centers to remote rural villages, our comprehensive network of paralegals, mobile clinics, and digital platforms ensures that quality legal aid, education, and advocacy reach those who need it most—because no Tanzanian should be denied justice due to geography, poverty, or lack of knowledge.',
    category: 'Legal Empowerment',
    image: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
    stat: '426,000+',
    statLabel: 'Lives Transformed'
  },
  {
    id: 'reach',
    title: 'Every district. Every community.',
    subtitle: 'Legal aid that reaches the unreachable.',
    description: 'Our network of over 500 trained paralegals spans all 184 districts of Tanzania, bringing justice directly to communities that have been historically underserved. Through mobile clinics, community workshops, and innovative digital tools, we ensure that distance is never a barrier to accessing legal support.',
    category: 'National Coverage',
    image: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
    stat: '184',
    statLabel: 'Districts Covered'
  },
  {
    id: 'innovation',
    title: 'Digital tools. Real solutions.',
    subtitle: 'Technology that bridges the justice gap.',
    description: 'Through our revolutionary Haki Yangu App and comprehensive digital platforms, we\'re transforming how Tanzanians access legal information, connect with qualified paralegals, and resolve disputes. Innovation meets impact as we build the future of accessible justice in Tanzania.',
    category: 'Digital Innovation',
    image: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
    stat: '15,000+',
    statLabel: 'App Users Helped'
  }
];

// Comprehensive regional coverage with localized hotlines
const regions = [
  { name: "All Regions", phone: "+255 870 119 363" },
  { name: "Dar es Salaam", phone: "+255 717 111 764" },
  { name: "Mwanza", phone: "+255 769 517 305" },
  { name: "Arusha", phone: "+255 629 296 306" },
  { name: "Dodoma", phone: "+255 754 110 307" },
  { name: "Tanga", phone: "+255 711 032 998" },
  { name: "Morogoro", phone: "+255 800 110 309" },
  { name: "Mbeya", phone: "+255 745 887 221" },
  { name: "Iringa", phone: "+255 762 334 556" }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [hotlineNumber, setHotlineNumber] = useState(regions[0].phone);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Update hotline number when region changes
  useEffect(() => {
    const region = regions.find(r => r.name === selectedRegion);
    if (region) {
      setHotlineNumber(region.phone);
    }
  }, [selectedRegion]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative text-white min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with enhanced dark transparent overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${currentSlideData.image})` }}
        ></div>
        {/* Enhanced transparent dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero content with increased heading sizes */}
          <div className="lg:col-span-7">
            <div className="transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block bg-secondary-orange text-white text-sm font-bold px-4 py-2 rounded uppercase tracking-wider">
                  {currentSlideData.category}
                </span>
                <div className="flex items-center text-secondary-teal">
                  <span className="text-4xl md:text-5xl font-bold mr-3">{currentSlideData.stat}</span>
                  <span className="text-base">{currentSlideData.statLabel}</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                {currentSlideData.title}
              </h1>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8 text-secondary-teal">
                {currentSlideData.subtitle}
              </h2>
              
              <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl leading-relaxed">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/legal-help"
                  className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-lg font-bold transition duration-300 inline-flex items-center text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Legal Help Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
                <Link 
                  to="/what-we-do"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-10 py-5 rounded-lg font-bold transition duration-300 inline-flex items-center text-xl"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          {/* Enhanced Legal Aid Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-primary text-2xl font-bold">Get Free Legal Aid</h3>
                  <p className="text-neutral-600">Available in all 184 districts</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="region-select" className="block text-base font-medium mb-3 text-neutral-dark">
                  Select Your Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200 h-12">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.name} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-xl border border-primary/20">
                <Phone className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-neutral-dark">24/7 Legal Helpline</p>
                  <a href={`tel:${hotlineNumber.replace(/\s/g, '')}`} className="text-2xl font-bold text-primary">
                    {hotlineNumber}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`tel:${hotlineNumber.replace(/\s/g, '')}`}
                  className="bg-primary text-white hover:bg-primary-dark px-6 py-4 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.hakiyangu.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary-teal text-white hover:bg-opacity-90 px-6 py-4 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Get App
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Free legal consultation • Available in Swahili & English • Confidential support
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slider navigation */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
          <button 
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors border border-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors border border-white/30"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <div className="absolute bottom-8 left-8 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all border border-white/50 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
