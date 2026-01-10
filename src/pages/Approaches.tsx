import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, Users, Lightbulb, BookOpen, Network, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const approaches = [
  {
    icon: Target,
    title: 'Grant Making & Management',
    description: 'Strategic funding to empower local organizations and initiatives that advance access to justice at grassroots level.',
    link: '/what-we-do/grant-making',
    stats: '$12M+ distributed',
    features: ['Capacity building support', 'Performance monitoring', 'Technical assistance']
  },
  {
    icon: Users,
    title: 'Direct Implementation',
    description: 'On-ground projects that directly serve communities through legal aid clinics, mobile services, and paralegal programs.',
    link: '/what-we-do/direct-implementation',
    stats: '60% ADR resolution rate',
    features: ['Mobile legal clinics', 'Community paralegals', 'Legal aid services']
  },
  {
    icon: Gavel,
    title: 'Advocacy & Policy',
    description: 'Influencing legal frameworks and policies to create systemic change for improved access to justice.',
    link: '/what-we-do/advocacy-policy',
    stats: '15+ reforms influenced',
    features: ['Policy development', 'Stakeholder engagement', 'Legislative advocacy']
  },
  {
    icon: BookOpen,
    title: 'Research & Learning',
    description: 'Evidence-based research and knowledge management to inform best practices and policy recommendations.',
    link: '/what-we-do/learning-research',
    stats: '50+ studies published',
    features: ['Impact assessments', 'Best practice documentation', 'Knowledge sharing']
  },
  {
    icon: Network,
    title: 'Partnerships & Networking',
    description: 'Building strategic alliances and networks to amplify impact and create sustainable change ecosystems.',
    link: '/what-we-do/partnerships-networking',
    stats: '150+ active partnerships',
    features: ['Network facilitation', 'Coalition building', 'Knowledge exchange']
  }
];

const Approaches = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-secondary-teal/5 to-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-light text-neutral-900 mb-6">
              Strategic Approaches
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              We employ five strategic approaches to advance access to justice, combining direct service
              delivery with systemic change initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {approaches.map((approach, index) => {
              const IconComponent = approach.icon;
              return (
                <Link key={index} to={approach.link} className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 bg-secondary-teal/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary-teal/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-secondary-teal" />
                      </div>
                      <CardTitle className="text-xl font-medium text-neutral-900 group-hover:text-secondary-teal transition-colors">
                        {approach.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-neutral-600 mb-4 leading-relaxed">
                        {approach.description}
                      </CardDescription>

                      <div className="mb-4">
                        <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-4 py-2 mb-3">
                          <span className="text-sm font-medium text-secondary-teal">
                            {approach.stats}
                          </span>
                        </div>

                        <ul className="space-y-2">
                          {approach.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-neutral-600">
                              <div className="w-1.5 h-1.5 bg-secondary-teal rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center text-secondary-teal font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Integration section */}
          <div className="bg-white/50 rounded-3xl p-12 backdrop-blur-sm border border-neutral-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-neutral-900 mb-4">
                Integrated Approach
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Our approaches work in synergy, creating a comprehensive ecosystem
                for sustainable access to justice.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-medium text-primary mb-2">Direct</div>
                <div className="text-sm text-neutral-600">Service Delivery</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-secondary-teal mb-2">Strategic</div>
                <div className="text-sm text-neutral-600">Partnerships</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-secondary-orange mb-2">Evidence</div>
                <div className="text-sm text-neutral-600">Based Learning</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-secondary-green mb-2">Systemic</div>
                <div className="text-sm text-neutral-600">Change</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Approaches;