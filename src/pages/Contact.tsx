
import Layout from '../components/layout/Layout';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">
              Have a question, comment, or want to collaborate? Get in touch with our team.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visit Us</h3>
              <p className="text-neutral-gray">
                Plot No. 1, Jillian Plaza<br />
                Mbezi Beach, Dar es Salaam<br />
                Tanzania
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Us</h3>
              <p className="text-neutral-gray mb-2">
                General Inquiries:<br />
                <a href="mailto:info@lsftz.org" className="text-primary">info@lsftz.org</a>
              </p>
              <p className="text-neutral-gray">
                Media Relations:<br />
                <a href="mailto:media@lsftz.org" className="text-primary">media@lsftz.org</a>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Call Us</h3>
              <p className="text-neutral-gray mb-2">
                Main Office:<br />
                <a href="tel:+255800110303" className="text-primary">+255 800 110 303</a>
              </p>
              <p className="text-neutral-gray">
                Hotline:<br />
                <a href="tel:+255800110000" className="text-primary">+255 800 110 000</a>
              </p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-neutral-gray mb-6">
                Fill out the form below and our team will get back to you as soon as possible.
                We appreciate your interest in Legal Services Facility and look forward to hearing from you.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Your Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Legal Aid Support">Legal Aid Support</option>
                    <option value="Partnership Opportunity">Partnership Opportunity</option>
                    <option value="Volunteer Interest">Volunteer Interest</option>
                    <option value="Media Inquiry">Media Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-primary/90 transition-colors duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="order-first lg:order-last">
              <div className="rounded-lg overflow-hidden h-full min-h-[300px] shadow-lg">
                <iframe
                  title="LSF Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.9689930330353!2d39.2990775!3d-6.7729466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4c2bfc2e8ce7%3A0xdb557217e053c0ee!2sMbezi%20Beach%2C%20Dar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1652971927296!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              Find answers to common questions about our organization and services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">How can I access legal aid services?</h3>
              <p className="text-neutral-gray">
                Legal aid services can be accessed through our network of paralegals and legal aid providers across Tanzania. 
                Contact our office or visit our Resources page to find the nearest legal aid provider in your area.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">How can organizations partner with LSF?</h3>
              <p className="text-neutral-gray">
                We welcome partnerships with organizations that share our mission of promoting access to justice. 
                Please fill out the contact form above and select "Partnership Opportunity" as the subject, 
                or email us directly at partnerships@lsftz.org.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Does LSF provide funding to legal aid organizations?</h3>
              <p className="text-neutral-gray">
                Yes, as a basket fund, LSF provides grants to qualified legal aid organizations in Tanzania. 
                Grant opportunities are announced on our website and through our newsletter. 
                Visit our Resources page for more information on funding criteria and application processes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">How can I volunteer or work with LSF?</h3>
              <p className="text-neutral-gray">
                We occasionally have volunteer opportunities and job openings. Check our News section for current 
                positions or fill out the contact form with "Volunteer Interest" as the subject to express your interest.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
