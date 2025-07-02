import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import { focusAreaData } from '../data/focusAreaData';
import NotFound from './NotFound';

const InstitutionalDevelopment = () => {
  const focusArea = focusAreaData.find(area => area.slug === 'institutional-development');
  
  useEffect(() => {
    document.title = 'Institutional Development - Legal Services Facility';
  }, []);
  
  if (!focusArea) {
    return <NotFound />;
  }

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

export default InstitutionalDevelopment;