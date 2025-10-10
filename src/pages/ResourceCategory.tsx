import { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { ArrowRight, Download, FileText, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceCategoryProps {
  category: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const ResourceCategory = ({ category, title, description, icon }: ResourceCategoryProps) => {
  // Mock data for demonstration - in real implementation, this would come from your API
  const resources = [
    {
      id: 1,
      title: "Legal Aid Guide for Communities",
      description: "Comprehensive guide for community paralegals and legal aid workers",
      type: "PDF Guide",
      date: "2024-01-15",
      downloads: 1250,
      size: "2.5 MB"
    },
    {
      id: 2,
      title: "Access to Justice Report 2023",
      description: "Annual report on legal aid services and impact across Tanzania",
      type: "Research Report",
      date: "2023-12-20",
      downloads: 890,
      size: "5.2 MB"
    },
    {
      id: 3,
      title: "Paralegal Training Manual",
      description: "Training materials for community paralegal programs",
      type: "Training Manual",
      date: "2024-02-10",
      downloads: 2100,
      size: "8.7 MB"
    },
    {
      id: 4,
      title: "Legal Empowerment Toolkit",
      description: "Practical tools and templates for legal empowerment initiatives",
      type: "Toolkit",
      date: "2024-01-30",
      downloads: 1560,
      size: "3.1 MB"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-neutral-50/50 to-background">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <Container size="2xl" className="relative z-10">
            <div className="text-center">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  {category} Resources
                </Typography>
              </div>

              {/* Title */}
              <Typography 
                variant="h1" 
                className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                {title}
                <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                  Knowledge Hub
                </span>
              </Typography>

              {/* Description */}
              <Typography 
                variant="body" 
                className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              >
                {description}
              </Typography>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary-orange rounded-3xl mb-8 shadow-lg">
                {icon}
              </div>
            </div>
          </Container>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <Container size="2xl">
            <div className="mb-12">
              <Typography variant="h2" className="mb-4 text-3xl font-bold text-center">
                Available Resources
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                Download our comprehensive collection of guides, reports, and tools designed to support legal empowerment work.
              </Typography>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <div 
                  key={resource.id}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 group"
                >
                  {/* Resource Type Badge */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      <FileText className="h-4 w-4" />
                      {resource.type}
                    </div>
                  </div>

                  {/* Title */}
                  <Typography variant="h3" className="mb-4 text-xl font-bold group-hover:text-primary transition-colors">
                    {resource.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body" className="text-muted-foreground mb-6 leading-relaxed">
                    {resource.description}
                  </Typography>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(resource.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {resource.downloads.toLocaleString()} downloads
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <span className="text-sm text-muted-foreground">Size: {resource.size}</span>
                  </div>

                  {/* Download Button */}
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-semibold group"
                  >
                    <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Download Resource
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
                <Typography variant="h3" className="mb-4 text-3xl font-bold">
                  Need More Resources?
                </Typography>
                <Typography variant="body" className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Can't find what you're looking for? Contact our team for customized resources and support materials.
                </Typography>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-semibold px-8 py-4"
                  >
                    Contact Our Team
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4"
                  >
                    Browse All Resources
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
};

export default ResourceCategory;
