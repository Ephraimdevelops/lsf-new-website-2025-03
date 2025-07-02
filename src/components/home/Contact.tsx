import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Users, Scale, Heart, CheckCircle } from 'lucide-react';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ResponsiveContainer from '@/components/shared/ResponsiveContainer';
import Typography from '@/components/shared/Typography';
import { ContactInfo } from './contact/ContactInfo';
import { ContactForm } from './contact/ContactForm';
import { QuickActions } from './contact/QuickActions';
import { ServiceAreas } from './contact/ServiceAreas';

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

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-background to-neutral-100"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <ResponsiveContainer className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Heart className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              GET IN TOUCH
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6">
            We're Here to Help
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
            Whether you need legal assistance, want to partner with us, or have questions about our work, 
            our team is ready to support you. Reach out and let's create positive change together.
          </Typography>
        </div>

        {/* Contact Info Cards */}
        <ContactInfo />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Form */}
          <ContactForm 
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            submitted={submitted}
            setSubmitted={setSubmitted}
          />
          
          {/* Quick Actions & Info */}
          <div className="space-y-6 md:space-y-8">
            <QuickActions />
            <ServiceAreas />
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default Contact;