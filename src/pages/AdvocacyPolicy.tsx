import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ApproachHero from '../components/approaches/ApproachHero';
import { Megaphone, Scale, FileText, Users, Gavel, Building2 } from 'lucide-react';

const AdvocacyPolicy = () => {
  const approach = {
    slug: 'advocacy-policy',
    title: 'Advocacy and Policy Influence',
    subtitle: 'Shaping Tanzania\'s access to justice landscape through strategic advocacy',
    description: 'LSF has played a pivotal role in shaping Tanzania\'s access to justice landscape, notably championing the Legal Aid Act and spearheading the Mama Samia Legal Aid Campaign.',
    heroImage: '/lovable-uploads/background with mother umage .png',
    overview: 'LSF has played a pivotal role in shaping Tanzania\'s access to justice landscape. Notably, the organization championed the development and enactment of the Legal Aid Act and its accompanying regulations, establishing a national framework for legal aid provision. LSF also spearheaded the Mama Samia Legal Aid Campaign, a nationwide initiative that operationalizes the Act and fosters coordinated stakeholder engagement in expanding legal empowerment.',
    objectives: [
      {
        icon: Scale,
        title: 'Policy Development',
        description: 'Champion the development of progressive legal frameworks that enhance access to justice for all Tanzanians.'
      },
      {
        icon: Megaphone,
        title: 'Strategic Advocacy',
        description: 'Influence policy decisions through evidence-based advocacy and strategic stakeholder engagement.'
      },
      {
        icon: Users,
        title: 'Coalition Building',
        description: 'Foster collaborative approaches among civil society, government, and development partners.'
      },
      {
        icon: Gavel,
        title: 'Implementation Support',
        description: 'Support the effective implementation of progressive legal and policy reforms.'
      }
    ],
    keyActivities: [
      {
        icon: FileText,
        title: 'Policy Research & Analysis',
        description: 'Conducting comprehensive research to inform evidence-based policy recommendations and advocacy strategies.'
      },
      {
        icon: Users,
        title: 'Stakeholder Engagement',
        description: 'Facilitating multi-stakeholder dialogues and building coalitions for justice sector reforms.'
      },
      {
        icon: Building2,
        title: 'Campaign Implementation',
        description: 'Leading national campaigns to raise awareness and build support for key policy initiatives.'
      }
    ],
    integration: [
      {
        focusArea: 'Accessible Legal Aid Services',
        description: 'Policy advocacy ensures legal frameworks support accessible and quality legal aid service delivery.'
      },
      {
        focusArea: 'Empowered Communities',
        description: 'Advocacy efforts promote policies that strengthen community legal empowerment and participation.'
      },
      {
        focusArea: 'Conducive Environment',
        description: 'Core focus on creating enabling policy environments for sustainable access to justice.'
      },
      {
        focusArea: 'Institutional Development',
        description: 'Policy work supports the development of strong institutions for justice delivery.'
      }
    ],
    flagshipProjects: [
      {
        name: 'Legal Aid Act Development',
        description: 'Championed the development and enactment of Tanzania\'s comprehensive Legal Aid Act, establishing a national framework for legal aid provision.',
        outcomes: [
          { value: '100%', label: 'Parliamentary Approval' },
          { value: '26', label: 'Regions Covered' },
          { value: '50M+', label: 'Citizens Benefited' }
        ]
      },
      {
        name: 'Mama Samia Legal Aid Campaign',
        description: 'Nationwide initiative operationalizing the Legal Aid Act and fostering coordinated stakeholder engagement in expanding legal empowerment.',
        outcomes: [
          { value: '200+', label: 'Stakeholders Engaged' },
          { value: '26', label: 'Regions Reached' },
          { value: '85%', label: 'Awareness Increase' }
        ]
      }
    ],
    achievements: [
      {
        value: '1',
        metric: 'National Legal Framework',
        description: 'Successfully advocated for the Legal Aid Act, establishing a national framework'
      },
      {
        value: '15+',
        metric: 'Policy Reforms',
        description: 'Influenced key policy reforms improving access to justice'
      },
      {
        value: '500+',
        metric: 'Stakeholders Engaged',
        description: 'Built extensive networks of advocates for justice reform'
      }
    ],
    whatsNext: [
      {
        title: 'Legal Aid Act Implementation',
        description: 'Supporting full implementation of the Legal Aid Act across all regions of Tanzania.',
        timeline: '2024-2026'
      },
      {
        title: 'Gender Justice Policies',
        description: 'Advocating for enhanced legal frameworks addressing gender-based violence and women\'s rights.',
        timeline: '2024-2025'
      },
      {
        title: 'Climate Justice Legal Framework',
        description: 'Developing policy recommendations for climate justice and environmental rights protection.',
        timeline: '2025-2027'
      },
      {
        title: 'Digital Rights Advocacy',
        description: 'Promoting policies that protect digital rights and enhance online access to justice.',
        timeline: '2025-2028'
      }
    ],
    callToAction: {
      title: 'Join Our Advocacy Efforts',
      description: 'Partner with us to shape policies that advance access to justice and legal empowerment for all Tanzanians.',
      buttons: [
        { text: 'Get Involved in Advocacy', link: '/opportunities', variant: 'primary' as const },
        { text: 'View Policy Resources', link: '/resources', variant: 'secondary' as const }
      ]
    }
  };
  
  useEffect(() => {
    document.title = 'Advocacy and Policy Influence - Legal Services Facility';
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

export default AdvocacyPolicy;