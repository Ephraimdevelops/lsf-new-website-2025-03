import { MapPin, Users, Landmark } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';

const coverage = [
  { icon: <MapPin className="text-primary w-6 h-6" />, label: 'Regions Covered', value: 25 },
  { icon: <Users className="text-primary w-6 h-6" />, label: 'Paralegals Supported', value: 4300 },
  { icon: <Landmark className="text-primary w-6 h-6" />, label: 'Ward-Level Presence', value: 1300 },
];

export default function NationalReachSection() {
  return (
    <section className="relative py-24 bg-muted/20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Textual Content */}
          <div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our National Reach
            </Typography>
            <p className="text-muted-foreground mb-8 max-w-xl">
              With presence in over 25 regions and 1,300 wards across Tanzania, our paralegals and legal aid providers are making justice accessible in every corner.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coverage.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{item.value}+</h4>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Illustration */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border bg-background shadow-md">
            <iframe
              title="Tanzania Coverage Map"
              src="https://www.google.com/maps/d/embed?mid=1GhFqgZoE6dRgKbU_3OyU0FZbgYArEiY&hl=en"
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </Container>
    </section>
  );
}