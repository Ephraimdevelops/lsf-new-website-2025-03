import { ArrowRight, Scale, GraduationCap, Heart, FileText, Building, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const StrategicFocusAreasSection = () => {
  const focusAreas = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Expanding Access to Quality Legal Aid",
      description: "We support and scale access to affordable, high-quality legal aid services, prioritizing rural areas, women, and underserved populations.",
      stats: [
        "426,000+ direct legal aid beneficiaries",
        "105,000+ supported legal service providers"
      ],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/accessible-legal-aid",
      cta: "Explore This Focus Area"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Advancing Legal Empowerment",
      description: "We increase legal literacy and community-level rights awareness, enabling individuals to advocate for themselves and others.",
      stats: [
        "39.8 million+ reached through legal education",
        "Legal clubs, dialogues, and paralegal outreach"
      ],
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/empowered-communities",
      cta: "Learn About Legal Empowerment"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Strengthening Gender Justice",
      description: "We fight gender-based violence, promote women's rights, and elevate gender equality in law and practice.",
      stats: [
        "Sauti ya Mwanamke: multi-region women's justice program",
        "Survivors supported through legal and psychosocial services"
      ],
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop&crop=faces",
      color: "from-primary to-primary-dark",
      link: "/gender-justice-resources",
      cta: "Dive into Gender Justice Work"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Supporting Policy and Legal Reform",
      description: "We engage lawmakers and policymakers to review, reform, and align laws with justice and human rights standards.",
      stats: [
        "Engaged in constitutional review and criminal code reforms",
        "Drafted/Influenced key gender and legal aid policies"
      ],
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/policy-advocacy",
      cta: "See Our Policy Influence"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Building Sustainable Justice Systems",
      description: "We invest in institutional capacity—strengthening paralegal units, CSOs, and LSF itself to ensure long-term legal aid delivery.",
      stats: [
        "Toolkits, capacity building, and sustainability audits",
        "Monitoring and evaluation of legal aid systems"
      ],
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop&crop=faces",
      color: "from-green-500 to-green-600",
      link: "/institutional-development",
      cta: "Learn How We Build Sustainability"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Promoting Inclusive Innovation",
      description: "We develop and scale digital justice solutions to ensure no one is left behind—especially youth, people with disabilities, and women in tech deserts.",
      stats: [
        "Haki Yangu App + WhatsApp bots",
        "Legal aid via IVR, SMS & USSD codes"
      ],
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop&crop=faces",
      color: "from-purple-500 to-purple-600",
      link: "/digital-transformation",
      cta: "Discover Inclusive Legal Innovation"
    }
  ];

  return (
    <section id="focus-areas" className="py-20 bg-gradient-to-br from-neutral-50 via-white to-neutral-50/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(147,30,92,0.02)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(89,181,176,0.02)_0%,transparent_40%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary-orange/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8">
            <Building className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              WHERE WE FOCUS
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            Expanding Strategic
            <span className="block bg-gradient-to-r from-secondary-orange to-secondary-teal bg-clip-text text-transparent">
              Focus Areas
            </span>
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed">
            Our expanded Strategic Focus Areas align with Tanzania's legal development needs and global justice goals. Each area represents a priority theme where we deliver structured, scalable impact.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {focusAreas.map((area, index) => (
            <Card key={index} className="group overflow-hidden bg-white hover:scale-[1.01] transition-all duration-300 border-0 shadow-sm hover:shadow-lg">
              <div className="flex gap-6 p-8">
                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {area.icon}
                    </div>
                    <div className="text-3xl font-black text-neutral-100">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <Typography variant="h4" className="text-xl font-bold mb-4 text-primary group-hover:text-secondary-teal transition-colors duration-300">
                    {area.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                    {area.description}
                  </Typography>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    {area.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <TrendingUp className="h-3 w-3 text-primary" />
                        </div>
                        <Typography variant="bodySmall" className="text-neutral-600 leading-relaxed font-medium">
                          {stat}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <Link to={area.link}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary-teal font-semibold group-hover:translate-x-2 transition-all duration-300 flex items-center">
                      {area.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>

                {/* Image Section */}
                <div className="w-32 h-32 flex-shrink-0">
                  <div className="relative group/image">
                    <div className={`absolute inset-0 bg-gradient-to-br ${area.color} rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300`}></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img 
                        src={area.image} 
                        alt={area.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${area.color} opacity-20`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StrategicFocusAreasSection;