import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ApproachHero from '../components/approaches/ApproachHero';
import { Target, MapPin, Users, BarChart, Truck, Building } from 'lucide-react';

const DirectImplementation = () => {
  const approach = {
    slug: 'direct-implementation',
    title: 'Direct Project Implementation',
    subtitle: 'Leading transformative legal aid projects on the ground',
    description: 'Since 2023, LSF has strategically expanded its role to include direct project implementation, enhancing agility and impact through high-impact projects like "Sauti ya Mwanamke" and "Wanawake Tunaweza".',
    heroImage: '/lovable-uploads/background with mother umage .png',
    overview: 'Since 2023, the Legal Services Facility (LSF) has strategically expanded its role to include direct project implementation, enhancing agility and impact on the ground. We are currently implementing high-impact projects such as "Sauti ya Mwanamke", funded by the European Union through ENABEL, which strengthens women\'s access to justice and voice in governance, and "Wanawake Tunaweza", funded by North South Cooperation, which empowers women economically and legally, particularly in rural communities. These projects position LSF as both a capable fund manager and an implementer committed to transformative outcomes.',
    objectives: [
      {
        icon: Target,
        title: 'Strategic Implementation',
        description: 'Execute high-impact projects that demonstrate innovative approaches to legal aid delivery and community empowerment.'
      },
      {
        icon: Building,
        title: 'Organizational Agility',
        description: 'Develop internal capacity for rapid response to emerging justice needs and implementation opportunities.'
      },
      {
        icon: Users,
        title: 'Community-Centered Approach',
        description: 'Ensure all implementation efforts are grounded in community needs and participatory development principles.'
      },
      {
        icon: BarChart,
        title: 'Evidence-Based Results',
        description: 'Generate concrete evidence of impact to inform broader sector approaches and policy development.'
      }
    ],
    keyActivities: [
      {
        icon: MapPin,
        title: 'Direct Service Delivery',
        description: 'Implementing legal aid services directly in communities through mobile clinics, legal centers, and outreach programs.'
      },
      {
        icon: Users,
        title: 'Capacity Building',
        description: 'Training and supporting community paralegals, women leaders, and local organizations to sustain impact.'
      },
      {
        icon: Truck,
        title: 'Resource Mobilization',
        description: 'Securing funding and resources for sustainable implementation of transformative legal aid initiatives.'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid Services',
        description: 'Direct implementation projects create new models for delivering accessible legal aid, particularly in underserved areas.'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Implementation projects focus heavily on community empowerment, especially for women and marginalized groups.'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Projects demonstrate effective practices that inform policy recommendations and systemic improvements.'
      },
      {
        focusArea: 'Digital Transformation',
        description: 'Implementation incorporates innovative digital tools and platforms to enhance service delivery and accessibility.'
      }
    ],
    flagshipProjects: [
      {
        name: 'Sauti ya Mwanamke (Voice of Women)',
        description: 'EU-funded project through ENABEL strengthening women\'s access to justice and voice in governance across Tanzania.',
        outcomes: [
          { value: '15,000+', label: 'Women Empowered' },
          { value: '25', label: 'Districts Covered' },
          { value: '85%', label: 'Success Rate' }
        ]
      },
      {
        name: 'Wanawake Tunaweza (Women We Can)',
        description: 'North South Cooperation-funded initiative empowering women economically and legally, particularly in rural communities.',
        outcomes: [
          { value: '10,000+', label: 'Beneficiaries' },
          { value: '12', label: 'Rural Regions' },
          { value: '92%', label: 'Satisfaction Rate' }
        ]
      }
    ],
    achievements: [
      {
        value: '25,000+',
        metric: 'Direct Beneficiaries',
        description: 'People directly served through our implementation projects'
      },
      {
        value: '37',
        metric: 'Districts Reached',
        description: 'Geographic coverage across Tanzania through direct implementation'
      },
      {
        value: '2',
        metric: 'Major Projects',
        description: 'High-impact implementation projects currently active'
      }
    ],
    whatsNext: [
      {
        title: 'Scaling Successful Models',
        description: 'Expanding proven implementation approaches to additional regions and communities.',
        timeline: '2024-2025'
      },
      {
        title: 'Innovation Pilots',
        description: 'Testing new implementation methodologies and technologies for enhanced impact.',
        timeline: '2024-2026'
      },
      {
        title: 'Partnership Expansion',
        description: 'Developing new partnerships to support larger-scale implementation initiatives.',
        timeline: '2024-2027'
      },
      {
        title: 'Sustainability Framework',
        description: 'Creating systems for long-term sustainability of implementation outcomes.',
        timeline: '2025-2028'
      }
    ],
    callToAction: {
      title: 'Partner with Our Implementation Team',
      description: 'Join us in implementing transformative legal aid projects that create lasting change in communities across Tanzania.',
      buttons: [
        { text: 'Explore Implementation Opportunities', link: '/opportunities', variant: 'primary' as const },
        { text: 'Contact Our Team', link: '/contact', variant: 'secondary' as const }
      ]
    }
  };
  
  useEffect(() => {
    document.title = 'Direct Project Implementation - Legal Services Facility';
  }, []);

  return (
    <Layout>
      <ApproachHero approach={approach} />
      
      {/* Overview */}
      <section id="overview" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Overview
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {approach.overview}
          </p>
        </div>
      </section>

      {/* Goals and Objectives */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Goals & Objectives
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approach.objectives.map((objective, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <objective.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {objective.title}
                  </h4>
                </div>
                <p className="text-muted-foreground">
                  {objective.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Activities */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Key Activities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approach.keyActivities.map((activity, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <activity.icon className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">
                  {activity.title}
                </h4>
                <p className="text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration with Focus Areas */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Integration with Strategic Focus Areas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approach.integration.map((area, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <h4 className="text-xl font-semibold text-primary mb-3">
                  {area.focusArea}
                </h4>
                <p className="text-muted-foreground">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Projects */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Flagship Projects
          </h2>
          
          <div className="space-y-8">
            {approach.flagshipProjects.map((project, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {project.name}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.outcomes.map((outcome, outcomeIndex) => (
                    <div key={outcomeIndex}>
                      <div className="text-2xl font-bold text-secondary mb-2">{outcome.value}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wide">{outcome.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">
              Achievements & Milestones
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {approach.achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{achievement.value}</div>
                  <div className="text-primary-foreground/80 text-sm uppercase tracking-wide mb-3">{achievement.metric}</div>
                  <div className="text-primary-foreground/90">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            What's Next
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {approach.whatsNext.map((initiative, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <h4 className="text-xl font-semibold text-foreground mb-3">
                  {initiative.title}
                </h4>
                <p className="text-muted-foreground mb-4">
                  {initiative.description}
                </p>
                <div className="text-sm text-secondary font-semibold">
                  Timeline: {initiative.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {approach.callToAction.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {approach.callToAction.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {approach.callToAction.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`px-8 py-4 rounded-lg font-semibold transition-colors duration-200 ${
                    button.variant === 'primary' 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DirectImplementation;