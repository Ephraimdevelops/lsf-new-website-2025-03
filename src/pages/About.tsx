
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Award, Users, Globe, Landmark, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import AnimatedStats from '../components/about/AnimatedStats';
import TestimonialCarousel from '../components/about/TestimonialCarousel';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary-teal opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About LSF</h1>
            <p className="text-xl opacity-90">
              Learn about our mission to increase access to justice for all, in particular for women, through a legal empowerment approach across Tanzania
            </p>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Vision & Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-neutral-dark">
                A society that is just, equal, accountable and respects the dignity and rights of all people, particularly women.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary-teal"></div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-neutral-dark">
                To provide financial and technical support to civil society organizations in Tanzania towards increasing access to justice for all, in particular for women through legal empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <InteractiveTimeline />

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Principles That Guide Our Work
            </h2>
            <p className="text-lg text-neutral-dark">
              At LSF, our work is guided by a set of core values that define our approach to increasing access to justice for all Tanzanians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-neutral-dark">
                We are committed to the highest standards of honesty, transparency, and ethical behavior in all our work.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-teal/10 p-3 rounded-full inline-flex mb-4">
                <Users className="h-6 w-6 text-secondary-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusion</h3>
              <p className="text-neutral-dark">
                We believe in equal rights and opportunities for all, particularly focusing on marginalized groups and women.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-orange/10 p-3 rounded-full inline-flex mb-4">
                <Landmark className="h-6 w-6 text-secondary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accountability</h3>
              <p className="text-neutral-dark">
                We take responsibility for our actions and decisions, and maintain transparent processes in all our operations.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-yellow/10 p-3 rounded-full inline-flex mb-4">
                <Globe className="h-6 w-6 text-secondary-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-neutral-dark">
                We embrace creative approaches and innovative solutions to overcome barriers to justice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us in Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Together, we can build a more just society where everyone has access to justice. Support our work through donations, partnerships, or by spreading awareness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="secondary" size="lg">Make a Donation</Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
