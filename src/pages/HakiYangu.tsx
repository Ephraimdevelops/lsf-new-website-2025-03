import { useRef } from 'react';
import {
  ArrowDown, Shield, Smartphone, MessageCircle,
  Globe, Users, Award, TrendingUp, CheckCircle2,
  Lock, Zap, Scale, Heart
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import HakiYanguChatbot from '@/components/haki-yangu/HakiYanguChatbot';
import HakiYanguAppSection from '@/components/legal-help/HakiYanguAppSection';

const HakiYangu = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* 1. HERO SECTION - Massive, Impactful, Program Detail Style */}
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background - Dark Overlay over Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/haki yangu app uzinuzi.webp"
            alt="Haki Yangu Digital Justice"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-black/60" />
        </div>

        <Container className="relative z-10 text-white">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Shield className="w-4 h-4 text-secondary-teal" />
              <span className="text-sm font-bold uppercase tracking-wider">LSF Flagship Innovation</span>
            </div>

            <Typography variant="h1" className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              The Digital Scale <br />
              <span className="text-secondary-teal">of Justice.</span>
            </Typography>

            <Typography variant="bodyLarge" className="text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              We are closing the justice gap by putting a paralegal in every pocket. Haki Yangu is Tanzania's first comprehensive digital legal aid platform.
            </Typography>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={scrollToContent}
                className="bg-white text-primary hover:bg-gray-100 h-14 px-8 rounded-full font-bold text-lg"
              >
                Explore the Platform
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary h-14 px-8 rounded-full font-bold text-lg bg-transparent"
              >
                Download App
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div ref={contentRef}>
        {/* 2. THE CHALLENGE - "Why Digital?" */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Typography variant="label" className="text-primary mb-4 block">The Challenge</Typography>
                <Typography variant="h2" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Justice Delayed is Justice Denied.
                </Typography>
                <div className="w-20 h-2 bg-secondary-teal rounded-full mb-8"></div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  For millions of Tanzanians, especially women in rural areas, the formal justice system is geographically distant, financially impossible, and culturally intimidating.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">The Distance Gap</h4>
                    <p className="text-gray-600">The nearest primary court is often over 50km away for rural residents.</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">The Privacy Barrier</h4>
                    <p className="text-gray-600">Stigma prevents victims of GBV from walking into public police stations.</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">The Information Void</h4>
                    <p className="text-gray-600">Complex legal language makes laws inaccessible to the average citizen.</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. THE SOLUTION - Reuse Components */}
        <div className="bg-gray-50 py-10">
          <Container>
            <div className="text-center mb-10">
              <Typography variant="label" className="text-primary mb-2 block">The Solution</Typography>
              <Typography variant="h2" className="text-4xl font-bold">A Multi-Channel Approach</Typography>
            </div>
          </Container>

          {/* Mobile App */}
          <HakiYanguAppSection />

          {/* WhatsApp Bot */}
          <HakiYanguChatbot />
        </div>

        {/* 4. IMPACT DASHBOARD - "By the Numbers" */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10 bg-cover bg-center" />
          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <Typography variant="h2" className="text-4xl lg:text-5xl font-bold mb-6">
                  Real Impact, Real Time.
                </Typography>
                <p className="text-xl text-white/80">
                  Since its launch, Haki Yangu has transformed from a pilot project into a national lifeline.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-black text-secondary-teal mb-2">50k+</div>
                  <div className="text-lg font-medium opacity-80">Downloads & Users</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-secondary-teal mb-2">1,200</div>
                  <div className="text-lg font-medium opacity-80">Cases Reported</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-secondary-teal mb-2">24/7</div>
                  <div className="text-lg font-medium opacity-80">Availability</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-secondary-teal mb-2">100%</div>
                  <div className="text-lg font-medium opacity-80">Privacy Guaranteed</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. CASE STUDY - "The Human Story" */}
        <section className="py-24 bg-white">
          <Container>
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <Typography variant="label" className="text-primary mb-4 block">Case Study</Typography>
                  <h3 className="text-3xl font-bold mb-6">"I was afraid to speak, until I could do it silently."</h3>
                  <div className="space-y-6 text-gray-600">
                    <p>
                      Maria (not her real name), a 24-year-old in Dodoma, was facing harassment from her employer but feared losing her job if she reported it publicly.
                    </p>
                    <p>
                      Using the Haki Yangu App, she submitted an anonymous report detailing the incidents. The report was instantly routed to an LSF-verified paralegal in her ward.
                    </p>
                    <p>
                      Within 48 hours, the paralegal intervened. The harassment stopped, and Maria kept her job. She never had to step foot in a courtroom.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                      <p className="font-bold text-gray-900">Maria S.</p>
                      <p className="text-sm text-gray-500">Dodoma, Tanzania</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="aspect-square rounded-2xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&fit=crop"
                      alt="Empowered Woman"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white w-full">
                        <p className="font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          Case Resolved
                        </p>
                        <p className="text-xs opacity-80">Duration: 48 Hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
};

export default HakiYangu;
