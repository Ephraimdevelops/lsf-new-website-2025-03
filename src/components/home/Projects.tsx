
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Award, MapPin, Calendar, DollarSign } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 'sauti-ya-mwanamke',
      title: 'Sauti ya Mwanamke',
      subtitle: 'Improved Access to Justice for Women in Tanzania',
      description: 'LSF\'s flagship gender justice initiative under the EU\'s Gender Transformative Action Programme, empowering women and girls to claim their rights and access justice mechanisms.',
      donor: 'European Union (via Enabel)',
      duration: 'Ongoing since 2023',
      region: 'National coverage',
      image: '/lovable-uploads/b2226752-4a54-463b-af38-a1dd2b57350b.png',
      stats: [
        { value: '26,451', label: 'People Accessed Legal Aid', subtext: '59% women' },
        { value: '7.6M', label: 'People Reached', subtext: 'Legal awareness campaigns' },
        { value: '6,825', label: 'GBV Cases Addressed', subtext: '75% reported by women' }
      ],
      highlights: [
        'TZS 1.649 billion in women\'s assets reclaimed',
        '4,406 formal and informal leaders trained',
        '2,021 women/girls assisted in prisons and police stations'
      ]
    },
    {
      id: 'wanawake-tunaweza',
      title: 'Wanawake Tunaweza',
      subtitle: 'Empowering Maasai Women in Longido District',
      description: 'Culturally sensitive and community-driven solutions to empower Maasai women and girls, addressing education barriers, gender inequality, and harmful traditions.',
      donor: 'North South Cooperation',
      duration: 'Ongoing since 2023',
      region: 'Longido District',
      image: '/lovable-uploads/2fad14c5-c506-4c5b-8fd7-3e97e956e966.png',
      stats: [
        { value: '97.6%', label: 'Girls in SRHR Training', subtext: 'And school clubs' },
        { value: '88%', label: 'Improved School Attendance', subtext: 'For girls' },
        { value: '87.3%', label: 'Reduction Observed', subtext: 'In FGM and early marriage' }
      ],
      highlights: [
        '2 dormitories constructed at secondary schools',
        '11 women\'s cooperatives with TZS 2M startup capital',
        '90.7% of women report increased household income'
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[45px] font-black leading-[47.7px] text-[#231f20] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Our Impactful Interventions
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-black max-w-4xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Transformative projects that expand access to justice for women, girls, and marginalized communities across Tanzania through grassroots legal aid, policy advocacy, and rights education.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Project badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded">
                    Active Project
                  </span>
                </div>
                
                {/* Donor info */}
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center text-sm">
                    <DollarSign size={14} className="mr-1" />
                    {project.donor}
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={16} className="text-secondary-teal" />
                  <span className="text-sm text-gray-600">{project.region}</span>
                  <Calendar size={16} className="text-secondary-orange ml-auto" />
                  <span className="text-sm text-gray-600">{project.duration}</span>
                </div>

                <h3 className="text-2xl font-bold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <h4 className="text-lg text-secondary-teal font-semibold mb-3">
                  {project.subtitle}
                </h4>
                
                <p className="text-neutral-gray text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {project.stats.map((stat, idx) => (
                    <div key={idx} className="text-center bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-gray-600 leading-tight">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.subtext}</div>
                    </div>
                  ))}
                </div>

                {/* Key Highlights */}
                <div className="mb-4">
                  <h5 className="font-semibold text-sm text-neutral-dark mb-2">Key Achievements:</h5>
                  <ul className="space-y-1">
                    {project.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <Award size={12} className="text-secondary-orange mr-2 mt-0.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link 
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg font-semibold transition-colors text-sm w-full justify-center"
                >
                  Read Full Project Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore All Our Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
