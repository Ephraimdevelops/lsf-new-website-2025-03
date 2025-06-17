
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Star, Filter, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import Typography from '@/components/shared/Typography';
import { useToast } from '@/hooks/use-toast';

interface LegalProvider {
  id: string;
  name: string;
  type: 'lawyer' | 'paralegal' | 'legal_aid_center';
  specializations: string[];
  location: {
    region: string;
    district: string;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  availability: {
    hours: string;
    languages: string[];
    isAvailable: boolean;
  };
  rating: number;
  reviewCount: number;
  experience: string;
  isVerified: boolean;
  bio: string;
  photo?: string;
}

// Sample data - in production this would come from your backend
const sampleProviders: LegalProvider[] = [
  {
    id: "provider-1",
    name: "Maria Kimaro",
    type: "paralegal",
    specializations: ["Family Law", "Land Rights", "Women's Rights"],
    location: {
      region: "Dar es Salaam",
      district: "Kinondoni",
      address: "Sinza, Plot 123"
    },
    contact: {
      phone: "+255 755 123 456",
      email: "maria.kimaro@legalaid.co.tz",
      whatsapp: "+255 755 123 456"
    },
    availability: {
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      languages: ["Swahili", "English"],
      isAvailable: true
    },
    rating: 4.8,
    reviewCount: 47,
    experience: "5 years experience in community legal aid",
    isVerified: true,
    bio: "Experienced paralegal specializing in family law and women's rights. Trained by LSF and certified by the Law Society of Tanzania."
  },
  {
    id: "provider-2",
    name: "Joseph Makundi",
    type: "lawyer",
    specializations: ["Criminal Defense", "Human Rights", "Constitutional Law"],
    location: {
      region: "Mwanza",
      district: "Nyamagana",
      address: "Pamba Road, Law Chambers"
    },
    contact: {
      phone: "+255 755 789 012",
      email: "j.makundi@advocates.co.tz"
    },
    availability: {
      hours: "Mon-Sat: 9:00 AM - 6:00 PM",
      languages: ["Swahili", "English", "Sukuma"],
      isAvailable: true
    },
    rating: 4.9,
    reviewCount: 89,
    experience: "10 years practicing law, LSF partner advocate",
    isVerified: true,
    bio: "Senior advocate with extensive experience in criminal defense and human rights cases. Pro bono services available for qualifying cases."
  },
  {
    id: "provider-3",
    name: "Arusha Community Legal Center",
    type: "legal_aid_center",
    specializations: ["Land Rights", "Business Registration", "Contract Disputes"],
    location: {
      region: "Arusha",
      district: "Arusha Urban",
      address: "Serengeti Street, ALEC Building"
    },
    contact: {
      phone: "+255 756 345 678",
      email: "info@alec.or.tz"
    },
    availability: {
      hours: "Mon-Sat: 8:00 AM - 4:00 PM",
      languages: ["Swahili", "English", "Maasai"],
      isAvailable: true
    },
    rating: 4.7,
    reviewCount: 156,
    experience: "Established 2015, served 5000+ clients",
    isVerified: true,
    bio: "Community-based legal aid center providing free legal services to vulnerable populations in Arusha region."
  }
];

const regions = [
  "All Regions", "Dar es Salaam", "Mwanza", "Arusha", "Dodoma", 
  "Tanga", "Morogoro", "Mbeya", "Iringa", "Shinyanga"
];

const specializations = [
  "All Specializations", "Family Law", "Land Rights", "Criminal Defense",
  "Women's Rights", "Human Rights", "Business Registration", "Contract Disputes",
  "Inheritance", "Domestic Violence", "Employment Law"
];

const providerTypes = [
  "All Types", "Lawyer", "Paralegal", "Legal Aid Center"
];

const ProviderFinder = () => {
  const [providers, setProviders] = useState<LegalProvider[]>(sampleProviders);
  const [filteredProviders, setFilteredProviders] = useState<LegalProvider[]>(sampleProviders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter providers based on search criteria
  useEffect(() => {
    let filtered = providers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specializations.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        provider.location.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by region
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter(provider => 
        provider.location.region === selectedRegion
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== "All Specializations") {
      filtered = filtered.filter(provider =>
        provider.specializations.includes(selectedSpecialization)
      );
    }

    // Filter by type
    if (selectedType !== "All Types") {
      filtered = filtered.filter(provider =>
        provider.type === selectedType.toLowerCase().replace(' ', '_')
      );
    }

    setFilteredProviders(filtered);
  }, [searchQuery, selectedRegion, selectedSpecialization, selectedType, providers]);

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'lawyer': return 'Lawyer';
      case 'paralegal': return 'Paralegal';
      case 'legal_aid_center': return 'Legal Aid Center';
      default: return type;
    }
  };

  const handleContactProvider = (provider: LegalProvider) => {
    toast({
      title: "Contact Information",
      description: `You can reach ${provider.name} at ${provider.contact.phone}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Legal Aid Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search by name, specialization, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
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
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Provider Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {providerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <Typography variant="h3">
          {filteredProviders.length} Legal Aid Provider{filteredProviders.length !== 1 ? 's' : ''} Found
        </Typography>
        <div className="flex items-center gap-2 text-sm text-neutral-gray">
          <Users className="h-4 w-4" />
          All providers are verified by LSF
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {provider.name}
                        {provider.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {getProviderTypeLabel(provider.type)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                          <span className="text-sm text-neutral-gray">
                            ({provider.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${provider.availability.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </CardHeader>
              <CardContent>
                <Typography variant="body" className="text-neutral-gray mb-4">
                  {provider.bio}
                </Typography>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{provider.location.address}, {provider.location.district}, {provider.location.region}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{provider.availability.hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{provider.contact.phone}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Typography variant="bodySmall" className="font-medium mb-2">
                    Specializations:
                  </Typography>
                  <div className="flex flex-wrap gap-1">
                    {provider.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Typography variant="bodySmall" className="font-medium mb-2">
                    Languages:
                  </Typography>
                  <div className="flex flex-wrap gap-1">
                    {provider.availability.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    onClick={() => handleContactProvider(provider)}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  {provider.contact.whatsapp && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`https://wa.me/${provider.contact.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                    >
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Typography variant="h3" className="text-neutral-gray mb-2">
              No providers found
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Try adjusting your search criteria or contact our hotline for assistance.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderFinder;
