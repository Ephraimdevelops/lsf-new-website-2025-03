import { Send, CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Typography from '@/components/shared/Typography';

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

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    category: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string | null;
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
}

export const ContactForm = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  error,
  submitted,
  setSubmitted
}: ContactFormProps) => {
  return (
    <div className="bg-card/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-border">
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <Typography variant="h3" className="mb-4 text-2xl">
            Thank You!
          </Typography>
          <Typography variant="body" className="text-muted-foreground mb-6">
            Your message has been sent successfully. We'll get back to you within 24 hours.
          </Typography>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-3 rounded-full transition-colors duration-300"
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
            <Typography variant="bodySmall" className="text-muted-foreground">
              Fill out the form below and we'll respond promptly
            </Typography>
          </div>
          
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-sm">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-sm">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="+255 XXX XXX XXX"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block mb-2 font-medium text-sm">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
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
            <label htmlFor="subject" className="block mb-2 font-medium text-sm">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
              placeholder="Brief description of your inquiry"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-2 font-medium text-sm">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Please provide detailed information about your inquiry..."
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${
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
  );
};