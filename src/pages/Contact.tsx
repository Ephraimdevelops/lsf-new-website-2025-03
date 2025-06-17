
import Layout from '@/components/layout/Layout';
import Contact from '@/components/home/Contact';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';

const ContactPage = () => {
  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <Contact />
    </Layout>
  );
};

export default ContactPage;
