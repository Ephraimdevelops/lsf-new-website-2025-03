import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { focusAreaData } from '../data/focusAreaData';
import FocusAreaHero from '../components/focus-areas/FocusAreaHero';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import NotFound from './NotFound';

const FocusAreaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const focusArea = focusAreaData.find(area => area.slug === slug);
  
  if (!focusArea) {
    return <NotFound />;
  }

  return (
    <Layout>
      <FocusAreaHero focusArea={focusArea} />
      
      {/* Why This Matters */}
      <section id="why-this-matters" className="py-16 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Why This Matters
            </Typography>
            <Typography variant="body" className="text-neutral-600 text-lg leading-relaxed mb-8">
              {focusArea.whyItMatters.overview}
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {focusArea.whyItMatters.statistics.map((stat, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-neutral-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-neutral-50">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Our Approach
            </Typography>
            <Typography variant="body" className="text-neutral-600 text-lg leading-relaxed mb-8">
              {focusArea.ourApproach.description}
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {focusArea.ourApproach.methods.map((method, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-xl font-semibold text-neutral-900">
                      {method.title}
                    </Typography>
                  </div>
                  <Typography variant="body" className="text-neutral-600">
                    {method.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Featured Projects
            </Typography>
            
            <div className="space-y-8">
              {focusArea.featuredProjects.map((project, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-8">
                  <Typography variant="h3" className="text-2xl font-bold text-neutral-900 mb-4">
                    {project.name}
                  </Typography>
                  <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                    {project.description}
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-secondary-teal mb-2">{project.regions}</div>
                      <div className="text-sm text-neutral-600 uppercase tracking-wide">Regions Covered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-orange mb-2">{project.beneficiaries}</div>
                      <div className="text-sm text-neutral-600 uppercase tracking-wide">Direct Beneficiaries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-yellow mb-2">{project.outcome}</div>
                      <div className="text-sm text-neutral-600 uppercase tracking-wide">Key Outcome</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-primary text-white">
        <Container size="xl">
          <div className="text-center">
            <Typography variant="h2" className="text-3xl font-bold mb-8 text-white">
              Impact Achieved
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {focusArea.impact.metrics.map((metric, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{metric.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wide">{metric.label}</div>
                </div>
              ))}
            </div>
            
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-xl italic mb-6">
                "{focusArea.impact.testimonial.quote}"
              </blockquote>
              <cite className="text-white/80">
                — {focusArea.impact.testimonial.author}, {focusArea.impact.testimonial.title}
              </cite>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-neutral-50">
        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              {focusArea.callToAction.title}
            </Typography>
            <Typography variant="body" className="text-neutral-600 text-lg leading-relaxed mb-8">
              {focusArea.callToAction.description}
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {focusArea.callToAction.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`px-8 py-4 rounded-lg font-semibold transition-colors duration-200 ${
                    button.variant === 'primary' 
                      ? 'bg-primary hover:bg-primary-dark text-white'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default FocusAreaDetail;
