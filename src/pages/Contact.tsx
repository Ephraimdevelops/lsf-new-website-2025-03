
import Layout from '@/components/layout/Layout';
import Contact from '@/components/home/Contact';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';

const ContactPage = () => {
  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <section className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </section>

      {/* Main Contact Content */}
      <div className="w-full">
        <Contact />
      </div>
    </Layout>
  );
};

export default ContactPage;
