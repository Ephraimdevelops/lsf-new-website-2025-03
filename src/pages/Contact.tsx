
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<MessageCircle className="h-8 w-8" />}
        badge="Contact Us"
        title="Get in Touch"
        description="We're here to help. Reach out to us for inquiries, support, or to learn more about our work transforming access to justice across Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Contact Methods Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                REACH OUT
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-6">
              Multiple Ways to Connect
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Choose the most convenient way to reach us. We're committed to responding promptly to all inquiries.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: "Phone",
                primary: "+255 22 277 3342",
                secondary: "+255 784 123 456",
                color: "primary",
                action: "Call Us"
              },
              {
                icon: Mail,
                title: "Email",
                primary: "info@lsf.or.tz",
                secondary: "programs@lsf.or.tz",
                color: "secondary-teal",
                action: "Send Email"
              },
              {
                icon: MapPin,
                title: "Visit Us",
                primary: "Mikocheni Light Industrial Area",
                secondary: "Dar es Salaam, Tanzania",
                color: "secondary-orange",
                action: "Get Directions"
              },
              {
                icon: Clock,
                title: "Office Hours",
                primary: "Monday - Friday",
                secondary: "8:00 AM - 5:00 PM",
                color: "secondary-yellow",
                action: "Plan Visit"
              }
            ].map((contact, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2 h-full text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${contact.color}/10 to-${contact.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <contact.icon className={`h-8 w-8 text-${contact.color}`} />
                  </div>
                  
                  <Typography variant="h4" className="mb-4">
                    {contact.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-dark font-medium mb-1">
                    {contact.primary}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray mb-6">
                    {contact.secondary}
                  </Typography>
                  
                  <Button variant="outline" size="sm" className="border-2 hover:bg-secondary-teal hover:text-white hover:border-secondary-teal">
                    {contact.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div>
              <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-8">
                <Send className="h-5 w-5 mr-3 text-secondary-teal" />
                <Typography variant="overline" className="text-secondary-teal font-bold">
                  SEND MESSAGE
                </Typography>
              </div>
              
              <Typography variant="h2" className="mb-6">
                Send Us a Message
              </Typography>
              
              <Typography variant="body" className="text-neutral-gray mb-8">
                Have a question or want to learn more about our work? Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-dark mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-xl border-2 focus:border-secondary-teal"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-xl border-2 focus:border-secondary-teal"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-secondary-teal"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="rounded-xl border-2 focus:border-secondary-teal resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-secondary-teal hover:bg-secondary-teal/90 font-bold py-4 rounded-xl"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Office Location */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                
                <Typography variant="h3" className="mb-4">
                  Our Office
                </Typography>
                
                <Typography variant="bodySmall" className="text-neutral-gray mb-6 leading-relaxed">
                  Visit us at our headquarters in Dar es Salaam. We welcome visitors by appointment and are always happy to meet with partners, beneficiaries, and supporters.
                </Typography>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <Typography variant="bodySmall" className="text-neutral-dark font-medium">
                        Legal and Human Rights Centre
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        Mikocheni Light Industrial Area<br />
                        Plot No. 35, Dar es Salaam, Tanzania
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/90 rounded-2xl shadow-lg p-8 text-white">
                <Typography variant="h3" className="text-white mb-6">
                  Get Involved
                </Typography>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Typography variant="bodySmall" className="text-white font-medium">
                        Join Our Team
                      </Typography>
                      <Typography variant="bodySmall" className="text-white/80">
                        Explore career opportunities
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Typography variant="bodySmall" className="text-white font-medium">
                        Partner With Us
                      </Typography>
                      <Typography variant="bodySmall" className="text-white/80">
                        Collaborate for greater impact
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Contact;
