import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { FileText, Scale, Users, AlertTriangle } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background">
        <Container size="2xl">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <FileText className="h-6 w-6 text-primary" />
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  Terms of Service
                </Typography>
              </div>
              
              <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Terms of Service
              </Typography>
              
              <Typography variant="body" className="text-xl text-muted-foreground leading-relaxed">
                Please read these terms carefully before using our services. By accessing or using our website and services, you agree to be bound by these terms.
              </Typography>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-neutral-100">
                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Acceptance of Terms
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  By accessing and using the Legal Services Facility website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Use License
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Disclaimer
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.
                </Typography>

                <Typography variant="h2" className="text-2xl font-bold mb-6">
                  Limitations
                </Typography>
                <Typography variant="body" className="text-muted-foreground mb-6">
                  In no event shall Legal Services Facility or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
                </Typography>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mt-8">
                  <Typography variant="body" className="text-muted-foreground">
                    <strong>Last Updated:</strong> January 2024<br />
                    <strong>Contact:</strong> For questions about these terms, please contact us at legal@lsftz.org
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

export default Terms;
