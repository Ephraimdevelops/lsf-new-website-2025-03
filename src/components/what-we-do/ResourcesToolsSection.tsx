
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Book, FileText, Video, Users } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ResourcesToolsSection = () => {
  const resourceCategories = [
    {
      icon: <Book className="h-6 w-6" />,
      title: "Training Materials",
      description: "Comprehensive training resources for paralegals and legal aid providers.",
      items: [
        { name: "Paralegal Training Manual", type: "PDF", downloads: "2.5K", isNew: false },
        { name: "Community Legal Education Toolkit", type: "PDF", downloads: "1.8K", isNew: true },
        { name: "Gender-Based Violence Response Guide", type: "PDF", downloads: "3.2K", isNew: false }
      ],
      color: "from-primary to-primary-dark"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Legal Templates",
      description: "Ready-to-use legal documents and templates for common cases.",
      items: [
        { name: "Land Rights Documentation Kit", type: "DOC", downloads: "1.2K", isNew: false },
        { name: "Inheritance Claim Templates", type: "PDF", downloads: "890", isNew: true },
        { name: "Domestic Violence Protection Forms", type: "PDF", downloads: "2.1K", isNew: false }
      ],
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Educational Videos",
      description: "Video resources for community education and awareness raising.",
      items: [
        { name: "Know Your Rights Series", type: "Video", downloads: "5.7K", isNew: false },
        { name: "Women's Property Rights Workshop", type: "Video", downloads: "3.4K", isNew: true },
        { name: "Accessing Legal Aid Services", type: "Video", downloads: "4.1K", isNew: false }
      ],
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Tools",
      description: "Interactive tools and resources for community engagement.",
      items: [
        { name: "Legal Aid Finder Tool", type: "Web App", downloads: "12K", isNew: false },
        { name: "Rights Awareness Game", type: "Interactive", downloads: "2.8K", isNew: true },
        { name: "Community Forum Platform", type: "Web App", downloads: "6.5K", isNew: false }
      ],
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            RESOURCES & TOOLS
          </Typography>
          <Typography variant="h2" className="mb-6">
            Empowering Communities
            <span className="block text-primary">Through Knowledge</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Access our comprehensive library of training materials, legal templates, educational videos, 
            and community tools designed to strengthen legal empowerment across Tanzania.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {resourceCategories.map((category, index) => (
            <Card key={index} variant="elevated" hover className="group">
              <div className={`bg-gradient-to-br ${category.color} p-6 rounded-t-2xl -m-8 mb-6`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <Typography variant="h4" className="text-white mb-2">
                  {category.title}
                </Typography>
                <Typography variant="bodySmall" className="text-white/90">
                  {category.description}
                </Typography>
              </div>
              
              <div className="space-y-4">
                <Typography variant="h4" className="text-neutral-dark mb-4">
                  Featured Resources
                </Typography>
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer group/item">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="bodySmall" className="font-semibold text-neutral-dark group-hover/item:text-primary transition-colors">
                          {item.name}
                        </Typography>
                        {item.isNew && (
                          <Badge className="bg-secondary-orange text-white text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-gray">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.downloads} downloads</span>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-neutral-gray group-hover/item:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-2xl p-8">
          <Typography variant="h3" className="mb-4">
            Access All Resources
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-6 max-w-2xl mx-auto">
            Explore our complete library of legal empowerment resources, training materials, and community tools.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resources">
              <Button size="lg" className="bg-primary hover:bg-primary-dark">
                Browse All Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/legal-help">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Get Legal Help
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ResourcesToolsSection;
