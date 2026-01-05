import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight, Users, Target, Heart, Newspaper, BookOpen, Award, TrendingUp, FileText, Shield } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  description: string;
  subItems: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

interface NavigationDropdownProps {
  item: NavigationItem;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

// Featured images and icons for each navigation section
const sectionData: Record<string, {
  image: string;
  icon: React.ReactNode;
  gradient: string;
  tagline: string;
  cta: string;
  ctaLink: string;
}> = {
  'About': {
    image: '/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-primary via-primary-dark to-primary-dark',
    tagline: 'Championing access to justice since 2011',
    cta: 'Meet Our Team',
    ctaLink: '/team'
  },
  'What We Do': {
    image: '/lovable-uploads/background with mother umage .png',
    icon: <Target className="w-6 h-6" />,
    gradient: 'from-secondary-teal via-secondary-teal-dark to-secondary-teal-dark',
    tagline: 'Legal empowerment for communities across Tanzania',
    cta: 'View Programs',
    ctaLink: '/programs'
  },
  'Our Impact': {
    image: '/lovable-uploads/07fc4d64-f9f2-40fb-83d5-6a1a52bbdb98.png',
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-secondary-orange via-secondary-orange-dark to-neutral-900',
    tagline: '500,000+ lives transformed through access to justice',
    cta: 'See Impact Data',
    ctaLink: '/impact'
  },
  "What's New": {
    image: '/lovable-uploads/bd6ba76f-1a8a-4d2a-9fc5-c3a8d2d8a025.png',
    icon: <Newspaper className="w-6 h-6" />,
    gradient: 'from-primary via-primary-dark to-secondary-teal-dark',
    tagline: 'Latest stories, updates and opportunities',
    cta: 'Read All News',
    ctaLink: '/news'
  },
  'Resources': {
    image: '/lovable-uploads/d39e9b7b-98b6-4d93-a4ef-5b769d75e5ff.png',
    icon: <BookOpen className="w-6 h-6" />,
    gradient: 'from-neutral-800 to-neutral-900',
    tagline: 'Publications, reports and legal toolkits',
    cta: 'Browse Library',
    ctaLink: '/publications'
  },
};

// Icons for sub-items
const subItemIcons: Record<string, React.ReactNode> = {
  'Who We Are': <Users className="w-4 h-4" />,
  'Our Vision & Mission': <Heart className="w-4 h-4" />,
  'Our Team': <Users className="w-4 h-4" />,
  'Partners & Donors': <Award className="w-4 h-4" />,
  'What We Do': <Target className="w-4 h-4" />,
  'Programs': <Target className="w-4 h-4" />,
  'Success Stories': <Heart className="w-4 h-4" />,
  'Impact Dashboard': <TrendingUp className="w-4 h-4" />,
  'News & Blog': <Newspaper className="w-4 h-4" />,
  'Opportunities': <Award className="w-4 h-4" />,
  'Publications & Reports': <FileText className="w-4 h-4" />,
  'Legal Resources': <BookOpen className="w-4 h-4" />,
  'Whistleblowing': <Shield className="w-4 h-4" />,
};

const NavigationDropdown = ({ item, isActive, onMouseEnter, onMouseLeave, className }: NavigationDropdownProps) => {
  const location = useLocation();
  const data = sectionData[item.name] || sectionData['About'];

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] rounded-2xl shadow-2xl bg-white border-2 border-neutral-200 transition-all duration-300 z-[60] overflow-hidden",
        isActive
          ? "opacity-100 visible translate-y-0 scale-100"
          : "opacity-0 invisible -translate-y-4 scale-95",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex">
        {/* Left side - Featured Image with overlay */}
        <div className="relative w-[220px] overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
            style={{ backgroundImage: `url(${data.image})` }}
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient}`} />

          {/* Content on image */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
            {/* Icon badge */}
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/40 shadow-lg">
              {data.icon}
            </div>

            {/* Section info */}
            <div>
              <h3 className="text-lg font-bold mb-2 font-heading drop-shadow-lg">{item.name}</h3>
              <p className="text-sm text-white leading-relaxed mb-4 drop-shadow-md">{data.tagline}</p>

              {/* CTA Button */}
              <Link
                to={data.ctaLink}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-white/90 transition-all hover:gap-3"
              >
                {data.cta}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Menu items */}
        <div className="flex-1 p-5">
          <div className="mb-3 pb-3 border-b border-neutral-100">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Explore {item.name}</p>
          </div>

          <div className="space-y-1">
            {item.subItems.map((subItem) => {
              const Icon = subItemIcons[subItem.name] || <Target className="w-4 h-4" />;
              const isSubActive = location.pathname === subItem.href;

              return (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className={cn(
                    "flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group",
                    isSubActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-neutral-50 text-neutral-700 hover:text-primary"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isSubActive
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-500 group-hover:bg-primary group-hover:text-white"
                  )}>
                    {Icon}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{subItem.name}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{subItem.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick contact footer */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Need assistance?</span>
              <Link to="/contact" className="text-primary font-semibold hover:underline flex items-center gap-1">
                Contact Us <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationDropdown;