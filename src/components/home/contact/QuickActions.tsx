import { Phone, Mail } from 'lucide-react';
import Typography from '@/components/shared/Typography';

export const QuickActions = () => {
  return (
    <div className="bg-card/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-border">
      <Typography variant="h3" className="mb-6 text-2xl">
        Quick Actions
      </Typography>
      
      <div className="space-y-4">
        <a href="tel:+255800110303" className="group flex items-center p-4 bg-gradient-to-r from-secondary-teal/10 to-secondary-teal/5 rounded-xl hover:from-secondary-teal/20 hover:to-secondary-teal/10 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-teal to-secondary-teal-dark rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-lg font-semibold">
              Emergency Legal Help
            </Typography>
            <Typography variant="bodySmall" className="text-muted-foreground">
              Call our 24/7 hotline for urgent assistance
            </Typography>
          </div>
        </a>
        
        <a href="mailto:info@lsftz.org" className="group flex items-center p-4 bg-gradient-to-r from-secondary-orange/10 to-secondary-orange/5 rounded-xl hover:from-secondary-orange/20 hover:to-secondary-orange/10 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-orange to-secondary-orange-dark rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-lg font-semibold">
              General Inquiries
            </Typography>
            <Typography variant="bodySmall" className="text-muted-foreground">
              Send us an email for non-urgent matters
            </Typography>
          </div>
        </a>
      </div>
    </div>
  );
};