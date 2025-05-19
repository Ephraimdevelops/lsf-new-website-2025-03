
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LegalAidCenter {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  address: string;
  region: string;
}

const legalAidCenters: LegalAidCenter[] = [
  {
    id: "dar-center",
    name: "Dar es Salaam Legal Aid Center",
    contactPerson: "Maria Kimaro",
    phone: "+255 755 123 456",
    email: "maria@legalaiddar.org",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM",
    services: ["Family Law", "Land Rights", "Criminal Defense"],
    address: "123 Independence Ave, Dar es Salaam",
    region: "Dar es Salaam"
  },
  {
    id: "mwanza-center",
    name: "Mwanza Community Paralegal Office",
    contactPerson: "Joseph Makundi",
    phone: "+255 755 789 012",
    email: "joseph@mwanzaparalegal.org",
    hours: "Mon-Fri: 8:30 AM - 3:30 PM",
    services: ["Land Rights", "Gender-Based Violence", "Business Formalization"],
    address: "45 Lake Road, Mwanza",
    region: "Mwanza"
  },
  {
    id: "arusha-center",
    name: "Arusha Legal Empowerment Center",
    contactPerson: "Faith Mollel",
    phone: "+255 756 345 678",
    email: "faith@alec.org",
    hours: "Mon-Sat: 9:00 AM - 3:00 PM",
    services: ["Human Rights", "Land Rights", "Family Law"],
    address: "78 Serengeti Street, Arusha",
    region: "Arusha"
  },
  {
    id: "dodoma-center",
    name: "Dodoma Paralegal Unit",
    contactPerson: "Emmanuel Mazengo",
    phone: "+255 757 234 567",
    email: "emmanuel@dodomapara.org",
    hours: "Mon-Fri: 9:00 AM - 4:00 PM",
    services: ["Family Law", "Land Rights", "Labor Disputes"],
    address: "34 Parliament Road, Dodoma",
    region: "Dodoma"
  }
];

const regions = ["All Regions", "Dar es Salaam", "Mwanza", "Arusha", "Dodoma"];

const LegalAidFinder = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  
  const filteredCenters = selectedRegion === "All Regions" 
    ? legalAidCenters 
    : legalAidCenters.filter(center => center.region === selectedRegion);

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Need Legal Help?</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
            Find a paralegal or legal aid center near you
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label htmlFor="region-select" className="block text-sm font-medium mb-2 font-calibri">
                Select a Region
              </label>
              <Select
                value={selectedRegion}
                onValueChange={(value) => setSelectedRegion(value)}
              >
                <SelectTrigger className="w-full md:w-72">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              {filteredCenters.length > 0 ? (
                filteredCenters.map((center) => (
                  <div key={center.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-lg font-bold mb-2 font-panton">{center.name}</h3>
                        <p className="text-neutral-gray mb-2 font-calibri">
                          Contact Person: {center.contactPerson}
                        </p>
                        <div className="flex items-center mb-1 text-sm">
                          <Phone className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-calibri">{center.phone}</span>
                        </div>
                        <div className="flex items-center mb-1 text-sm">
                          <Mail className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-calibri">{center.email}</span>
                        </div>
                        <div className="flex items-center mb-1 text-sm">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-calibri">{center.hours}</span>
                        </div>
                        <div className="flex items-start mb-1 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-primary mt-0.5" />
                          <span className="font-calibri">{center.address}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <div className="mb-2">
                          <span className="text-sm font-medium font-calibri">Services:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {center.services.map((service, i) => (
                              <span key={i} className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded font-calibri">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-neutral-gray font-calibri">No legal aid centers found in this region.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-neutral-gray mb-4 font-calibri">
                Need immediate help? Call our toll-free legal aid hotline
              </p>
              <div className="text-2xl font-bold text-primary mb-4 font-panton">
                +255 800 110 303
              </div>
              <Link to="/contact">
                <Button className="font-calibri">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalAidFinder;
