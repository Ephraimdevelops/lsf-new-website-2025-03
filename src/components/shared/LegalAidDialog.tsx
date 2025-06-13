
import { useState } from 'react';
import { Phone, Download, MapPin, Users, Scale, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import Typography from '@/components/shared/Typography';

// Regional coverage with localized hotlines
const regions = [
  { name: "All Regions", phone: "+255 870 119 363" },
  { name: "Dar es Salaam", phone: "+255 717 111 764" },
  { name: "Mwanza", phone: "+255 769 517 305" },
  { name: "Arusha", phone: "+255 629 296 306" },
  { name: "Dodoma", phone: "+255 754 110 307" },
  { name: "Tanga", phone: "+255 711 032 998" },
  { name: "Morogoro", phone: "+255 800 110 309" },
  { name: "Mbeya", phone: "+255 745 887 221" },
  { name: "Iringa", phone: "+255 762 334 556" }
];

interface LegalAidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LegalAidDialog = ({ open, onOpenChange }: LegalAidDialogProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [hotlineNumber, setHotlineNumber] = useState(regions[0].phone);

  // Update hotline number when region changes
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    const region = regions.find(r => r.name === value);
    if (region) {
      setHotlineNumber(region.phone);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Typography variant="h3" className="text-primary">Get Free Legal Aid</Typography>
              <Typography variant="bodySmall" className="text-neutral-600">Available in all 184 districts</Typography>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="region-select" className="block text-sm font-medium mb-2 text-neutral-dark">
              Select Your Region
            </label>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.name} value={region.name}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-xl border border-primary/20">
            <Phone className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <Typography variant="bodySmall" className="text-neutral-dark font-medium">24/7 Legal Helpline</Typography>
              <a href={`tel:${hotlineNumber.replace(/\s/g, '')}`} className="text-xl font-bold text-primary">
                {hotlineNumber}
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={`tel:${hotlineNumber.replace(/\s/g, '')}`}
              className="bg-primary text-white hover:bg-primary-dark px-4 py-3 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.hakiyangu.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-teal text-white hover:bg-opacity-90 px-4 py-3 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Get App
            </a>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Typography variant="small" className="text-gray-600 text-center">
              Free legal consultation • Available in Swahili & English • Confidential support
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalAidDialog;
