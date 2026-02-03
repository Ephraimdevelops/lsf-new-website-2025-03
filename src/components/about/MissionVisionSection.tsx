import { Target, Eye, Scale, Heart, Shield } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const MissionVisionSection = () => {
  const values = [
    {
      icon: Scale,
      title: "Justice",
      description: "Equal access for all.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building local capacity.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "Systemic lasting change.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Complete accountability.",
    }
  ];

  return (
    <section className="min-h-[50vh] flex items-center py-10 bg-white relative overflow-hidden">
      {/* Decorative Background Elemets */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 transform translate-x-20 z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* LEFT: The Narrative (Compact Layout) */}
          <div className="flex-1 lg:w-1/2 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-4 py-1.5 mb-4 shadow-sm">
                <Target className="h-3.5 w-3.5" />
                <span className="font-bold text-xs uppercase tracking-widest">Our Compass</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                Driven by <span className="text-primary">Purpose.</span>
              </h2>
            </div>

            {/* Compact Mission & Vision Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Mission */}
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-primary/20 pl-3 group-hover:border-primary transition-colors duration-300">
                  To strengthen legal empowerment through strategic grants, capacity building, and advocacy for <span className="text-primary font-medium">equal access to justice.</span>
                </p>
              </div>

              {/* Vision */}
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-secondary-teal/10 rounded-lg text-secondary-teal">
                    <Eye className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-secondary-teal/20 pl-3 group-hover:border-secondary-teal transition-colors duration-300">
                  A Tanzania where every citizen has meaningful access to justice and can <span className="text-secondary-teal font-medium">claim their rights.</span>
                </p>
              </div>
            </div>

            {/* Values Strip - Compact */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              {values.map((v, i) => (
                <div key={i} className="flex flex-col items-start gap-1.5">
                  <v.icon className="h-4 w-4 text-gray-400" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">{v.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-tight">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: The Visual Anchor (Team Image) */}
          <div className="flex-1 lg:w-1/2 relative flex justify-end">
            <div className="relative">
              {/* Main Image */}
              <img
                src="/lovable-uploads/team-mission-group.png"
                alt="LSF Leadership Team"
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default MissionVisionSection;