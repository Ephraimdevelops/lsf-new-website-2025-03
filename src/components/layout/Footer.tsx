import { useCopy } from "@/i18n/useCopy";
import { useState, type FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const c = useCopy();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);
  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubscribing(true);
    setNewsletterStatus('');
    try {
      const result = await subscribe({ email, source: 'site_footer' });
      setNewsletterStatus(result.success ? c("You are subscribed to LSF updates.") : c("Unable to subscribe right now. Please try again."));
      if (result.success) setEmail('');
    } catch {
      setNewsletterStatus(c('Unable to subscribe right now. Please try again.'));
    } finally {
      setIsSubscribing(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Programs', href: '/programs' },
    { name: 'Our Impact', href: '/impact' },
    { name: 'Careers', href: '/opportunities' },
    { name: 'LSF Connect', href: '/connect' },
  ];

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Publications', href: '/publications' },
    { name: 'Success Stories', href: '/heroes' },
    { name: 'Legal Resources', href: '/resources' },
    { name: 'Digital Haki Yangu', href: '/haki-yangu' },
    { name: 'How Haki Yangu Works', href: '/haki-yangu/how-it-works' },
  ];

  const getInvolved = [
    { name: 'Get Legal Help', href: '/legal-help' },
    { name: 'Partner With Us', href: '/contact' },
    { name: 'Donate', href: '/donate' },
    { name: 'Whistleblower', href: '/whistleblower' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/legalservicesfacility', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com/legalservicesfacility', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/legalservicesfacility', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/legalservicesfacility', icon: Youtube },
    { name: 'Instagram', href: 'https://instagram.com/legalservicesfacility', icon: Instagram },
  ];

  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">

        {/* Top Section: Brand & Subscribe */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-20 border-b border-white/10 pb-12">
          {/* Brand Promise */}
          <div className="max-w-xl">
            <Link to="/" className="inline-block mb-8">
              <img
                src="/lsf-logo-white.png"
                alt="Legal Services Facility"
                className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <h2 className="text-3xl font-bold leading-tight mb-4">{c("Empowering Justice for All.")}</h2>
            <p className="text-white/70 text-lg leading-relaxed">{c("LSF is a direct implementer and non-profit organization promoting access to justice and legal empowerment across Tanzania.")}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Button asChild className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-6">
                <Link to="/legal-help">{c("Get Legal Help ")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-white/70 text-white bg-transparent hover:bg-white hover:text-primary font-bold rounded-full px-6">
                <Link to="/contact">{c("Contact Us ")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="max-w-xl lg:justify-self-end w-full">
            <h3 className="text-2xl font-bold mb-2">{c("Stay Updated")}</h3>
            <p className="text-white/75 mb-5 text-sm md:text-base">{c("Subscribe to our newsletter for the latest updates on legal aid, resources, and impact stories.")}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                aria-label={c("Email address for newsletter")}
                placeholder="Enter your email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 rounded-full px-5 flex-1 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/50"
              />
              <Button type="submit" disabled={isSubscribing} className="bg-white text-primary hover:bg-white/90 font-bold h-12 px-6 rounded-full shrink-0">
                {isSubscribing ? 'Joining…' : c("Subscribe")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            {newsletterStatus && <p role="status" className="text-white text-sm mt-3">{newsletterStatus}</p>}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Contact - Enhanced */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>{c("Contact Us")}</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">{c("Headquarters")}</p>
                  <p className="text-white/70 text-sm leading-relaxed">Chole Rd, Masaki<br />Dar es Salaam, Tanzania</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">{c("Call Us")}</p>
                  <a href="tel:+255222601534" className="text-white/70 text-sm hover:text-white transition-colors">+255 22 260 1534</a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">{c("Email Us")}</p>
                  <a href="mailto:info@lsftz.org" className="text-white/70 text-sm hover:text-white transition-colors">info@lsftz.org</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>{c("Organization")}</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={c(link.name)}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {c(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>{c("Resources")}</h4>
            <ul className="space-y-4">
              {resources.map((link) => (
                <li key={c(link.name)}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {c(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>{c("Take Action")}</h4>
            <ul className="space-y-4 mb-8">
              {getInvolved.map((link) => (
                <li key={c(link.name)}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {c(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/donate">
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">{c("Make a Donation")}</Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()}{c(" Legal Services Facility. All rights reserved.")}</p>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">{c("Privacy")}</Link>
            <Link to="/terms" className="text-white/50 hover:text-white text-sm transition-colors">{c("Terms")}</Link>
            <a href="/fonts/OFL-Onest.txt" className="text-white/50 hover:text-white text-sm transition-colors">{c("Font license")}</a>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">{c("Back to Top ")}<ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
