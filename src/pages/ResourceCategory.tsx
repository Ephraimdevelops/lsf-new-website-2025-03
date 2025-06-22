
import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { Download, ExternalLink } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface ResourceCategoryProps {
  category: string;
  title: string;
  description: string;
  icon: ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
}

const ResourceCategory = ({ category, title, description, icon, breadcrumbItems }: ResourceCategoryProps) => {
  // Sample resources - in a real app, these would come from an API
  const resources = [
    {
      title: "Legal Aid Service Delivery Manual",
      description: "Comprehensive guide for legal aid providers on service delivery standards and best practices.",
      type: "PDF",
      size: "2.5 MB",
      downloadUrl: "#"
    },
    {
      title: "Community Paralegal Training Toolkit",
      description: "Complete training materials for community paralegal certification programs.",
      type: "ZIP",
      size: "15.8 MB",
      downloadUrl: "#"
    },
    {
      title: "Legal Empowerment Assessment Framework",
      description: "Framework for assessing and measuring legal empowerment initiatives in communities.",
      type: "PDF",
      size: "1.2 MB",
      downloadUrl: "#"
    }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <Section variant="secondary" padding="sm">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </Section>

      <HeroSection
        icon={icon}
        badge="RESOURCES"
        title={title}
        description={description}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              {category} Resources
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Download and access our comprehensive collection of {category.toLowerCase()} materials, 
              guides, and research publications.
            </Typography>
          </div>

          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-neutral-light p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Typography variant="h3" className="mr-3">
                        {resource.title}
                      </Typography>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                        {resource.type}
                      </span>
                    </div>
                    <Typography variant="body" className="text-neutral-gray mb-2">
                      {resource.description}
                    </Typography>
                    <Typography variant="small" className="text-neutral-gray">
                      Size: {resource.size}
                    </Typography>
                  </div>
                  <div className="flex space-x-3 ml-6">
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button className="flex items-center px-4 py-2 border border-neutral-light rounded-lg hover:bg-neutral-light transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default ResourceCategory;
