import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { approachData } from '../data/approachData';
import ApproachHero from '../components/approaches/ApproachHero';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import NotFound from './NotFound';

const ApproachDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const approach = approachData.find(item => item.slug === slug);
  
  if (!approach) {
    return <NotFound />;
  }

  return (
    <Layout>
      <ApproachHero approach={approach} />
      
      {/* Overview */}
      <section id="overview" className="py-16 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Overview
            </Typography>
            <Typography variant="body" className="text-neutral-600 text-lg leading-relaxed">
              {approach.overview}
            </Typography>
          </div>
        </Container>
      </section>

      {/* Goals and Objectives */}
      <section className="py-16 bg-neutral-50">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Goals & Objectives
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approach.objectives.map((objective, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <objective.icon className="h-6 w-6 text-white" />
                    </div>
                    <Typography variant="h4" className="text-xl font-semibold text-neutral-900">
                      {objective.title}
                    </Typography>
                  </div>
                  <Typography variant="body" className="text-neutral-600">
                    {objective.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Key Activities */}
      <section className="py-16 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Key Activities
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approach.keyActivities.map((activity, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-secondary-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                    <activity.icon className="h-8 w-8 text-white" />
                  </div>
                  <Typography variant="h4" className="text-xl font-semibold text-neutral-900 mb-3">
                    {activity.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-600">
                    {activity.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Integration with Focus Areas */}
      <section className="py-16 bg-neutral-50">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Integration with Strategic Focus Areas
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approach.integration.map((area, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                  <Typography variant="h4" className="text-xl font-semibold text-primary mb-3">
                    {area.focusArea}
                  </Typography>
                  <Typography variant="body" className="text-neutral-600">
                    {area.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Flagship Projects */}
      <section className="py-16 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              Flagship Projects
            </Typography>
            
            <div className="space-y-8">
              {approach.flagshipProjects.map((project, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-8">
                  <Typography variant="h3" className="text-2xl font-bold text-neutral-900 mb-4">
                    {project.name}
                  </Typography>
                  <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                    {project.description}
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {project.outcomes.map((outcome, outcomeIndex) => (
                      <div key={outcomeIndex}>
                        <div className="text-2xl font-bold text-secondary-teal mb-2">{outcome.value}</div>
                        <div className="text-sm text-neutral-600 uppercase tracking-wide">{outcome.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-primary text-white">
        <Container size="xl">
          <div className="text-center">
            <Typography variant="h2" className="text-3xl font-bold mb-8 text-white">
              Achievements & Milestones
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {approach.achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{achievement.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wide mb-3">{achievement.metric}</div>
                  <div className="text-white/90">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* What's Next */}
      <section className="py-16 bg-neutral-50">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              What's Next
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {approach.whatsNext.map((initiative, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-neutral-200">
                  <Typography variant="h4" className="text-xl font-semibold text-neutral-900 mb-3">
                    {initiative.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-600 mb-4">
                    {initiative.description}
                  </Typography>
                  <div className="text-sm text-secondary-teal font-semibold">
                    Timeline: {initiative.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl font-bold text-neutral-900 mb-8">
              {approach.callToAction.title}
            </Typography>
            <Typography variant="body" className="text-neutral-600 text-lg leading-relaxed mb-8">
              {approach.callToAction.description}
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {approach.callToAction.buttons.map((button, index) => (
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

export default ApproachDetail;