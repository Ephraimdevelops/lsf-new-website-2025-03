
import Layout from '@/components/layout/Layout';
import { Book, FileText, Video, Download } from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Legal Empowerment",
      description: "Comprehensive guides and toolkits for legal empowerment initiatives",
      icon: <Book className="h-8 w-8" />,
      link: "/resources/legal-empowerment",
      count: "25+ Resources"
    },
    {
      title: "Gender Justice",
      description: "Resources focusing on women's rights and gender equality",
      icon: <FileText className="h-8 w-8" />,
      link: "/resources/gender-justice",
      count: "18+ Resources"
    },
    {
      title: "Climate Justice",
      description: "Environmental law and climate change resources",
      icon: <Video className="h-8 w-8" />,
      link: "/resources/climate-justice",
      count: "12+ Resources"
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Download className="h-8 w-8" />}
        badge="RESOURCE CENTER"
        title="Legal Resources & Publications"
        description="Access our comprehensive collection of legal guides, research publications, training materials, and policy documents to support justice initiatives across Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Browse Resources by Category
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our resource library contains carefully curated materials to support legal aid providers, 
              researchers, and advocates working to improve access to justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <Link 
                key={index}
                to={category.link}
                className="group bg-white rounded-xl border border-neutral-light p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-primary mb-4 group-hover:text-secondary-orange transition-colors">
                  {category.icon}
                </div>
                <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-4">
                  {category.description}
                </Typography>
                <div className="text-secondary-orange font-semibold text-sm">
                  {category.count}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Resources;
