// components/GovernanceSection.tsx
import Typography from '@/components/shared/Typography';
import { DesignIcon } from '../design-system';

const GovernanceSection = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-12 lg:px-24">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-primary/20">
          <DesignIcon
            icon={
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            }
            size="sm"
            className="mr-4"
          />
          <Typography
            variant="overline"
            className="font-bold text-lg tracking-widest"
          >
            GOVERNANCE & LEADERSHIP
          </Typography>
        </div>
        <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-4">
          The People Who Guide Our Vision
        </Typography>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          At the heart of LSF’s progress is a dedicated Board and Executive
          team, united by a shared vision to advance justice, equity, and legal
          empowerment across Tanzania.
        </p>
      </div>

      {/* Profiles */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Board Chairperson */}
        <div className="text-center md:text-left">
          <img
            src="/lovable-uploads/Board Chairperson.png"
            alt="Board Chairperson"
            width={250}
            height={250}
            className="mx-auto md:mx-0 rounded-full object-cover mb-6"
          />
          <Typography variant="h4" className="text-2xl font-semibold mb-2">
            Judge Robert Makaramba
          </Typography>
          <p className="text-primary font-medium mb-4">Board Chairperson</p>
          <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
            “Good governance is not just a principle, but a commitment to serve
            the most vulnerable. At LSF, we uphold integrity, transparency, and
            justice as the pillars of our work.”
          </blockquote>
        </div>

        {/* Executive Director */}
        <div className="text-center md:text-left">
          <img
            src="/lovable-uploads/lulu ng'wanakilala-LSF_Executive Director.png"
            alt="Executive Director"
            width={250}
            height={250}
            className="mx-auto md:mx-0 rounded-full object-cover mb-6"
          />
          <Typography variant="h4" className="text-2xl font-semibold mb-2">
            lulu ng'wanakilala
          </Typography>
          <p className="text-primary font-medium mb-4">Executive Director</p>
          <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
            “LSF’s impact is driven by strategy, powered by people, and rooted
            in justice. Our mission is to ensure that every voice is heard and
            every right protected.”
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default GovernanceSection;