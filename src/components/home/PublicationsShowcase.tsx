import { Download, FileText, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const featuredPublications = [
  {
    id: 'annual-report-2023',
    title: 'Annual Report 2023: Impact and Progress in Legal Aid Delivery',
    description: 'A comprehensive report detailing LSF\'s activities, achievements, and impact across Tanzania during the 2023 fiscal year.',
    type: 'Report',
    date: '2023-03-15',
    downloadUrl: '/publications/annual-report-2023.pdf',
    fileSize: '3.2 MB',
    downloads: 2840,
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    featured: true
  },
  {
    id: 'womens-land-rights',
    title: 'Women\'s Land Rights in Tanzania: Challenges and Opportunities',
    description: 'Research study examining the status of women\'s land rights, identifying challenges and proposing strategies.',
    type: 'Research',
    date: '2023-01-20',
    downloadUrl: '/publications/womens-land-rights.pdf',
    fileSize: '2.8 MB',
    downloads: 1920,
    image: '/lovable-uploads/background with mother umage .png'
  },
  {
    id: 'digital-legal-services',
    title: 'Digital Legal Services: Best Practices and Lessons Learned',
    description: 'Guide exploring effective approaches to implementing digital legal services in rural communities.',
    type: 'Guide',
    date: '2022-11-10',
    downloadUrl: '/publications/digital-legal-services.pdf',
    fileSize: '4.5 MB',
    downloads: 3150,
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png'
  },
  {
    id: 'policy-brief-climate',
    title: 'Policy Brief: Climate Justice and Legal Empowerment',
    description: 'Key recommendations for integrating climate justice into legal empowerment initiatives.',
    type: 'Brief',
    date: '2022-10-05',
    downloadUrl: '/publications/policy-brief-climate-justice.pdf',
    fileSize: '1.5 MB',
    downloads: 870,
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png'
  }
];

const PublicationsShowcase = () => {
  const featuredPub = featuredPublications[0];
  const otherPubs = featuredPublications.slice(1);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-secondary-green/10 rounded-full px-6 py-3 mb-6">
            <span className="text-secondary-green font-medium text-sm uppercase tracking-wider">
              Knowledge Hub
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light mb-4 text-foreground">
            Research & <span className="text-primary font-medium">Publications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive library of research, reports, and resources that inform
            policy and practice in the legal empowerment sector.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Publication */}
          <div className="lg:col-span-2">
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
              <div className="relative">
                <img
                  src={featuredPub.image}
                  alt={featuredPub.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-secondary-green text-white">
                  Featured {featuredPub.type}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-medium text-white mb-2 leading-tight">
                    {featuredPub.title}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPub.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {featuredPub.downloads.toLocaleString()} downloads
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {featuredPub.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {featuredPub.fileSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredPub.downloads.toLocaleString()} views
                    </span>
                  </div>
                  <Button className="group/btn">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Publications */}
          <div className="space-y-6">
            {otherPubs.map((pub) => (
              <Card key={pub.id} className="group border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-background">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-muted/50 rounded-lg overflow-hidden">
                      <img
                        src={pub.image}
                        alt={pub.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {pub.type}
                      </Badge>
                      <h4 className="font-medium text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {pub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {pub.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(pub.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {pub.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-light text-primary mb-2">150+</div>
              <div className="text-sm text-muted-foreground">Publications</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-secondary-teal/5 to-secondary-teal/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-light text-secondary-teal mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-secondary-green/5 to-secondary-green/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-light text-secondary-green mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Research Studies</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-secondary-orange/5 to-secondary-orange/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-light text-secondary-orange mb-2">12</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-8">
              <h3 className="text-xl font-medium mb-4 text-foreground">
                Explore Our Complete Library
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Access hundreds of research papers, policy briefs, training materials,
                and impact reports covering all aspects of legal empowerment.
              </p>
              <Button asChild size="lg" className="group">
                <Link to="/publications">
                  Browse All Publications
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PublicationsShowcase;
