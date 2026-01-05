import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/shared/CinematicHero';
import { Book, FileText, Video, Download, ArrowRight, Scale, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const resourceCategories = [
    {
      title: "Legal Empowerment",
      description: "Comprehensive guides and toolkits for legal empowerment initiatives and paralegal training.",
      icon: <Scale className="h-8 w-8" />,
      link: "/resources/legal-empowerment",
      count: "25+ Resources",
      color: "bg-primary",
      gradient: "from-primary to-primary-dark"
    },
    {
      title: "Gender Justice",
      description: "Resources focusing on women's rights, GBV prevention, and gender equality advocacy.",
      icon: <Heart className="h-8 w-8" />,
      link: "/resources/gender-justice",
      count: "18+ Resources",
      color: "bg-secondary-orange",
      gradient: "from-secondary-orange to-red-600"
    },
    {
      title: "Climate Justice",
      description: "Environmental law, climate change resources, and community resilience guides.",
      icon: <Leaf className="h-8 w-8" />,
      link: "/resources/climate-justice",
      count: "12+ Resources",
      color: "bg-secondary-teal",
      gradient: "from-secondary-teal to-green-600"
    }
  ];

  const featuredResources = [
    { title: "Paralegal Training Manual 2024", type: "Guide", downloads: "2.3K" },
    { title: "GBV Survivor Support Toolkit", type: "Toolkit", downloads: "1.8K" },
    { title: "Land Rights Quick Reference", type: "Brief", downloads: "1.5K" },
    { title: "Community Mediation Handbook", type: "Guide", downloads: "1.2K" },
  ];

  return (
    <Layout>
      <CinematicHero
        title="Tools for Justice"
        badge="Resource Center"
        description="Access our comprehensive collection of legal guides, research publications, training materials, and policy documents."
        backgroundImage="/lovable-uploads/resources-hero-bg.png"
      />

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-secondary-orange/10 text-secondary-orange text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Browse by Topic
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Resource Categories
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Our library contains carefully curated materials to support legal aid providers, researchers, and advocates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {resourceCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-primary/30 hover:-translate-y-2 h-full">
                  <div className={`p-8 bg-gradient-to-br ${category.gradient} text-white`}>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                      {category.icon}
                    </div>
                    <span className="text-white/80 text-sm font-bold">{category.count}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                      Browse Resources
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Downloads */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Most Downloaded
            </h2>
            <p className="text-neutral-600">Popular resources from our collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {featuredResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-neutral-100 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-secondary-orange mb-2 block">{resource.type}</span>
                <h4 className="font-bold text-neutral-900 mb-2 text-sm">{resource.title}</h4>
                <p className="text-neutral-500 text-xs">{resource.downloads} downloads</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Can't Find What You Need?</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
            Our team can help you find specific resources or create custom materials for your work.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 rounded-full text-lg">
              Request Resources
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
