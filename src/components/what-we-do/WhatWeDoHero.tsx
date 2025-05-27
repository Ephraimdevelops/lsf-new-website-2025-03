
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const WhatWeDoHero = () => {
  return (
    <Section variant="gradient" padding="xl">
      <Container size="xl">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Typography variant="display" className="text-white mb-6">
            What We Do
          </Typography>
          <Typography variant="body" className="text-white/90 text-xl max-w-3xl mx-auto">
            We advance access to justice across Tanzania through legal aid, community empowerment, 
            policy advocacy, and innovative digital solutions.
          </Typography>
        </div>
      </Container>
    </Section>
  );
};

export default WhatWeDoHero;
