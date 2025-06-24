
import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Users, Scale, Heart, CheckCircle } from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  
  const { submitForm, isSubmitting, error } = useFormSubmission({
    successMessage: 'Thank you! Your message has been sent successfully.',
    errorMessage: 'Failed to send message. Please try again.',
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm(formData, '/api/contact');
    
    if (result.success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
      
      // Reset submitted state after a few seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Our Office",
      details: "Plot No. 1, Jillian Plaza, Mbezi Beach",
      subDetails: "Dar es Salaam, Tanzania",
      gradient: "from-primary to-primary-dark"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "Toll FREE: +255 800 110 303",
      subDetails: "Available 24/7 for emergencies",
      gradient: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "info@lsftz.org",
      subDetails: "We respond within 24 hours",
      gradient: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Office Hours",
      details: "Monday - Friday: 8:00 AM - 5:00 PM",
      subDetails: "Saturday: 9:00 AM - 1:00 PM",
      gradient: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  const serviceCategories = [
    { value: '', label: 'Select a category' },
    { value: 'legal-aid', label: 'Legal Aid Request' },
    { value: 'partnership', label: 'Partnership Inquiry' },
    { value: 'volunteer', label: 'Volunteer Opportunity' },
    { value: 'training', label: 'Training & Capacity Building' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Heart className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              GET IN TOUCH
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6 text-4xl lg:text-5xl">
            We're Here to Help
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
            Whether you need legal assistance, want to partner with us, or have questions about our work, 
            our team is ready to support you. Reach out and let's create positive change together.
          </Typography>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
              <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                {info.icon}
              </div>
              <Typography variant="h4" className="text-lg font-semibold mb-2 text-neutral-dark">
                {info.title}
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray mb-1">
                {info.details}
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray/80">
                {info.subDetails}
              </Typography>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <Typography variant="h3" className="mb-4 text-2xl">
                  Thank You!
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </Typography>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <Typography variant="h3" className="mb-2 text-2xl">
                    Send Us a Message
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Fill out the form below and we'll respond promptly
                  </Typography>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-sm text-neutral-dark">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-sm text-neutral-dark">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium text-sm text-neutral-dark">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                      placeholder="+255 XXX XXX XXX"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block mb-2 font-medium text-sm text-neutral-dark">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    >
                      {serviceCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium text-sm text-neutral-dark">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                    placeholder="Brief description of your inquiry"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-sm text-neutral-dark">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Please provide detailed information about your inquiry..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-3" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-3 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Quick Actions & Info */}
          <div className="space-y-8">
            {/* Quick Contact Options */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
              <Typography variant="h3" className="mb-6 text-2xl">
                Quick Actions
              </Typography>
              
              <div className="space-y-4">
                <a href="tel:+255800110303" className="group flex items-center p-4 bg-gradient-to-r from-secondary-teal/10 to-secondary-teal/5 rounded-xl hover:from-secondary-teal/20 hover:to-secondary-teal/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-teal to-secondary-teal/80 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h4" className="text-lg font-semibold">
                      Emergency Legal Help
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Call our 24/7 hotline for urgent assistance
                    </Typography>
                  </div>
                </a>
                
                <a href="mailto:info@lsftz.org" className="group flex items-center p-4 bg-gradient-to-r from-secondary-orange/10 to-secondary-orange/5 rounded-xl hover:from-secondary-orange/20 hover:to-secondary-orange/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-orange to-secondary-orange/80 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h4" className="text-lg font-semibold">
                      General Inquiries
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Send us an email for non-urgent matters
                    </Typography>
                  </div>
                </a>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
              <Typography variant="h3" className="mb-6 text-2xl">
                How We Can Help
              </Typography>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mt-1">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      Free Legal Aid
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Access to qualified paralegals and legal support
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-teal/20 rounded-lg flex items-center justify-center mt-1">
                    <Users className="h-5 w-5 text-secondary-teal" />
                  </div>
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      Community Programs
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Training, workshops, and capacity building
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-orange/20 rounded-lg flex items-center justify-center mt-1">
                    <Heart className="h-5 w-5 text-secondary-orange" />
                  </div>
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      Strategic Partnerships
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Collaborate with us to expand access to justice
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
