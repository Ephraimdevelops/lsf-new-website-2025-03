
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { TrendingUp, Users, Scale, Heart } from 'lucide-react';

const Impact = () => {
  const highlights = [
    {
      title: "Lives Transformed",
      description: "Real stories of individuals whose lives have been fundamentally changed through access to justice and legal empowerment.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Read Stories"
    },
    {
      title: "Communities Empowered",
      description: "Entire communities that now have the knowledge and tools to protect their rights and resolve disputes peacefully.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "See Communities"
    },
    {
      title: "Systems Changed",
      description: "Policy reforms and institutional changes that have created lasting improvements in Tanzania's justice system.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "View Changes"
    }
  ];

  const impactChampions = [
    {
      name: "Grace Mbwana",
      role: "Beneficiary & Advocate",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "LSF helped me secure my land rights. Now I help other women in my community do the same. That's the power of legal empowerment."
    },
    {
      name: "John Mwalimu",
      role: "Community Paralegal",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "I've resolved over 300 cases in my community. When people know their rights, they can change their own lives."
    },
    {
      name: "Fatuma Seif",
      role: "Women's Group Leader",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Our women's group went from being silent to being the strongest voice for justice in our village."
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="Our Impact"
        title="Measuring Change, Celebrating Success"
        description="See how we're transforming lives, empowering communities, and creating lasting change in Tanzania's justice landscape through data-driven impact measurement."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ImpactStorySection
        title="100,000 Lives Changed and Counting"
        subtitle="Real Impact"
        description="Behind every statistic is a human story. From the mother who secured her inheritance rights to the community that learned to resolve disputes peacefully, our impact is measured in transformed lives and empowered communities."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Explore All Metrics"
        stats={[
          { value: "100K+", label: "Lives Directly Impacted" },
          { value: "1M+", label: "People Reached" },
          { value: "85%", label: "Success Rate" },
          { value: "184", label: "Communities Transformed" }
        ]}
      />

      {/* Impact Metrics Grid */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Impact by the Numbers</h2>
            <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
              Our commitment to measurement and accountability ensures that every program delivers real, sustainable change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">4,000+</div>
              <div className="text-neutral-gray">Paralegals Trained</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Scale className="h-12 w-12 text-secondary-teal mx-auto mb-4" />
              <div className="text-3xl font-bold text-secondary-teal mb-2">15+</div>
              <div className="text-neutral-gray">Laws Influenced</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <Heart className="h-12 w-12 text-secondary-orange mx-auto mb-4" />
              <div className="text-3xl font-bold text-secondary-orange mb-2">5,000+</div>
              <div className="text-neutral-gray">Cases Resolved</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">90%</div>
              <div className="text-neutral-gray">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <VisualHighlightSection
        title="Stories of Transformation"
        subtitle="Impact Areas"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Champions of Change"
        subtitle="Impact Stories"
        description="Meet the remarkable individuals whose lives have been transformed through our programs and who are now champions of change in their communities."
        partners={impactChampions}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Be Part of Our Impact Story</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Every donation, every partnership, every voice raised for justice contributes to the transformation you see here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Support Our Work
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
