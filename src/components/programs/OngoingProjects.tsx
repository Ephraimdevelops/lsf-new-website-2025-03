import { Smartphone, GraduationCap, Scale, CheckCircle, ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';

const OngoingProjects = () => {
  const projects = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Haki Yangu Digital Justice Project",
      description: "A tech-powered initiative promoting access to justice through digital tools like the Haki Yangu App, WhatsApp bots, IVR/USSD, and SMS paralegal referral systems.",
      highlights: [
        "50,000+ users accessed the app in 2024",
        "IVR reached low-literacy communities in 6 regions"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      status: "Active"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Legal Education in Schools",
      description: "Working with local partners to mainstream legal awareness into school clubs, youth campaigns, and civic education programs for both boys and girls.",
      highlights: [
        "Integrated into curriculum in 15+ schools",
        "Youth legal awareness clubs established"
      ],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      status: "Ongoing"
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Legal Aid Reform & Policy Dialogue Forums",
      description: "Contributed research and legal expertise to national-level dialogues that shaped Tanzania's legal aid policy framework and paralegal certification schemes.",
      highlights: [
        "Key contributions to Legal Aid Act development",
        "National paralegal certification framework designed"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      status: "Completed"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-50/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(147,30,92,0.02)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(89,181,176,0.02)_0%,transparent_40%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary-orange/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-neutral-200">
            <CheckCircle className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              ONGOING & PAST PROJECTS
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold">
            Building the
            <span className="block bg-gradient-to-r from-secondary-orange to-secondary-teal bg-clip-text text-transparent">
              Foundation for Change
            </span>
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Beyond our flagship programs, we implement targeted initiatives that strengthen Tanzania's justice ecosystem through technology, education, and policy reform.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className={`${project.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2`}>
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${project.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {project.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Active' ? 'bg-green-100 text-green-700' :
                    project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </div>
                </div>

                {/* Content */}
                <Typography variant="h4" className="text-xl font-bold mb-4 text-primary group-hover:text-secondary-teal transition-colors duration-300">
                  {project.title}
                </Typography>
                
                <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                  {project.description}
                </Typography>

                {/* Highlights */}
                <div className="space-y-3 mb-6">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary-teal mt-2 flex-shrink-0"></div>
                      <Typography variant="bodySmall" className="text-neutral-600 leading-relaxed">
                        {highlight}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <div className="flex items-center text-primary font-semibold text-sm group-hover:text-secondary-teal transition-colors duration-300 cursor-pointer">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Gradient bottom accent */}
              <div className={`h-1 bg-gradient-to-r ${project.color}`}></div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default OngoingProjects;