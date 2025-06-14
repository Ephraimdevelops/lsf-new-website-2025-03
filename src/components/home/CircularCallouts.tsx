
import { Scale, Lightbulb, Users, Shield } from 'lucide-react';
import Container from '@/components/shared/Container';
import CircularImageCallout from '@/components/shared/CircularImageCallout';

const CircularCallouts = () => (
  <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
    {/* Background with subtle pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,.03)_0%,transparent_50%)] bg-[length:100px_100px]"></div>
    
    <Container size="xl" className="relative z-10">
      {/* Circular Callouts for Key Areas */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <CircularImageCallout
          image="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
          title="Legal Empowerment"
          description="Strengthening communities through legal knowledge and advocacy training."
          icon={<Scale className="h-12 w-12 text-secondary-orange" />}
          badge="Core Focus"
          link="/focus-areas/legal-empowerment"
          size="lg"
          overlay="primary"
        />
        
        <div className="flex flex-col items-center space-y-8">
          <CircularImageCallout
            image="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png"
            title="Digital Innovation"
            description="Technology solutions connecting communities to justice."
            icon={<Lightbulb className="h-8 w-8 text-secondary-teal" />}
            badge="Innovation"
            link="/focus-areas/digital-innovation"
            size="md"
            overlay="secondary"
          />
          
          <CircularImageCallout
            image="/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png"
            title="Community Networks"
            description="Building local capacity for sustainable change."
            icon={<Users className="h-8 w-8 text-primary" />}
            badge="Network"
            link="/what-we-do/capacity-building"
            size="md"
            overlay="light"
          />
        </div>
        
        <CircularImageCallout
          image="/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png"
          title="Policy Advocacy"
          description="Driving systemic change through strategic policy work."
          icon={<Shield className="h-12 w-12 text-secondary-orange" />}
          badge="Advocacy"
          link="/what-we-do/policy-advocacy"
          size="lg"
          overlay="dark"
        />
      </div>
    </Container>
  </section>
);

export default CircularCallouts;
