
import { useState, useEffect } from 'react';
import { Phone, Scale, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions } from './heroData';

const LegalAidWidget = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [hotlineNumber, setHotlineNumber] = useState(regions[0].phone);

  // Update hotline number when region changes
  useEffect(() => {
    const region = regions.find(r => r.name === selectedRegion);
    if (region) {
      setHotlineNumber(region.phone);
    }
  }, [selectedRegion]);

  return (
    <div className="lg:col-span-5">
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-4 rounded-2xl shadow-lg">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-primary text-3xl font-bold font-heading">Get Free Legal Aid</h3>
            <p className="text-neutral-600 text-lg">Available in all 184 districts</p>
          </div>
        </div>
        
        <div className="mb-8">
          <label htmlFor="region-select" className="block text-base font-medium mb-3 text-neutral-dark">
            Select Your Region
          </label>
          <Select
            value={selectedRegion}
            onValueChange={(value) => setSelectedRegion(value)}
          >
            <SelectTrigger className="w-full bg-white border-gray-200 h-12 shadow-sm hover:shadow-md transition-shadow">
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
        
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-primary/10 rounded-2xl border border-primary/20 shadow-inner">
          <Phone className="h-10 w-10 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-neutral-dark">24/7 Legal Helpline</p>
            <a href={`tel:${hotlineNumber.replace(/\s/g, '')}`} className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
              {hotlineNumber}
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <a 
            href={`tel:${hotlineNumber.replace(/\s/g, '')}`}
            className="bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary px-6 py-4 rounded-xl text-center font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
          <a 
            href="https://play.google.com/store/apps/details?id=com.hakiyangu.app" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-secondary-teal to-secondary-teal/80 text-white hover:from-secondary-teal/90 hover:to-secondary-teal px-6 py-4 rounded-xl text-center font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Download className="h-5 w-5" />
            Get App
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Free legal consultation • Available in Swahili & English • Confidential support
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalAidWidget;
