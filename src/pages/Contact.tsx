import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send,
  CheckCircle, ArrowRight, Globe, Users, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      primary: '+255 870 119 363',
      secondary: '+255 22 260 1534',
      action: 'tel:+255870119363',
      color: 'bg-green-500',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      primary: 'info@lsftz.org',
      secondary: 'support@lsftz.org',
      action: 'mailto:info@lsftz.org',
      color: 'bg-secondary-orange',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Us',
      primary: 'Chole Rd, Masaki',
      secondary: 'Dar es Salaam, Tanzania',
      action: '#map',
      color: 'bg-primary',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Office Hours',
      primary: 'Mon - Fri: 8:00 AM - 5:00 PM',
      secondary: 'Sat: 9:00 AM - 1:00 PM',
      action: null,
      color: 'bg-secondary-teal',
    },
  ];

  const quickActions = [
    { icon: <Users className="h-5 w-5" />, label: 'Find a Paralegal', href: '/legal-help' },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'AI Legal Assistant', href: '/lsfchatbot' },
    { icon: <Building className="h-5 w-5" />, label: 'Partner With Us', href: '/programs' },
    { icon: <Globe className="h-5 w-5" />, label: 'Regional Offices', href: '/about' },
  ];

  return (
    <Layout>
      {/* Hero Section - Dark */}
      <section className="relative min-h-[60vh] flex items-center bg-neutral-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-teal/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
              <MessageCircle className="h-4 w-4 text-secondary-orange" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              We're Here to <span className="text-secondary-orange">Help.</span>
            </h1>

            <p className="text-white/80 text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
              Whether you need legal assistance, want to partner with us, or have questions about our work—our team is ready to support you.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-5 py-3 rounded-full border border-white/20 transition-all hover:scale-105"
                >
                  {action.icon}
                  <span className="font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">{method.title}</h3>
                {method.action ? (
                  <a href={method.action} className="block group">
                    <p className="text-neutral-900 font-semibold group-hover:text-primary transition-colors">{method.primary}</p>
                    <p className="text-neutral-500 text-sm">{method.secondary}</p>
                  </a>
                ) : (
                  <>
                    <p className="text-neutral-900 font-semibold">{method.primary}</p>
                    <p className="text-neutral-500 text-sm">{method.secondary}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Info */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <Send className="h-4 w-4" />
                Send a Message
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Let's Start a Conversation
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-10">
                Have a question about our services? Need legal assistance? Want to partner with us? Fill out the form and we'll get back to you within 24 hours.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {[
                  'Free initial consultation for legal matters',
                  'Confidential and secure communication',
                  'Multilingual support available (Swahili & English)',
                  'Response within 24 business hours',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Emergency Contact */}
              <div className="bg-secondary-orange/10 border-l-4 border-secondary-orange rounded-r-2xl p-6">
                <h4 className="font-bold text-neutral-900 mb-2">Need Urgent Legal Help?</h4>
                <p className="text-neutral-600 mb-4 text-sm">For emergency legal assistance, call our helpline directly:</p>
                <a href="tel:+255870119363" className="inline-flex items-center gap-2 text-secondary-orange font-bold text-lg hover:gap-3 transition-all">
                  <Phone className="h-5 w-5" />
                  +255 870 119 363
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-neutral-100">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Message Sent!</h3>
                  <p className="text-neutral-600 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                      placeholder="+255 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
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
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
      </section>

      {/* Map Section */}
      <section id="map" className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Us</h2>
            <p className="text-white/70">Our main office in Dar es Salaam</p>
          </div>

          <div className="bg-neutral-800 rounded-3xl overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-secondary-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Legal Services Facility</h3>
              <p className="text-white/70 mb-6">Chole Rd, Masaki, Dar es Salaam, Tanzania</p>
              <a
                href="https://maps.google.com/?q=Chole+Road+Masaki+Dar+es+Salaam+Tanzania"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white rounded-full">
                  Open in Google Maps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
