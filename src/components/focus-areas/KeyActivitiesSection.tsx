
import Container from '../shared/Container';
import Typography from '../shared/Typography';

interface KeyActivitiesSectionProps {
  keyActivities: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

const KeyActivitiesSection = ({ keyActivities, testimonial }: KeyActivitiesSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container size="xl">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-6 text-4xl md:text-5xl font-bold">
            How We Make Impact
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg">
            Our approach combines innovative methods and proven strategies to deliver meaningful results.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {keyActivities.map((activity, index) => {
            const [title, description] = activity.split(': ');
            return (
              <div key={index} className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary/30 rounded-2xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                </div>
                <Typography variant="h4" className="mb-3 text-primary">
                  {title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray leading-relaxed">
                  {description}
                </Typography>
              </div>
            );
          })}
        </div>

        {/* Testimonial Block */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-primary mb-8 italic">
              "{testimonial.quote}"
            </Typography>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/40 rounded-full"></div>
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">{testimonial.author}</div>
                <div className="text-neutral-gray">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default KeyActivitiesSection;
