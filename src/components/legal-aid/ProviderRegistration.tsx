
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Typography from '@/components/shared/Typography';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, FileText, Shield, CheckCircle, Upload, X } from 'lucide-react';

const regions = [
  "Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Tanga", 
  "Morogoro", "Mbeya", "Iringa", "Shinyanga", "Kagera"
];

const specializations = [
  "Family Law", "Land Rights", "Criminal Defense", "Women's Rights",
  "Human Rights", "Business Registration", "Contract Disputes",
  "Inheritance", "Domestic Violence", "Employment Law", "Constitutional Law"
];

const languages = [
  "Swahili", "English", "Maasai", "Sukuma", "Chagga", "Haya",
  "Nyamwezi", "Makonde", "Yao", "Gogo"
];

const providerSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  whatsapp: z.string().optional(),
  
  // Professional Information
  providerType: z.enum(["lawyer", "paralegal", "legal_aid_center"], {
    required_error: "Please select your provider type"
  }),
  licenseNumber: z.string().min(1, "License/Registration number is required"),
  experience: z.string().min(1, "Please describe your experience"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  
  // Location
  region: z.string().min(1, "Please select your region"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(10, "Please provide a detailed address"),
  
  // Services
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  availabilityHours: z.string().min(1, "Please specify your availability"),
  
  // Documents
  profilePhoto: z.any().optional(),
  licenseDocument: z.any().optional(),
  
  // Agreements
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  dataProcessingConsent: z.boolean().refine(val => val === true, "You must consent to data processing"),
});

type ProviderFormData = z.infer<typeof providerSchema>;

const ProviderRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      specializations: [],
      languages: [],
      termsAccepted: false,
      dataProcessingConsent: false,
    },
  });

  const handleSpecializationToggle = (specialization: string) => {
    const updated = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter(s => s !== specialization)
      : [...selectedSpecializations, specialization];
    
    setSelectedSpecializations(updated);
    form.setValue('specializations', updated);
  };

  const handleLanguageToggle = (language: string) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(updated);
    form.setValue('languages', updated);
  };

  const onSubmit = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would submit to your backend
      console.log('Provider registration data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Registration Submitted Successfully!",
        description: "Your application has been received and will be reviewed within 48 hours. You'll receive an email confirmation shortly.",
      });
      
      // Reset form
      form.reset();
      setSelectedSpecializations([]);
      setSelectedLanguages([]);
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Register as a Legal Aid Provider
          </CardTitle>
          <Typography variant="body" className="text-neutral-gray">
            Join our network of verified legal aid providers and help connect Tanzanians with quality legal services.
          </Typography>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <Typography variant="h3" className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Personal Information
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+255 XXX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+255 XXX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <Typography variant="h3" className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Professional Information
                </Typography>
                
                <FormField
                  control={form.control}
                  name="providerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your provider type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lawyer">Licensed Lawyer</SelectItem>
                          <SelectItem value="paralegal">Certified Paralegal</SelectItem>
                          <SelectItem value="legal_aid_center">Legal Aid Center/Organization</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License/Registration Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your license number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Bar Association number, Paralegal certificate, or Organization registration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Summary *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 years in family law" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your professional background, qualifications, and approach to legal aid..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed to potential clients (minimum 50 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Typography variant="h3">Location & Contact</Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your district" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your complete office address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availabilityHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability Hours *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <Typography variant="h3">Legal Specializations *</Typography>
                <Typography variant="body" className="text-neutral-gray">
                  Select all areas of law in which you provide services
                </Typography>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specializations.map((specialization) => (
                    <div
                      key={specialization}
                      onClick={() => handleSpecializationToggle(specialization)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSpecializations.includes(specialization)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedSpecializations.includes(specialization)}
                          onChange={() => handleSpecializationToggle(specialization)}
                        />
                        <Typography variant="bodySmall">{specialization}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedSpecializations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                        {spec}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleSpecializationToggle(spec)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Typography variant="h3">Languages Spoken *</Typography>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languages.map((language) => (
                    <div
                      key={language}
                      onClick={() => handleLanguageToggle(language)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLanguages.includes(language)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                        />
                        <Typography variant="bodySmall">{language}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <Typography variant="h3">Terms and Agreements</Typography>
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the Terms and Conditions *
                        </FormLabel>
                        <FormDescription>
                          I agree to LSF's provider terms, code of conduct, and quality standards.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dataProcessingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I consent to data processing *
                        </FormLabel>
                        <FormDescription>
                          I agree to the processing of my personal data for verification and listing purposes.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h4" className="mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Ready to Submit?
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-4">
                  After submission, your application will be reviewed by our team within 48 hours. 
                  We may contact you for additional verification documents.
                </Typography>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderRegistration;
