
import { useParams, Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Briefcase, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const opportunityId = id as Id<"opportunities">;

  const opportunityData = useQuery(api.opportunities.getById, id ? { id: opportunityId } : "skip");
  const opportunity = opportunityData ? { ...opportunityData, id: opportunityData._id } : null;

  const isLoading = opportunityData === undefined;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="animate-pulse text-primary">Loading opportunity details...</div>
        </div>
      </Layout>
    );
  }

  if (!opportunity) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Opportunity Not Found</h1>
          <Link to="/opportunities">
            <Button>Back to Opportunities</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge={opportunity.category}
        title={opportunity.title}
        description={`Join our ${opportunity.department} team and make a meaningful impact on access to justice in Tanzania.`}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link to="/opportunities" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Opportunities
          </Link>

          {/* Opportunity Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${opportunity.category === 'Employment' ? 'bg-primary/10 text-primary' :
                  opportunity.category === 'Internship' ? 'bg-secondary-teal/10 text-secondary-teal' :
                    opportunity.category === 'Volunteer' ? 'bg-secondary-orange/10 text-secondary-orange' :
                      'bg-neutral-dark/10 text-neutral-dark'
                  }`}>
                  {opportunity.category}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-gray">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  {opportunity.duration}
                </div>
                <div className="flex items-center">
                  <Briefcase size={14} className="mr-2" />
                  {opportunity.type}
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray leading-relaxed">{opportunity.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-primary mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-secondary-teal mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Compensation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-secondary-orange mr-3 mt-1 flex-shrink-0" />
                        <span className="text-neutral-gray">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Department</h4>
                    <p className="text-neutral-gray">{opportunity.department}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Compensation</h4>
                    <p className="text-neutral-gray">{opportunity.salary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Application Deadline</h4>
                    <p className="text-neutral-gray">{new Date(opportunity.deadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Now */}
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-gray mb-4">
                    Send your CV and cover letter to join our mission of advancing access to justice.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 mb-3">
                    Apply Now
                  </Button>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full">
                      Ask Questions
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Need More Information?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-gray text-sm">
                    Contact our HR team for additional details about this position.
                  </p>
                  <Link to="/contact" className="text-primary text-sm hover:underline">
                    Get in touch →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpportunityDetail;
