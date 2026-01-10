import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2, Globe, Users, TrendingUp, FileText, Mail,
  MapPin, ArrowRight, Scale, Handshake, Phone, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate = () => {
  const impactStats = [
    { value: "90,000+", label: "Cases Annually", icon: Users },
    { value: "168", label: "Districts Reached", icon: MapPin },
    { value: "4,000+", label: "Paralegals Trained", icon: Scale },
    { value: "TZS 3.1B+", label: "Disbursed to Partners", icon: TrendingUp }
  ];

  const beneficiaries = [
    {
      name: "Mwanaisha Juma",
      location: "Kilimanjaro Region",
      story: "Through LSF's paralegal support, I was able to reclaim my family's land that had been illegally taken. Today, I farm that land and support my three children through school.",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop"
    },
    {
      name: "Hassan Mwalimu",
      location: "Mwanza Region",
      story: "When I faced wrongful imprisonment, LSF's legal aid program helped me prove my innocence. I'm now back with my family and have started a small business.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    }
  ];

  const currentPartners = [
    "Ford Foundation", "Open Society Foundations", "European Union",
    "USAID", "UNDP", "Hewlett Foundation"
  ];

  return (
    <Layout>
      {/* Hero - Centered */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-gray-900 via-primary to-gray-900 flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1600')] bg-cover bg-center opacity-10" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary-orange/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/20 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-2">
              <Handshake className="h-4 w-4 mr-2" />
              Strategic Partnerships
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.95]">
              Partner With Us to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-orange via-yellow-400 to-secondary-teal">
                Transform Justice
              </span>
            </h1>

            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join leading foundations and organizations investing in sustainable access to justice
              across Tanzania. Together, we create systemic change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-xl bg-secondary-orange hover:bg-secondary-orange/90 text-lg"
                >
                  Start a Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-xl border-white/30 text-white hover:bg-white/10 text-lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Download Impact Report
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-b">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Partner With LSF */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Partner With LSF?
            </h2>
            <p className="text-xl text-gray-600">
              As Tanzania's leading legal aid organization, we offer strategic partners
              measurable impact, transparency, and sustainable change.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Institutional Excellence",
                description: "15 years of impact with robust governance, financial controls, and program management."
              },
              {
                icon: Globe,
                title: "National Reach",
                description: "Active in all 31 regions of Tanzania with 4,000+ trained paralegals on the ground."
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                description: "60% ADR resolution rate with transparent M&E frameworks and regular impact reporting."
              }
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Beneficiaries Section - Like Governance Section */}
      <section className="py-20 bg-white">
        <Container>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-primary/20">
              <div className="w-3 h-3 bg-secondary-orange rounded-full animate-pulse mr-4" />
              <span className="font-bold text-lg tracking-widest text-gray-700">
                REAL IMPACT
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Voices of Change
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Your partnership doesn't just fund programs — it transforms lives.
              Here are just two of the thousands of people whose lives have been changed.
            </p>
          </div>

          {/* Beneficiary Profiles - Like Leadership */}
          <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            {beneficiaries.map((person, i) => (
              <div key={i} className="text-center md:text-left">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-64 h-64 mx-auto md:mx-0 rounded-full object-cover mb-6 shadow-xl border-4 border-white"
                />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                  {person.name}
                </h3>
                <p className="text-primary font-medium mb-4">{person.location}</p>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-4 h-8 w-8 text-secondary-orange/30" />
                  <blockquote className="text-gray-600 italic text-lg leading-relaxed pl-6">
                    "{person.story}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-10">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
              Trusted By Leading Organizations
            </h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {currentPartners.map((partner, i) => (
                <span key={i} className="text-lg font-semibold text-gray-400 hover:text-primary transition-colors">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Simple CTA - Direct to Contact */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-blue-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Let's discuss how your organization can partner with us to advance
              access to justice for millions of Tanzanians.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-16 px-12 rounded-xl bg-secondary-orange hover:bg-secondary-orange/90 text-lg"
                >
                  Contact Our Partnerships Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Direct Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
              <a href="mailto:partnerships@lsftz.org" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span>partnerships@lsftz.org</span>
              </a>
              <a href="tel:+255870119363" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
                <span>+255 870 119 363</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Resources */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Resources</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Annual Report 2024", type: "PDF", icon: FileText },
              { title: "Impact Assessment", type: "PDF", icon: TrendingUp },
              { title: "Partnership Brochure", type: "PDF", icon: Handshake }
            ].map((resource, i) => (
              <Card key={i} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <resource.icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-500">{resource.type}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Donate;
