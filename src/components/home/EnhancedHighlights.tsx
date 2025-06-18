
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Scale, Heart, MapPin, TrendingUp, Award } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

const highlights = [
  {
    id: 1,
    title: "Mobile Legal Clinics",
    description: "Bringing justice directly to remote communities across Tanzania through our innovative mobile clinic program.",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    icon: <MapPin className="h-8 w-8" />,
    stats: { number: 200, label: "Communities Reached", suffix: "+" },
    category: "Access to Justice",
    link: "/what-we-do",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Women's Legal Empowerment",
    description: "Empowering women with knowledge of their rights and providing legal support for gender-based issues.",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    icon: <Heart className="h-8 w-8" />,
    stats: { number: 5247, label: "Women Empowered" },
    category: "Women's Rights",
    link: "/focus-areas/gender-justice",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 3,
    title: "Digital Innovation",
    description: "Leveraging technology to connect communities with legal resources through our digital platforms.",
    image: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png",
    icon: <TrendingUp className="h-8 w-8" />,
    stats: { number: 15000, label: "Digital Users", suffix: "+" },
    category: "Innovation",
    link: "/what-we-do",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    title: "Community Training",
    description: "Building local capacity through comprehensive training programs for paralegals and community leaders.",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    icon: <Users className="h-8 w-8" />,
    stats: { number: 1200, label: "Trained Leaders", suffix: "+" },
    category: "Capacity Building",
    link: "/what-we-do",
    color: "from-purple-500 to-purple-600"
  }
];

const impactStats = [
  { number: 50000, label: "Lives Transformed", suffix: "+" },
  { number: 25, label: "Regions Covered" },
  { number: 15, label: "Years of Impact" },
  { number: 100, label: "Free Services", suffix: "%" }
];

const EnhancedHighlights = () => {
  return (
    <Container size="xl">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
          <Award className="h-6 w-6 mr-3 text-primary" />
          <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
            OUR IMPACT HIGHLIGHTS
          </Typography>
        </div>
        <Typography variant="display" className="mb-8 font-heading text-5xl lg:text-6xl">
          Transforming Lives
          <span className="block text-secondary-orange">Across Tanzania</span>
        </Typography>
        <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
          From remote villages to urban centers, our comprehensive approach to legal empowerment 
          is creating lasting change in communities across all 25 regions of Tanzania.
        </Typography>
      </div>

      {/* Impact Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {impactStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedCounter
                  end={stat.number}
                  suffix={stat.suffix || ''}
                  duration={2000}
                />
              </div>
              <Typography variant="body" className="text-neutral-gray font-medium">
                {stat.label}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {highlights.map((highlight, index) => (
          <Card 
            key={highlight.id} 
            variant="elevated" 
            hover
            className="group overflow-hidden h-full"
            padding="sm"
          >
            <Link to={highlight.link} className="block h-full">
              {/* Image Section */}
              <div className="relative h-64 mb-6 overflow-hidden rounded-xl">
                <img 
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`bg-gradient-to-r ${highlight.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                    {highlight.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <div className="text-white">
                    {highlight.icon}
                  </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl font-bold">
                    <AnimatedCounter
                      end={highlight.stats.number}
                      suffix={highlight.stats.suffix || ''}
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm opacity-90">{highlight.stats.label}</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <Typography variant="h3" className="mb-4 group-hover:text-primary transition-colors duration-300 text-2xl">
                  {highlight.title}
                </Typography>
                
                <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                  {highlight.description}
                </Typography>
                
                <div className="flex items-center text-primary font-semibold group-hover:text-primary-dark transition-colors">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card variant="elevated" className="bg-gradient-to-r from-primary to-primary-dark text-white p-12">
          <Typography variant="h2" className="mb-6 text-white text-4xl">
            Join Our Mission for Justice
          </Typography>
          <Typography variant="body" className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Every community deserves access to justice. Partner with us to expand legal empowerment across Tanzania.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-secondary-orange hover:bg-secondary-orange/90 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Involved
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
            <Link 
              to="/what-we-do"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
            >
              <Scale className="mr-3 h-5 w-5" />
              Our Programs
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default EnhancedHighlights;
