
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import CategoryCard from '../components/shared/CategoryCard';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { Button } from '@/components/ui/button';
import { FileText, Search, Download, Book, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Legal Empowerment",
      description: "Reports, guides, and tools on legal aid, paralegals, and access to justice",
      imageUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 15,
      linkTo: "/resources/legal-empowerment"
    },
    {
      title: "Gender Justice",
      description: "Resources on women's rights, gender-based violence, and gender equality",
      imageUrl: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 8,
      linkTo: "/resources/gender-justice"
    },
    {
      title: "Climate Justice",
      description: "Publications on environmental rights, climate adaptation, and resilience",
      imageUrl: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 6,
      linkTo: "/resources/climate-justice"
    },
    {
      title: "Digital Transformation",
      description: "Resources on technology for legal services and digital justice solutions",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 4,
      linkTo: "/resources/digital-transformation"
    },
    {
      title: "Publications",
      description: "Academic papers, research studies, and comprehensive reports",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 12,
      linkTo: "/publications"
    },
    {
      title: "Policy Briefs",
      description: "Concise policy recommendations and analysis documents",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      resourceCount: 9,
      linkTo: "/resources/policy-briefs"
    }
  ];

  const highlights = [
    {
      title: "Research Publications",
      description: "Comprehensive studies and reports that provide deep insights into legal empowerment challenges and solutions in Tanzania.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Browse Research"
    },
    {
      title: "Training Materials",
      description: "Practical guides, toolkits, and manuals designed to build capacity and knowledge among legal aid providers and communities.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Access Materials"
    },
    {
      title: "Policy Briefs",
      description: "Concise, evidence-based recommendations for policymakers on key justice and legal empowerment issues.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Read Briefs"
    }
  ];

  const partners = [
    {
      name: "Dr. Fatuma Chande",
      role: "Research Director",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Our comprehensive research library serves as a foundation for evidence-based policy and practice across Tanzania."
    },
    {
      name: "Prof. John Makwetta",
      role: "Academic Partner",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "These resources have become essential reading for students and practitioners working in legal empowerment."
    },
    {
      name: "Maria Santos",
      role: "Knowledge Management Lead",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "We've made complex legal concepts accessible to communities through our innovative resource development approach."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<FileText className="h-8 w-8" />}
        badge="Knowledge Hub"
        title="Resources & Publications"
        description="Access our comprehensive collection of research, reports, guides, and tools designed to advance legal empowerment and access to justice across Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ImpactStorySection
        title="Knowledge that Transforms Communities"
        subtitle="Research Impact"
        description="Every resource we create is designed with one goal: to put the power of legal knowledge into the hands of those who need it most. From comprehensive research reports to practical community guides, our knowledge products are changing how Tanzania approaches justice."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Explore Our Library"
        stats={[
          { value: "100K+", label: "Downloads" },
          { value: "50+", label: "Publications" },
          { value: "15+", label: "Languages" },
          { value: "500+", label: "Citations" }
        ]}
      />

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find What You Need</h2>
            <p className="text-neutral-gray mb-8">
              Search through our extensive library of resources or browse by category
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search resources, publications, reports..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Browse by Category
            </span>
            <h2 className="text-4xl font-bold mb-6">Resource Categories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
              Explore our organized collection of resources across different focus areas and document types
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
                imageUrl={category.imageUrl}
                resourceCount={category.resourceCount}
                linkTo={category.linkTo}
              />
            ))}
          </div>
        </div>
      </section>

      <VisualHighlightSection
        title="Explore Our Knowledge Collection"
        subtitle="Resource Types"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Knowledge Creators"
        subtitle="Our Research Team"
        description="Meet the dedicated researchers, writers, and knowledge management experts who create the resources that power legal empowerment across Tanzania."
        partners={partners}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary-teal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-lg opacity-90">Research Participants</div>
            </div>
            <div>
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Policy Changes Influenced</div>
            </div>
            <div>
              <Download className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-lg opacity-90">Downloads This Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Quick Access</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/publications">
              <Button size="lg" className="px-8 py-4">
                <Book className="mr-2 h-5 w-5" />
                View All Publications
              </Button>
            </Link>
            <Link to="/resources/latest">
              <Button size="lg" variant="outline" className="px-8 py-4">
                <FileText className="mr-2 h-5 w-5" />
                Latest Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
