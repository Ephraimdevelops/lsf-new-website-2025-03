import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background">
        <Container size="2xl">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  Privacy Policy
                </Typography>
              </div>
              
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Your Privacy Matters to Us
              </Typography>
              
              <Typography variant="body" className="text-xl text-muted-foreground leading-relaxed">
                We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data.
              </Typography>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-neutral-100">
                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Information We Collect
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  How We Use Your Information
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Information Sharing
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Data Security
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </Typography>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-8">
                  <Typography variant="body" className="text-muted-foreground">
                    <strong>Last Updated:</strong> January 2024<br />
                    <strong>Contact:</strong> For privacy-related questions, please contact us at privacy@lsftz.org
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

export default Privacy;
