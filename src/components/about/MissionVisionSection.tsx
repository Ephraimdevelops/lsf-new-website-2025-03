import { Target, Eye, Heart, Scale, Shield } from 'lucide-react';

const MissionVisionSection = () => {
  const values = [
    {
      icon: Scale,
      title: "Justice for All",
      description: "Every Tanzanian deserves equal access to legal protection and representation.",
    },
    {
      icon: Heart,
      title: "Community Empowerment",
      description: "Building local capacity and knowledge of legal rights in communities.",
    },
    {
      icon: Target,
      title: "Sustainable Impact",
      description: "Creating systemic change through partnerships and policy reform.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Operating with complete accountability in all our activities.",
    }
  ];

  return (
    <section className="py-16 bg-white">
      {/* Using same container as header for alignment with logo */}
      <div className="container mx-auto px-4">
        {/* Mission & Vision - Left Aligned */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <div>
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Mission</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Strengthening Legal Empowerment Across Tanzania
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-primary pl-6">
              To strengthen legal empowerment in Tanzania by providing strategic grants,
              building capacity, fostering partnerships, conducting research, and advocating
              for policy reforms that ensure equal access to justice for all, with particular
              focus on marginalized communities and women's rights.
            </p>
          </div>

          {/* Vision */}
          <div>
            <div className="inline-flex items-center gap-3 bg-secondary-teal text-white rounded-full px-6 py-2 mb-5">
              <Eye className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Vision</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              A Tanzania Where Justice is Accessible to All
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-secondary-teal pl-6">
              We envision a Tanzania where every citizen, regardless of their economic status,
              gender, or social background, has meaningful access to quality legal services
              and can effectively claim their rights within a responsive and accountable
              justice system.
            </p>
          </div>
        </div>



        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <value.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;