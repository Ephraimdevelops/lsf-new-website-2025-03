import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send,
  CheckCircle, ArrowRight, Globe, Users, Building, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/shared/SEOHead';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Honeypot, useHoneypot } from '@/components/Honeypot';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ContactPage = () => {
  // SEO handled by SEOHead component below


  /* 
   * NEW: Security & Persistence Hooks 
   */
  const isOnline = useOnlineStatus();
  const { honeypotValue, honeypotProps, isBotDetected } = useHoneypot('roleTitle');

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  const [formData, setFormData, clearStorage] = useFormPersistence(
    'lsf_contact_form_v1',
    initialFormState
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = useMutation(api.formSubmissions.submitContact);

  const heroImages = [
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/Danida-lsf-signing.jpg",
    "/lovable-uploads/wanawake tunaweza beenficiaries.jpg"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Security: Honeypot Check
    if (isBotDetected()) {
      console.log('[Security] Bot detected via honeypot');
      setIsSubmitted(true);
      clearStorage();
      return;
    }

    // 2. Network Check
    if (!isOnline) {
      setError('You are offline. Your message is saved and can be sent when you are back online. / Uko nje ya mtandao. Ujumbe wako umehifadhiwa.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactForm({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        category: 'general',
        subject: formData.subject,
        message: formData.message,
        // Pass honeypot value to backend
        roleTitle: honeypotValue,
      });
      setIsSubmitted(true);
      clearStorage(); // Clear storage on success
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { icon: <Phone className="h-6 w-6" />, title: 'Call Us', value: '+255 870 119 363', description: 'Mon-Fri 8AM-5PM EAT', link: 'tel:+255870119363', color: 'bg-green-500' },
    { icon: <Mail className="h-6 w-6" />, title: 'Email Us', value: 'info@lsftz.org', description: 'Response within 24 hours', link: 'mailto:info@lsftz.org', color: 'bg-blue-500' },
    { icon: <MapPin className="h-6 w-6" />, title: 'Visit Us', value: 'Chole Rd, Masaki', description: 'Dar es Salaam, Tanzania', link: 'https://maps.google.com/?q=Chole+Road+Masaki+Dar+es+Salaam+Tanzania', color: 'bg-primary' },
    { icon: <MessageCircle className="h-6 w-6" />, title: 'AI Assistant', value: 'Chat Now', description: 'Get instant legal guidance', link: '/lsfchatbot', color: 'bg-purple-500' }
  ];

  const quickLinks = [
    { icon: <Users className="h-5 w-5" />, label: 'Find a Paralegal', href: '/legal-help' },
    { icon: <Headphones className="h-5 w-5" />, label: 'Legal Helpline', href: 'tel:+255870119363' },
    { icon: <Building className="h-5 w-5" />, label: 'Partner With Us', href: '/opportunities' },
    { icon: <Globe className="h-5 w-5" />, label: 'About LSF', href: '/about' }
  ];

  return (
    <Layout>
      <SEOHead
        title="Contact Us"
        description="Get in touch with the Legal Services Facility (LSF). We are here to help with legal assistance, partnerships, and inquiries."
        type="website"
        canonicalUrl="https://lsftz.org/contact"
      />
      {/* Hero Section - Unique Split Design with Brand Pattern */}
      <section className="relative bg-black min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
            {heroImages.map((img, idx) => (
              <div key={idx} className="h-full w-full relative">
                <div className="absolute inset-0 bg-primary/70 z-10" />
                <img src={img} alt={`Contact slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        {/* Brand Pattern Overlay */}
        <div
          className="absolute inset-0 z-[5] opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
            backgroundSize: '150px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 min-h-[70vh] flex flex-col justify-center items-center text-center py-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Send className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get In Touch</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              We're Here To Help You
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              Whether you need legal assistance, want to partner with us, or have questions — our team is ready to support you.
            </Typography>
          </div>
        </div>
      </section>

      {/* Floating Contact Cards - Unique to Contact Page */}
      <section className="relative z-30 -mt-20 pb-10">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${method.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-primary font-bold mb-1">{method.value}</p>
                <p className="text-gray-500 text-sm">{method.description}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Links Bar */}
      <section className="py-8 bg-primary">
        <Container>
          <div className="flex flex-wrap gap-4 justify-center">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/20 transition-all font-bold text-sm"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form Section - Premium Design */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Info */}
            <div>
              <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                <Send className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Send a Message</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Let's Start a <span className="text-primary">Conversation</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-10">
                Have a question about our services? Need legal assistance? Want to partner with us? Fill out the form and we'll get back to you within 24 hours.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {[
                  'Free initial consultation for legal matters',
                  'Confidential and secure communication',
                  'Multilingual support (Swahili & English)',
                  'Response within 24 business hours'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Need Urgent Legal Help?</p>
                    <p className="text-white/80 text-sm">Call our helpline directly</p>
                  </div>
                </div>
                <a
                  href="tel:+255870119363"
                  className="inline-flex items-center gap-3 bg-white text-primary font-bold text-xl px-6 py-4 rounded-xl hover:bg-white/90 transition-all"
                >
                  +255 870 119 363
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Honeypot {...honeypotProps} />
                    {!isOnline && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Offline Mode</p>
                        <p>You are currently offline. Your form data is saved locally.</p>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                          placeholder="+255 xxx xxx xxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="legal-help">I need legal help</option>
                        <option value="partnership">Partnership inquiry</option>
                        <option value="donation">Donation / Support</option>
                        <option value="media">Media inquiry</option>
                        <option value="careers">Careers / Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Office Hours & Location */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Office Hours */}
            <div className="bg-gray-50 rounded-3xl p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Office Hours</h3>
                  <p className="text-gray-600">When you can reach us</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-bold text-gray-900">Monday - Friday</span>
                  <span className="text-primary font-bold">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-bold text-gray-900">Saturday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-bold text-gray-900">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
              <p className="mt-6 text-gray-600 text-sm">
                <strong>Note:</strong> For urgent legal matters outside office hours, please use our AI Legal Assistant or call our emergency helpline.
              </p>
            </div>

            {/* Location */}
            <div className="bg-primary rounded-3xl p-10 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Our Location</h3>
                  <p className="text-white/80">Visit our office</p>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-xl font-bold">Legal Services Facility</p>
                <p className="text-white/80">Chole Road, Masaki</p>
                <p className="text-white/80">Dar es Salaam, Tanzania</p>
              </div>
              <a
                href="https://maps.google.com/?q=Chole+Road+Masaki+Dar+es+Salaam+Tanzania"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-5 rounded-full">
                  Open in Google Maps
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default ContactPage;
