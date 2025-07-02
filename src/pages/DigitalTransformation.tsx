import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import { Smartphone, Database, Users, BarChart, Zap, Globe } from 'lucide-react';

const DigitalTransformation = () => {
  const focusArea = {
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    subtitle: 'Modernizing legal aid through innovation and technology',
    description: 'LSF is embracing innovation to modernize operations and expand its reach through digitalization of legal aid service delivery, case tracking, training, and data systems to enhance accessibility, transparency, and responsiveness.',
    heroImage: '/lovable-uploads/background with mother umage .png',
    whyItMatters: {
      overview: 'Digital transformation is essential for expanding the reach and efficiency of legal aid services. By leveraging technology, we can overcome geographic barriers, streamline operations, and provide more accessible and transparent services to communities in need.',
      statistics: [
        { value: '60%', description: 'improvement in case processing time through digital systems' },
        { value: '3x', description: 'increase in service reach through digital platforms' },
        { value: '85%', description: 'user satisfaction with digital legal aid tools' },
        { value: '40%', description: 'reduction in operational costs through automation' }
      ]
    },
    ourApproach: {
      description: 'Our digital transformation strategy focuses on creating user-friendly, accessible technology solutions that enhance service delivery while maintaining the human-centered approach that defines quality legal aid.',
      methods: [
        {
          icon: Smartphone,
          title: 'Mobile Legal Platforms',
          description: 'Developing mobile applications that provide legal information, guidance, and connection to services directly on smartphones.'
        },
        {
          icon: Database,
          title: 'Digital Case Management',
          description: 'Implementing comprehensive case tracking and management systems to improve efficiency and transparency.'
        },
        {
          icon: Users,
          title: 'Virtual Training Systems',
          description: 'Creating online training platforms for paralegals and legal aid providers to enhance capacity building.'
        },
        {
          icon: BarChart,
          title: 'Data Analytics',
          description: 'Utilizing data systems to track impact, identify trends, and inform evidence-based decision making.'
        }
      ]
    },
    featuredProjects: [
      {
        name: 'Haki Digital Platform',
        description: 'Comprehensive digital platform providing legal information, case tracking, and connection to legal aid services through mobile and web applications.',
        regions: '26',
        beneficiaries: '50,000+',
        outcome: '90% User Adoption'
      },
      {
        name: 'Paralegal Training App',
        description: 'Mobile application providing interactive training modules for community paralegals with certification tracking and continuing education.',
        regions: '20',
        beneficiaries: '2,500+',
        outcome: '95% Completion Rate'
      }
    ],
    impact: {
      metrics: [
        { value: '75,000+', label: 'Digital Users' },
        { value: '15,000+', label: 'Cases Digitized' },
        { value: '500+', label: 'Trained Digitally' },
        { value: '26', label: 'Regions Connected' }
      ],
      testimonial: {
        quote: 'The mobile legal aid app has been a game-changer for our community. We can now access legal information and submit cases from our village without traveling to the city.',
        author: 'Joseph Mwalimu',
        title: 'Community Paralegal, Mwanza Region'
      }
    },
    callToAction: {
      title: 'Embrace Digital Legal Innovation',
      description: 'Join us in leveraging technology to make legal aid more accessible, efficient, and impactful for communities across Tanzania.',
      buttons: [
        { text: 'Explore Digital Tools', link: '/resources', variant: 'primary' as const },
        { text: 'Partner with Us', link: '/contact', variant: 'secondary' as const }
      ]
    }
  };
  
  useEffect(() => {
    document.title = 'Digital Transformation - Legal Services Facility';
  }, []);

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      {/* Why This Matters */}
      <section id="why-this-matters" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Why This Matters
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {focusArea.whyItMatters.overview}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {focusArea.whyItMatters.statistics.map((stat, index) => (
              <div key={index} className="bg-muted rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Our Approach
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {focusArea.ourApproach.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {focusArea.ourApproach.methods.map((method, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <method.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {method.title}
                  </h4>
                </div>
                <p className="text-muted-foreground">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Featured Projects
          </h2>
          
          <div className="space-y-8">
            {focusArea.featuredProjects.map((project, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {project.name}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-secondary mb-2">{project.regions}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Regions Covered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-2">{project.beneficiaries}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Direct Beneficiaries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-2">{project.outcome}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Key Outcome</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">
              Impact Achieved
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {focusArea.impact.metrics.map((metric, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{metric.value}</div>
                  <div className="text-primary-foreground/80 text-sm uppercase tracking-wide">{metric.label}</div>
                </div>
              ))}
            </div>
            
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-xl italic mb-6">
                "{focusArea.impact.testimonial.quote}"
              </blockquote>
              <cite className="text-primary-foreground/80">
                — {focusArea.impact.testimonial.author}, {focusArea.impact.testimonial.title}
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {focusArea.callToAction.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {focusArea.callToAction.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {focusArea.callToAction.buttons.map((button, index) => (
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

export default DigitalTransformation;