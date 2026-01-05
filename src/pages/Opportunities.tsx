import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import CinematicHero from '@/components/shared/CinematicHero';
import { MapPin, Calendar, Briefcase, ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';
import Container from '@/components/shared/Container';
import { useOpportunities } from '@/hooks/useOpportunities';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';

const getDaysLeft = (deadline: string) => {
  const now = new Date();
  const endDate = new Date(deadline);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""} left` : "Closing today";
};

const OpportunitiesPage = () => {
  const { opportunities, loading, error } = useOpportunities();

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <CinematicHero
        title="Join Our Mission"
        badge="Careers"
        description="Explore open roles and help us expand access to justice across Tanzania. Your skills can help millions."
        backgroundImage="/lovable-uploads/opportunities-hero-bg.png"
      />

      {/* Opportunities Grid */}
      <section className="py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-secondary-orange/10 text-secondary-orange text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Open Positions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Current Opportunities
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Find your next role and be part of Tanzania's justice movement.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl">
              <Briefcase className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                No Open Positions Right Now
              </h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                We don't have any open positions at the moment. Check back later or join our talent network.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary-dark rounded-full">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity.id}
                  to={`/opportunities/${opportunity.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-secondary-orange/30 hover:-translate-y-2 h-full">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-secondary-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                          {opportunity.employment_type}
                        </span>
                        <span className="text-green-600 text-xs font-bold">
                          {getDaysLeft(opportunity.deadline)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-secondary-orange transition-colors">
                        {opportunity.title}
                      </h3>

                      <p className="text-neutral-600 text-sm line-clamp-2 mb-4">
                        {opportunity.description}
                      </p>

                      <div className="space-y-2 text-sm text-neutral-500 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-secondary-orange font-bold text-sm group-hover:gap-2 transition-all">
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Work With Us?</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12">
            Join a mission-driven organization making real impact across Tanzania.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-secondary-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Meaningful Work</h3>
              <p className="text-white/70 text-sm">Every role contributes to justice for millions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-secondary-teal rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Career Growth</h3>
              <p className="text-white/70 text-sm">Professional development opportunities</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Work-Life Balance</h3>
              <p className="text-white/70 text-sm">Flexible policies that respect your time</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OpportunitiesPage;