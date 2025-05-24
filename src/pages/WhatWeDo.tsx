
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Scale, Users, BookOpen, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatWeDo = () => {
  const focusAreas = [
    {
      icon: Scale,
      title: 'Legal Aid & Representation',
      description: 'Providing direct legal assistance to individuals and communities who cannot afford legal services.',
      features: [
        'Free legal consultations',
        'Court representation',
        'Legal document preparation',
        'Family law assistance',
        'Land rights advocacy'
      ],
      color: 'primary'
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'Training community paralegals to provide grassroots legal support and education.',
      features: [
        'Paralegal training programs',
        'Community legal education',
        'Alternative dispute resolution',
        'Legal awareness campaigns',
        'Community mobilization'
      ],
      color: 'secondary-teal'
    },
    {
      icon: BookOpen,
      title: 'Policy Advocacy',
      description: 'Influencing policy and legislative changes to improve access to justice systems.',
      features: [
        'Policy research and analysis',
        'Legislative advocacy',
        'Stakeholder engagement',
        'Public interest litigation',
        'Justice sector reforms'
      ],
      color: 'secondary-orange'
    },
    {
      icon: Smartphone,
      title: 'Digital Innovation',
      description: 'Leveraging technology to expand access to legal information and services.',
      features: [
        'Haki Yangu mobile app',
        'Online legal resources',
        'Digital case management',
        'Virtual legal clinics',
        'Legal chatbots'
      ],
      color: 'neutral-dark'
    }
  ];

  const impactStats = [
    { number: '26,000+', label: 'People Assisted', icon: Users },
    { number: '184', label: 'Districts Covered', icon: Globe },
    { number: '500+', label: 'Paralegals Trained', icon: BookOpen },
    { number: '15', label: 'Years of Experience', icon: Scale }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-secondary-teal py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We advance access to justice across Tanzania through legal aid, community empowerment, 
              policy advocacy, and innovative digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Focus Areas</h2>
            <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
              We work across four key areas to ensure justice is accessible to all Tanzanians
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20 p-8 h-full">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                    area.color === 'primary' ? 'bg-primary/10' :
                    area.color === 'secondary-teal' ? 'bg-secondary-teal/10' :
                    area.color === 'secondary-orange' ? 'bg-secondary-orange/10' :
                    'bg-neutral-dark/10'
                  }`}>
                    <area.icon className={`h-8 w-8 ${
                      area.color === 'primary' ? 'text-primary' :
                      area.color === 'secondary-teal' ? 'text-secondary-teal' :
                      area.color === 'secondary-orange' ? 'text-secondary-orange' :
                      'text-neutral-dark'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-neutral-dark group-hover:text-primary transition-colors duration-300">
                    {area.title}
                  </h3>
                  
                  <p className="text-neutral-gray mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {area.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-neutral-gray">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          area.color === 'primary' ? 'bg-primary' :
                          area.color === 'secondary-teal' ? 'bg-secondary-teal' :
                          area.color === 'secondary-orange' ? 'bg-secondary-orange' :
                          'bg-neutral-dark'
                        }`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-neutral-dark">
              Measurable results in advancing access to justice across Tanzania
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-neutral-dark font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How We Work</h2>
            <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
              Our approach combines grassroots engagement with strategic advocacy to create sustainable change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Community Engagement</h3>
              <p className="text-neutral-gray">
                We start by listening to communities, understanding their legal challenges and building trust through direct engagement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-teal">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Capacity Building</h3>
              <p className="text-neutral-gray">
                We train community paralegals and provide legal education to empower communities with knowledge and skills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-orange">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Systemic Change</h3>
              <p className="text-neutral-gray">
                We advocate for policy reforms and work with institutions to create lasting improvements in the justice system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary-teal">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Involved</h2>
            <p className="text-xl opacity-90 mb-8">
              Join us in advancing access to justice across Tanzania. Together, we can ensure that everyone has equal protection under the law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                  Join Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhatWeDo;
