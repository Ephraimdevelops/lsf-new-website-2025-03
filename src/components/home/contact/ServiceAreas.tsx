import { Scale, Users, Heart } from 'lucide-react';
import Typography from '@/components/shared/Typography';

export const ServiceAreas = () => {
  return (
    <div className="bg-card/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-border">
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
            <Typography variant="bodySmall" className="text-muted-foreground">
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
            <Typography variant="bodySmall" className="text-muted-foreground">
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
            <Typography variant="bodySmall" className="text-muted-foreground">
              Collaborate with us to expand access to justice
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};