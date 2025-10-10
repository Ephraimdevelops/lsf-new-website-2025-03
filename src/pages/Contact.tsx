
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+255 870 119 363', '+255 22 213 1234'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@lsf.or.tz', 'support@lsf.or.tz'],
      description: 'Send us a message anytime'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['Dar es Salaam, Tanzania', 'Plot 123, Masaki'],
      description: 'Visit our main office'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 1:00 PM'],
      description: 'We\'re here to help during business hours'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Container size="2xl" className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <MessageCircle className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Get in Touch
              </Typography>
            </div>
            
            <Typography 
              variant="h1" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Contact
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Legal Support Facility
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              We're here to help you access justice and legal support. Reach out to us through any of the channels below, 
              and our team will get back to you as soon as possible.
            </Typography>
          </div>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <Container size="2xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl mb-6 shadow-lg">
                  <info.icon className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h4" className="mb-4 text-xl font-bold">
                  {info.title}
                </Typography>
                <div className="space-y-2 mb-4">
                  {info.details.map((detail, idx) => (
                    <Typography key={idx} variant="body" className="text-muted-foreground">
                      {detail}
                    </Typography>
                  ))}
                </div>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  {info.description}
                </Typography>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h3" className="mb-6 text-3xl font-bold">
                  Send us a Message
                </Typography>
                <Typography variant="body" className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Have a question about our services? Need legal assistance? Want to partner with us? 
                  Fill out the form and we'll get back to you within 24 hours.
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Free initial consultation for legal matters
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary-teal rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Confidential and secure communication
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary-orange rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Multilingual support available
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-semibold py-4 rounded-xl"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default ContactPage;
