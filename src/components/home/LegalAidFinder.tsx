import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyticsService } from '@/services/api';

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

// Sample data - in production this would come from an API
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
  },
  {
    id: "tanga-center",
    name: "Tanga Legal Aid Network",
    contactPerson: "Amina Hassan",
    phone: "+255 758 345 678",
    email: "amina@tangalegalaid.org",
    hours: "Mon-Fri: 9:00 AM - 3:30 PM",
    services: ["Women's Rights", "Land Rights", "Inheritance"],
    address: "56 Ocean View Road, Tanga",
    region: "Tanga"
  },
  {
    id: "morogoro-center",
    name: "Morogoro Paralegal Services",
    contactPerson: "David Mwakyusa",
    phone: "+255 759 456 789",
    email: "david@morogoroparalegal.org",
    hours: "Mon-Sat: 8:00 AM - 4:00 PM",
    services: ["Agricultural Rights", "Land Rights", "Family Law"],
    address: "23 Uluguru Street, Morogoro",
    region: "Morogoro"
  }
];

const regions = ["All Regions", "Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Tanga", "Morogoro"];

const LegalAidFinder = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Filter centers based on region and search query
  const filteredCenters = legalAidCenters
    .filter(center => selectedRegion === "All Regions" || center.region === selectedRegion)
    .filter(center => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        center.name.toLowerCase().includes(query) ||
        center.services.some(service => service.toLowerCase().includes(query)) ||
        center.region.toLowerCase().includes(query)
      );
    });

  // Track usage of the legal aid finder
  useEffect(() => {
    const trackFinder = async () => {
      try {
        await analyticsService.trackPageView('/legal-aid-finder', 'Legal Aid Finder');
      } catch (error) {
        console.error("Failed to record analytics:", error);
      }
    };
    trackFinder();
  }, []);

  const handleContactClick = (center: LegalAidCenter) => {
    // In a real app, this might open a contact form or initiate a call
    toast({
      title: "Contact Request Initiated",
      description: `Your request to contact ${center.name} has been sent.`,
    });
    
    // Track this interaction
    try {
      analyticsService.trackPageView(`/legal-aid-finder/contact/${center.id}`, `Contact ${center.name}`);
    } catch (error) {
      console.error("Failed to record contact analytics:", error);
    }
  };

  return (
    <section className="py-16 bg-neutral-light" id="legal-aid-finder">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Need Legal Help?</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
            Find a paralegal or legal aid center near you through our network of 183+ organizations across Tanzania
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="region-select" className="block text-sm font-medium mb-2 font-calibri">
                  Select a Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="w-full">
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
              
              <div>
                <label htmlFor="search" className="block text-sm font-medium mb-2 font-calibri">
                  Search by service or name
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Land Rights, Family Law"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4"></div>
                  <p className="text-neutral-gray font-calibri">Finding legal aid centers...</p>
                </div>
              ) : filteredCenters.length > 0 ? (
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => handleContactClick(center)}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-neutral-gray font-calibri">No legal aid centers found matching your criteria. Please try a different region or search term.</p>
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
