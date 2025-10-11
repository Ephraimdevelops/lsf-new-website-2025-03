import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Cookie, Settings, Shield, Eye } from 'lucide-react';

const Cookies = () => {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background">
        <Container size="2xl">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <Cookie className="h-6 w-6 text-primary" />
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  Cookie Policy
                </Typography>
              </div>
              
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Cookie Policy
              </Typography>
              
              <Typography variant="body" className="text-xl text-muted-foreground leading-relaxed">
                This policy explains how we use cookies and similar technologies on our website to enhance your experience and provide better services.
              </Typography>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-neutral-100">
                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  What Are Cookies?
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and understand how you use our site.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  How We Use Cookies
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We use cookies to remember your preferences, analyze site traffic, and improve our website functionality. This helps us provide you with more relevant content and a better user experience.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Types of Cookies
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  We use essential cookies for website functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Managing Cookies
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
                </Typography>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-8">
                  <Typography variant="body" className="text-muted-foreground">
                    <strong>Last Updated:</strong> January 2024<br />
                    <strong>Contact:</strong> For questions about our cookie policy, please contact us at privacy@lsftz.org
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

export default Cookies;
