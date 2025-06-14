
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
    <section className="relative text-white min-h-[100vh] flex items-center overflow-hidden">
      {/* Enhanced Multi-Layer Background Treatment */}
      <div className="absolute inset-0">
        {/* Base Image with Ken Burns Effect */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[8000ms] ease-in-out transform scale-105 hover:scale-100"
          style={{ 
            backgroundImage: `url(${currentSlideData.image})`,
            backgroundPosition: 'center center'
          }}
        ></div>
        
        {/* Sophisticated Multi-Layer Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-primary/75 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        
        {/* Subtle Pattern Overlay for Texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Dynamic Light Rays */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-secondary-orange/30 via-transparent to-transparent transform -skew-x-12"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-secondary-teal/30 via-transparent to-transparent transform skew-x-12"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Enhanced Hero Content */}
          <div className="lg:col-span-7">
            <div className="transition-all duration-500">
              {/* Category Badge with Glow Effect */}
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-block bg-gradient-to-r from-secondary-orange to-secondary-orange/80 text-white text-lg font-bold px-8 py-4 rounded-full uppercase tracking-wider shadow-lg shadow-secondary-orange/30">
                  {currentSlideData.category}
                </span>
                <div className="flex items-center text-secondary-teal">
                  <span className="text-6xl md:text-7xl lg:text-8xl font-bold mr-4 font-heading drop-shadow-lg">{currentSlideData.stat}</span>
                  <span className="text-xl md:text-2xl">{currentSlideData.statLabel}</span>
                </div>
              </div>
              
              {/* Main Headlines with Enhanced Typography */}
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight font-heading drop-shadow-2xl">
                {currentSlideData.title}
              </h1>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-10 text-secondary-teal font-heading drop-shadow-lg">
                {currentSlideData.subtitle}
              </h2>
              
              {/* Description with Better Visual Hierarchy */}
              <div className="bg-black/30 backdrop-blur-sm border-l-4 border-secondary-orange pl-8 py-6 mb-12 rounded-r-2xl">
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-2xl leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-wrap gap-8">
                <Link 
                  to="/legal-help"
                  className="group bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-12 py-6 rounded-2xl font-bold transition-all duration-300 inline-flex items-center text-xl md:text-2xl shadow-2xl hover:shadow-primary/50 transform hover:-translate-y-2 hover:scale-105"
                >
                  Get Legal Help Now
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  to="/what-we-do"
                  className="group bg-white/20 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 px-12 py-6 rounded-2xl font-bold transition-all duration-300 inline-flex items-center text-xl md:text-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Learn More
                  <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Enhanced Legal Aid Widget with Glass Morphism */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-4 rounded-2xl shadow-lg">
                  <Scale className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-primary text-3xl font-bold font-heading">Get Free Legal Aid</h3>
                  <p className="text-neutral-600 text-lg">Available in all 184 districts</p>
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="region-select" className="block text-base font-medium mb-3 text-neutral-dark">
                  Select Your Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200 h-12 shadow-sm hover:shadow-md transition-shadow">
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
              
              <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                <Phone className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-neutral-dark">24/7 Legal Helpline</p>
                  <a href={`tel:${hotlineNumber.replace(/\s/g, '')}`} className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
                    {hotlineNumber}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`tel:${hotlineNumber.replace(/\s/g, '')}`}
                  className="bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary px-6 py-4 rounded-xl text-center font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.hakiyangu.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-secondary-teal to-secondary-teal/80 text-white hover:from-secondary-teal/90 hover:to-secondary-teal px-6 py-4 rounded-xl text-center font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
        
        {/* Enhanced Slider Navigation */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-3">
          <button 
            onClick={prevSlide}
            className="bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-8 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 shadow-lg ${
                currentSlide === index 
                  ? 'bg-secondary-orange border-secondary-orange scale-125 shadow-secondary-orange/50' 
                  : 'bg-white/40 border-white/60 hover:bg-white/60 hover:scale-110'
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
