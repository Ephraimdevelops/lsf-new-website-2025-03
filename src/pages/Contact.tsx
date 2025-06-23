
import Layout from '@/components/layout/Layout';
import Contact from '@/components/home/Contact';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';

const ContactPage = () => {
  return (
    <Layout>
      {/* Main Contact Content */}
      <div className="w-full">
        <Contact />
      </div>
    </Layout>
  );
};

export default ContactPage;
