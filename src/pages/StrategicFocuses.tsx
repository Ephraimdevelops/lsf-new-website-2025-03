import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Scale, Heart, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const focusAreas = [
  {
    icon: Scale,
    title: 'Accessible Legal Aid',
    description: 'Breaking down barriers to justice by providing accessible, affordable, and quality legal services to marginalized communities.',
    link: '/focus-areas/accessible-legal-aid',
    stats: '85% case resolution rate'
  },
  {
    icon: Users,
    title: 'Empowered Communities',
    description: 'Building local capacity through paralegal training and community-based legal support systems.',
    link: '/focus-areas/empowered-communities',
    stats: '4,000+ paralegals trained'
  },
  {
    icon: Heart,
    title: 'Conducive Legal Environment',
    description: 'Creating supportive policy frameworks and legal environments that enable access to justice.',
    link: '/focus-areas/conducive-environment',
    stats: '15 policy reforms influenced'
  },
  {
    icon: Building,
    title: 'Institutional Sustainability',
    description: 'Strengthening institutions and organizations to ensure long-term sustainability of legal services.',
    link: '/focus-areas/institutional-development',
    stats: '150+ institutions supported'
  }
];

const StrategicFocuses = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-light text-neutral-900 mb-6">
              Strategic Focus Areas
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
              Our work is organized around four strategic focus areas that address the core challenges 
              in accessing justice across Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {focusAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <Link key={index} to={area.link} className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-medium text-neutral-900 group-hover:text-primary transition-colors">
                        {area.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-neutral-600 mb-4 leading-relaxed">
                        {area.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center bg-neutral-100 rounded-full px-4 py-2">
                          <span className="text-sm font-medium text-neutral-700">
                            {area.stats}
                          </span>
                        </div>
                        <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StrategicFocuses;