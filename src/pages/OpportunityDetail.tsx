import { useParams, Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Briefcase, Calendar, ArrowLeft, ArrowRight, ExternalLink, Building2, Banknote, CheckCircle2 } from 'lucide-react';

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const opportunityId = id as Id<"opportunities">;
  const opportunityData = useQuery(api.opportunities.getById, id ? { id: opportunityId } : "skip");
  const opportunity = opportunityData ? { ...opportunityData, id: opportunityData._id } : null;

  const isLoading = opportunityData === undefined;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary-teal/5 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-secondary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-light">Loading opportunity...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!opportunity) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-secondary-teal/5 to-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-light text-neutral-900 mb-4">Opportunity Not Found</h1>
            <p className="text-neutral-600 mb-8">The opportunity you're looking for doesn't exist or has been removed.</p>
            <Link to="/opportunities">
              <Button className="rounded-full px-8">Browse Opportunities</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-primary/10 text-primary';
      case 'grant': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'tender': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'consultancy': return 'bg-purple-100 text-purple-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const isOpen = opportunity.status === 'open';

  return (
    <Layout>
      <div className="bg-gradient-to-b from-secondary-teal/5 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-24 pb-12">
          {/* Back Navigation */}
          <Link
            to="/opportunities"
            className="inline-flex items-center text-neutral-600 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Opportunities
          </Link>

          {/* Type & Status Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeBadgeColor(opportunity.type)}`}>
              {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isOpen ? '● Open' : '● Closed'}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700">
              {opportunity.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-light text-neutral-900 mb-6 leading-tight">
            {opportunity.title}
          </h1>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-600 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-teal/10 rounded-xl flex items-center justify-center mr-3">
                <MapPin size={18} className="text-secondary-teal" />
              </div>
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-teal/10 rounded-xl flex items-center justify-center mr-3">
                <Building2 size={18} className="text-secondary-teal" />
              </div>
              <span>{opportunity.department}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-teal/10 rounded-xl flex items-center justify-center mr-3">
                <Clock size={18} className="text-secondary-teal" />
              </div>
              <span>{opportunity.duration}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-orange/10 rounded-xl flex items-center justify-center mr-3">
                <Calendar size={18} className="text-secondary-orange" />
              </div>
              <span className="font-medium">Deadline: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-neutral-600 leading-relaxed max-w-4xl font-light">
            {opportunity.description}
          </p>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Responsibilities */}
              {(opportunity.responsibilities || []).length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100">
                  <h2 className="text-2xl font-medium text-neutral-900 mb-6">Key Responsibilities</h2>
                  <ul className="space-y-4">
                    {(opportunity.responsibilities || []).map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                        <span className="text-neutral-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {(opportunity.requirements || []).length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100">
                  <h2 className="text-2xl font-medium text-neutral-900 mb-6">Requirements & Qualifications</h2>
                  <ul className="space-y-4">
                    {(opportunity.requirements || []).map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-secondary-teal rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                        <span className="text-neutral-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {(opportunity.benefits || []).length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-100">
                  <h2 className="text-2xl font-medium text-neutral-900 mb-6">Benefits & Compensation</h2>
                  <ul className="space-y-4">
                    {(opportunity.benefits || []).map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 size={18} className="text-secondary-orange mt-0.5 mr-4 flex-shrink-0" />
                        <span className="text-neutral-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">

              {/* Quick Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-neutral-100 sticky top-24">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Quick Information</h3>

                <div className="space-y-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-teal/10 rounded-xl flex items-center justify-center mr-4">
                      <Briefcase size={18} className="text-secondary-teal" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">Type</p>
                      <p className="text-neutral-900 font-medium">{opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-orange/10 rounded-xl flex items-center justify-center mr-4">
                      <Banknote size={18} className="text-secondary-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">Compensation</p>
                      <p className="text-neutral-900 font-medium">{opportunity.salary || 'Competitive'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide">Duration</p>
                      <p className="text-neutral-900 font-medium">{opportunity.duration}</p>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-neutral-100" />

                {/* Apply CTA */}
                {isOpen ? (
                  <div className="space-y-3">
                    {opportunity.applicationLink ? (
                      <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 text-base font-medium group">
                          Apply Now
                          <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    ) : (
                      <Link to="/contact">
                        <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 text-base font-medium">
                          Apply Now
                        </Button>
                      </Link>
                    )}
                    <Link to="/contact">
                      <Button variant="outline" className="w-full rounded-xl h-12 text-base font-medium">
                        Ask Questions
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 text-center py-4 rounded-xl font-medium">
                    This opportunity is closed
                  </div>
                )}
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-secondary-teal/10 to-primary/10 rounded-3xl p-6 border border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Need More Information?</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  Our HR team is happy to answer any questions about this position.
                </p>
                <Link to="/contact" className="inline-flex items-center text-primary font-medium hover:underline group">
                  Get in touch
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpportunityDetail;
