
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import FAQSection from '@/components/shared/FAQSection';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  Globe,
  Users,
  Building,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    category: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Main Office",
      details: [
        "LSF House, Plot 123",
        "Msimbazi Street, Kariakoo",
        "P.O. Box 12345",
        "Dar es Salaam, Tanzania"
      ],
      color: "from-primary to-primary-dark"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Numbers",
      details: [
        "+255 22 212 4567 (Main)",
        "+255 22 212 4568 (Programs)",
        "+255 784 567 890 (Mobile)",
        "+255 22 212 4569 (Emergency)"
      ],
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Addresses",
      details: [
        "info@lsf.or.tz (General)",
        "programs@lsf.or.tz (Programs)",
        "partnerships@lsf.or.tz (Partnerships)",
        "media@lsf.or.tz (Press)"
      ],
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
        "Sunday: Closed",
        "Public Holidays: Closed"
      ],
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  const regionalOffices = [
    {
      region: "Northern Zone",
      city: "Arusha",
      address: "Plot 45, Sokoine Road",
      phone: "+255 27 250 4567",
      email: "arusha@lsf.or.tz",
      coordinator: "Grace Mwanga"
    },
    {
      region: "Lake Zone",
      city: "Mwanza",
      address: "Plot 78, Kenyatta Road",
      phone: "+255 28 250 8901",
      email: "mwanza@lsf.or.tz",
      coordinator: "John Magufuli"
    },
    {
      region: "Central Zone",
      city: "Dodoma",
      address: "Plot 90, Uhuru Street",
      phone: "+255 26 232 1234",
      email: "dodoma@lsf.or.tz",
      coordinator: "Fatuma Hassan"
    },
    {
      region: "Southern Zone",
      city: "Mbeya",
      address: "Plot 56, Market Street",
      phone: "+255 25 250 5678",
      email: "mbeya@lsf.or.tz",
      coordinator: "Michael Chacha"
    }
  ];

  const inquiryCategories = [
    { value: 'general', label: 'General Information' },
    { value: 'partnerships', label: 'Partnership Opportunities' },
    { value: 'programs', label: 'Program Information' },
    { value: 'legal-aid', label: 'Legal Aid Services' },
    { value: 'media', label: 'Media & Press' },
    { value: 'employment', label: 'Employment Opportunities' },
    { value: 'complaints', label: 'Complaints & Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const faqs = [
    {
      question: "How can I access legal aid services through LSF?",
      answer: "LSF works through partner organizations across Tanzania. You can contact our main office for referrals to legal aid providers in your area, or visit our Legal Aid Finder tool on our website to locate services near you."
    },
    {
      question: "Does LSF provide direct legal representation?",
      answer: "LSF primarily works as a coordinating and funding organization. We don't provide direct legal representation but support organizations that do. We can refer you to appropriate legal aid providers based on your location and legal needs."
    },
    {
      question: "How can my organization partner with LSF?",
      answer: "Organizations can apply for partnerships through our grants program. We evaluate applications based on alignment with our strategic objectives, organizational capacity, and potential impact. Visit our Programs page for detailed application guidelines."
    },
    {
      question: "Are LSF's services free?",
      answer: "All services provided through LSF's partner network are free for qualifying individuals. Our mission is to ensure access to justice regardless of economic status. Eligibility criteria are applied to ensure services reach those most in need."
    },
    {
      question: "How can I report concerns or provide feedback?",
      answer: "We welcome feedback through multiple channels: email us at feedback@lsf.or.tz, call our feedback hotline, or submit concerns through our online portal. We take all feedback seriously and investigate complaints promptly."
    },
    {
      question: "Do you have internship or volunteer opportunities?",
      answer: "Yes, we offer internship programs for law students and recent graduates, as well as volunteer opportunities for professionals. Check our Opportunities page for current openings and application procedures."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <HeroSection
        icon={<MessageSquare className="h-8 w-8" />}
        badge="CONTACT US"
        title="Connect With Us Today"
        description="Whether you need legal aid, want to partner with us, or have questions about our work, we're here to help. Reach out through any of our convenient contact channels."
        backgroundImage="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop"
      />

      {/* Contact Information */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary font-bold mb-4">
              GET IN TOUCH
            </Typography>
            <Typography variant="h2" className="mb-6">
              Multiple Ways to Reach Us
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              We provide multiple contact channels to ensure you can reach us conveniently. 
              Our team is ready to assist with your inquiries and connect you with the right resources.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} variant="elevated" hover className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>
                <Typography variant="h4" className="mb-4">
                  {info.title}
                </Typography>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <Typography key={detailIndex} variant="bodySmall" className="text-neutral-gray">
                      {detail}
                    </Typography>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card variant="elevated" className="lg:order-2">
              <div className="mb-6">
                <Typography variant="h3" className="mb-3">
                  Send us a Message
                </Typography>
                <Typography variant="body" className="text-neutral-gray">
                  Fill out the form below and we'll get back to you within 24 hours during business days.
                </Typography>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Organization (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Inquiry Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    {inquiryCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Quick Contact Options */}
            <div className="lg:order-1">
              <Typography variant="h3" className="mb-6">
                Need Immediate Assistance?
              </Typography>

              <div className="space-y-6">
                <Card variant="flat" className="p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Typography variant="h4" className="mb-2">
                        Emergency Legal Aid
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray mb-3">
                        For urgent legal matters requiring immediate attention
                      </Typography>
                      <Typography variant="bodySmall" className="font-semibold text-red-600">
                        Call: +255 784 567 890 (24/7)
                      </Typography>
                    </div>
                  </div>
                </Card>

                <Card variant="flat" className="p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Typography variant="h4" className="mb-2">
                        WhatsApp Support
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray mb-3">
                        Quick questions and basic information
                      </Typography>
                      <Typography variant="bodySmall" className="font-semibold text-blue-600">
                        +255 784 567 890
                      </Typography>
                    </div>
                  </div>
                </Card>

                <Card variant="flat" className="p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <Typography variant="h4" className="mb-2">
                        Schedule a Meeting
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray mb-3">
                        Book a consultation with our team
                      </Typography>
                      <Button variant="outline" size="sm">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Regional Offices */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Regional Offices
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Our regional presence ensures localized support across Tanzania
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalOffices.map((office, index) => (
              <Card key={index} variant="elevated" hover>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <Typography variant="h4" className="mb-1">
                    {office.region}
                  </Typography>
                  <Typography variant="bodySmall" className="text-primary font-semibold">
                    {office.city}
                  </Typography>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-neutral-gray mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-gray">{office.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-neutral-gray mr-2 flex-shrink-0" />
                    <span className="text-neutral-gray">{office.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-neutral-gray mr-2 flex-shrink-0" />
                    <span className="text-neutral-gray">{office.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-neutral-gray mr-2 flex-shrink-0" />
                    <span className="text-neutral-gray">{office.coordinator}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our services and how to reach us"
        faqs={faqs}
      />

      {/* Map and Directions */}
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Find Our Main Office
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Located in the heart of Dar es Salaam, easily accessible by public transport
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card variant="flat" className="h-96 bg-neutral-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                  <Typography variant="h4" className="text-neutral-600">
                    Interactive Map
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-500">
                    Map integration would be implemented here
                  </Typography>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated">
                <Typography variant="h4" className="mb-4">
                  Directions & Transport
                </Typography>
                <div className="space-y-3 text-sm">
                  <div>
                    <Typography variant="bodySmall" className="font-semibold mb-1">
                      By Dalla Dalla:
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Take any dalla dalla to Kariakoo and alight at Msimbazi Street
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="bodySmall" className="font-semibold mb-1">
                      By Taxi/Uber:
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Search for "LSF House Kariakoo" or use coordinates: -6.8162, 39.2844
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="bodySmall" className="font-semibold mb-1">
                      Parking:
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Limited parking available on-site. Street parking nearby.
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card variant="elevated">
                <Typography variant="h4" className="mb-4">
                  Accessibility
                </Typography>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-neutral-gray">Wheelchair accessible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-neutral-gray">Ground floor entrance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-neutral-gray">Sign language interpreter available</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Contact;
