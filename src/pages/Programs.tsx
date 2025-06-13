
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Briefcase, Users, Target, Award } from 'lucide-react';

const Programs = () => {
  return (
    <Layout>
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge="Our Programs"
        title="Innovative Programs for Justice"
        description="Discover our comprehensive range of programs designed to increase access to justice, empower communities, and create lasting change across Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Programs Grid */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Core Programs</h2>
            <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
              Comprehensive programs addressing different aspects of legal empowerment and access to justice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Legal Aid</h3>
              <p className="text-neutral-gray text-sm">Direct legal representation and advice</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-secondary-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Paralegal Training</h3>
              <p className="text-neutral-gray text-sm">Community-based legal support training</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-secondary-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Women's Rights</h3>
              <p className="text-neutral-gray text-sm">Gender-focused legal empowerment</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow">
              <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Youth Programs</h3>
              <p className="text-neutral-gray text-sm">Legal education for young people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Success Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Program Success Metrics</h2>
            <p className="text-lg text-neutral-gray max-w-3xl mx-auto">
              We measure success not just in numbers, but in the real transformation of lives and communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">90%</div>
              <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
              <p className="text-neutral-gray">Cases resolved successfully through our programs</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary-teal mb-4">85%</div>
              <h3 className="text-xl font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-neutral-gray">Clients who rate our services as excellent</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary-orange mb-4">95%</div>
              <h3 className="text-xl font-semibold mb-2">Program Completion</h3>
              <p className="text-neutral-gray">Participants who complete our training programs</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
