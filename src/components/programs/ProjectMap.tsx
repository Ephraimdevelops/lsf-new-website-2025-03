import { MapPin, Users, Target } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const ProjectMap = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(89,181,176,0.1)_0%,transparent_50%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <MapPin className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              NATIONWIDE REACH
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold text-white">
            Present in 26 Regions
          </Typography>
          <Typography variant="body" className="text-white/90 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
            Reaching Tanzania's urban, peri-urban, and rural communities through tailored interventions that meet people where they are.
          </Typography>
        </div>

        {/* Map Visual Placeholder */}
        <div className="relative mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
            {/* Map image placeholder */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl h-96 flex items-center justify-center border border-white/10">
              <div className="text-center">
                <MapPin className="h-24 w-24 text-secondary-orange mx-auto mb-4" />
                <Typography variant="h3" className="text-white mb-2">
                  Interactive Map Coming Soon
                </Typography>
                <Typography variant="body" className="text-white/70">
                  Detailed visualization of our regional impact and program coverage
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-orange to-secondary-orange/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <Typography variant="h3" className="text-3xl font-bold text-white mb-2">
              Urban Centers
            </Typography>
            <Typography variant="body" className="text-white/80">
              Dar es Salaam, Arusha, Mwanza, and other major cities
            </Typography>
          </div>

          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-teal to-secondary-teal/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <Typography variant="h3" className="text-3xl font-bold text-white mb-2">
              Peri-Urban Areas
            </Typography>
            <Typography variant="body" className="text-white/80">
              Growing communities on the edges of major cities
            </Typography>
          </div>

          <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-yellow to-secondary-yellow/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <Typography variant="h3" className="text-3xl font-bold text-white mb-2">
              Rural Villages
            </Typography>
            <Typography variant="body" className="text-white/80">
              Remote communities across all regions of Tanzania
            </Typography>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProjectMap;