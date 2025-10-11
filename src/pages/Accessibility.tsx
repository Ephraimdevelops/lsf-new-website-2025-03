import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Accessibility, Eye, Ear, MousePointer, Keyboard } from 'lucide-react';

const Accessibility = () => {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background">
        <Container size="2xl">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <Accessibility className="h-6 w-6 text-primary" />
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  Accessibility Statement
                </Typography>
              </div>
              
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Accessibility Statement
              </Typography>
              
              <Typography variant="body" className="text-xl text-muted-foreground leading-relaxed">
                We are committed to ensuring digital accessibility for all users. Our website is designed to be inclusive and usable by people with diverse abilities and needs.
              </Typography>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-neutral-100">
                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Our Commitment
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  Legal Services Facility is committed to providing an accessible website that can be used by all visitors, including those with disabilities. We strive to meet WCAG 2.1 AA standards.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Accessibility Features
                </Typography>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Eye className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <Typography variant="body" className="font-semibold mb-1">Visual Accessibility</Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">High contrast ratios, scalable text, and clear visual hierarchy</Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Keyboard className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <Typography variant="body" className="font-semibold mb-1">Keyboard Navigation</Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">Full keyboard accessibility and focus indicators</Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Ear className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <Typography variant="body" className="font-semibold mb-1">Screen Reader Support</Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">Semantic HTML and ARIA labels for assistive technologies</Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MousePointer className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <Typography variant="body" className="font-semibold mb-1">Alternative Input</Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">Support for various input methods and devices</Typography>
                    </div>
                  </div>
                </div>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Feedback and Support
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  If you encounter any accessibility barriers or have suggestions for improvement, please contact us. We are committed to addressing accessibility issues promptly.
                </Typography>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-8">
                  <Typography variant="body" className="text-muted-foreground">
                    <strong>Last Updated:</strong> January 2024<br />
                    <strong>Contact:</strong> For accessibility support, please contact us at accessibility@lsftz.org or call +255 (0) 22260 1534
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Accessibility;
