
import Layout from '@/components/layout/Layout';
import Contact from '@/components/home/Contact';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';

const ContactPage = () => {
  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <Section variant="secondary" padding="sm">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </Section>

      {/* Main Contact Content */}
      <div className="w-full">
        <Contact />
      </div>
    </Layout>
  );
};

export default ContactPage;
