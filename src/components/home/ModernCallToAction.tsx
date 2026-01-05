import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Heart, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModernCallToAction = () => {
  const actions = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Get Legal Help',
      description: 'Connect with our paralegals',
      cta: 'Call Now',
      href: 'tel:+255870119363',
      color: 'bg-green-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Join Our Network',
      description: 'Become a community paralegal',
      cta: 'Learn More',
      href: '/opportunities',
      color: 'bg-secondary-teal',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Support Our Mission',
      description: 'Help expand access to justice',
      cta: 'Donate',
      href: '/donate',
      color: 'bg-secondary-orange',
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'AI Legal Assistant',
      description: '24/7 legal guidance',
      cta: 'Chat Now',
      href: '/lsfchatbot',
      color: 'bg-primary',
    },
  ];

  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-6 bg-primary/10 rounded-full px-5 py-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-sm uppercase tracking-widest">Take Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Ready to Make a <span className="text-primary">Difference?</span>
          </h2>
          <p className="text-neutral-600 text-lg">
            Join thousands of Tanzanians transforming their communities through access to justice.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-neutral-100 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-neutral-500 mb-6">{action.description}</p>
              <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                {action.cta}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Have Questions?</h3>
              <p className="text-white/70">Our team is here to help you navigate legal challenges.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+255870119363">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-white/90 font-bold px-8 py-5 rounded-full">
                  <Phone className="mr-2 h-5 w-5" />
                  +255 870 119 363
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-8 py-5 rounded-full">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernCallToAction;
