import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Typography from '@/components/shared/Typography';

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
    gradient: "from-secondary-teal to-secondary-teal-dark"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Us",
    details: "info@lsftz.org",
    subDetails: "We respond within 24 hours",
    gradient: "from-secondary-orange to-secondary-orange-dark"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Office Hours",
    details: "Monday - Friday: 8:00 AM - 5:00 PM",
    subDetails: "Saturday: 9:00 AM - 1:00 PM",
    gradient: "from-secondary-yellow to-secondary-yellow-dark"
  }
];

export const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
      {contactInfo.map((info, index) => (
        <div key={index} className="group bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:-translate-y-1">
          <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mb-4 text-primary-foreground group-hover:scale-110 transition-transform duration-300`}>
            {info.icon}
          </div>
          <Typography variant="h4" className="text-lg font-semibold mb-2">
            {info.title}
          </Typography>
          <Typography variant="bodySmall" className="text-muted-foreground mb-1">
            {info.details}
          </Typography>
          <Typography variant="bodySmall" className="text-muted-foreground/80">
            {info.subDetails}
          </Typography>
        </div>
      ))}
    </div>
  );
};