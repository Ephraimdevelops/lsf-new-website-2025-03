
import { Download, Video, ExternalLink, Heart } from 'lucide-react';
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import { Button } from '../ui/button';

interface ResourcesSectionProps {
  resources: { title: string; type: string; link: string }[];
}

const ResourcesSection = ({ resources }: ResourcesSectionProps) => {
  return (
    <section className="py-16 bg-neutral-light">
      <Container size="xl">
        <div className="text-center mb-12">
          <Typography variant="h2" className="mb-6">
            Resources & Tools
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
            Access our comprehensive collection of guides, toolkits, and resources to support your journey.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-secondary-teal/20 rounded-2xl flex items-center justify-center mb-6">
                {resource.type === 'PDF' ? <Download className="h-8 w-8 text-secondary-teal" /> :
                 resource.type === 'Video Guide' ? <Video className="h-8 w-8 text-secondary-teal" /> :
                 <ExternalLink className="h-8 w-8 text-secondary-teal" />}
              </div>
              <Typography variant="h4" className="mb-3">
                {resource.title}
              </Typography>
              <Typography variant="body" className="text-neutral-gray mb-6">
                {resource.type}
              </Typography>
              <Button className="w-full bg-secondary-teal hover:bg-secondary-teal/90 text-white">
                Access Resource
              </Button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-secondary-orange/20 to-secondary-teal/20 rounded-3xl p-8 md:p-12">
            <Heart className="h-16 w-16 text-secondary-orange mx-auto mb-6" />
            <Typography variant="h2" className="mb-6">
              Get Involved in This Focus Area
            </Typography>
            <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
              Join our mission to strengthen this critical area of our work. Whether you need help or want to contribute, we welcome your participation.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                Find Help Near You
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ResourcesSection;
