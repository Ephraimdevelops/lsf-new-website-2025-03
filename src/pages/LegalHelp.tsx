
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LegalHelp = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // List of common legal issues with guidance
  const legalIssues = [
    {
      title: "Land Disputes",
      content: "Land disputes are common in Tanzania and can involve boundary conflicts, inheritance issues, or illegal occupation. If you're facing a land dispute, first gather all relevant documentation including land titles, purchase agreements, and inheritance documents. Contact your local paralegal or legal aid organization for assistance with mediation or formal legal proceedings."
    },
    {
      title: "Gender-Based Violence",
      content: "Gender-based violence (GBV) includes physical, sexual, or psychological harm directed at an individual based on gender. If you're experiencing GBV, your safety is the priority. Contact the GBV hotline at 116 for immediate assistance. Legal aid providers can help with restraining orders, criminal complaints, and connecting you with support services."
    },
    {
      title: "Inheritance Rights",
      content: "Inheritance disputes often arise, particularly regarding women's rights to inherit property. Tanzania's laws recognize both statutory and customary inheritance practices. A legal aid provider can help you understand your rights under the Law of Succession and assist with filing claims or contesting unfair distributions."
    },
    {
      title: "Marriage and Divorce",
      content: "Legal issues related to marriage and divorce include maintenance payments, child custody, and division of matrimonial property. Tanzania recognizes civil, religious, and customary marriages, each with different legal implications. Consult a paralegal to understand your rights and the appropriate procedures for your situation."
    },
    {
      title: "Employment Disputes",
      content: "Workers facing unfair dismissal, non-payment of wages, or unsafe working conditions have legal protections under Tanzania's Employment and Labour Relations Act. Document all relevant communications and consult a legal aid provider to understand your options, which may include mediation through the Commission for Mediation and Arbitration."
    }
  ];
  
  // Paralegals by region (simplified for demo purposes)
  const regionalParalegals: Record<string, {name: string, organization: string, contact: string, areas: string[]}[]> = {
    'dar-es-salaam': [
      {
        name: "Amina Hassan",
        organization: "Tanganyika Law Society",
        contact: "+255 712 345 678",
        areas: ["Land disputes", "Family law", "Employment issues"]
      },
      {
        name: "John Malima",
        organization: "Legal and Human Rights Centre",
        contact: "+255 754 987 654",
        areas: ["Criminal defense", "Human rights", "Constitutional matters"]
      }
    ],
    'arusha': [
      {
        name: "Sarah Laizer",
        organization: "Arusha Women Legal Aid",
        contact: "+255 763 221 445",
        areas: ["Gender-based violence", "Women's rights", "Children's rights"]
      },
      {
        name: "Ibrahim Mushi",
        organization: "Community Justice Facilitators",
        contact: "+255 789 556 778",
        areas: ["Land disputes", "Inheritance", "Community mediation"]
      }
    ],
    'mwanza': [
      {
        name: "Emmanuel Macha",
        organization: "Mwanza Legal Aid Centre",
        contact: "+255 765 432 109",
        areas: ["Family law", "Property disputes", "Employment"]
      },
      {
        name: "Rehema Kingu",
        organization: "Women's Legal Aid",
        contact: "+255 711 223 344",
        areas: ["Domestic violence", "Child support", "Marriage and divorce"]
      }
    ],
    'dodoma': [
      {
        name: "Godfrey Nzowa",
        organization: "Central Tanzania Legal Aid",
        contact: "+255 744 556 677",
        areas: ["Land rights", "Administrative law", "Criminal cases"]
      }
    ],
    'zanzibar': [
      {
        name: "Fatma Ali",
        organization: "Zanzibar Legal Services Centre",
        contact: "+255 777 889 900",
        areas: ["Family law", "Land disputes", "Human rights"]
      }
    ]
  };
  
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'dar-es-salaam', label: 'Dar es Salaam' },
    { value: 'arusha', label: 'Arusha' },
    { value: 'mwanza', label: 'Mwanza' },
    { value: 'dodoma', label: 'Dodoma' },
    { value: 'zanzibar', label: 'Zanzibar' }
  ];
  
  // Get all paralegals or filter by selected region
  const getParalegals = () => {
    if (selectedRegion === 'all') {
      return Object.values(regionalParalegals).flat();
    }
    return regionalParalegals[selectedRegion] || [];
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-teal py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Legal Help</h1>
            <p className="text-xl opacity-90">
              Access free legal assistance through our network of paralegals and legal aid organizations across Tanzania
            </p>
          </div>
        </div>
      </section>
      
      {/* Key Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Can Help You</h2>
            <p className="text-lg text-neutral-dark">
              Our network of trained paralegals and legal aid organizations provides various services to help you resolve your legal issues
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-secondary-teal/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Legal Information</h3>
              <p className="text-neutral-dark">
                Get accurate information about your legal rights and procedures in clear, simple language
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Legal Advice</h3>
              <p className="text-neutral-dark">
                Receive guidance from trained paralegals on how to address your specific legal situation
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-secondary-orange/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Document Assistance</h3>
              <p className="text-neutral-dark">
                Get help preparing legal documents, forms, and applications for various procedures
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-secondary-green/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Mediation</h3>
              <p className="text-neutral-dark">
                Resolve disputes through facilitated discussions led by community paralegals without going to court
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-secondary-yellow/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Legal Referrals</h3>
              <p className="text-neutral-dark">
                Get connected with specialized legal services, lawyers, or organizations for complex cases
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Find a Paralegal Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Find a Paralegal Near You</h2>
            <p className="text-lg text-neutral-dark text-center mb-8">
              Our network of paralegals covers all regions in Tanzania, providing free legal assistance to those who need it
            </p>
            
            <div className="flex justify-center mb-10">
              <div className="w-full max-w-xs">
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getParalegals().map((paralegal, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{paralegal.name}</h3>
                  <p className="text-primary mb-4">{paralegal.organization}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-neutral-dark">{paralegal.contact}</p>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-neutral-dark">{regions.find(r => r.value === selectedRegion)?.label || 'Various Locations'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Specializes in:</p>
                    <div className="flex flex-wrap gap-2">
                      {paralegal.areas.map((area, i) => (
                        <span key={i} className="bg-gray-100 text-neutral-dark text-xs px-2.5 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Available 9am-5pm
                  </div>
                  <a href={`tel:${paralegal.contact.replace(/\s+/g, '')}`}>
                    <Button size="sm">Contact</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {getParalegals().length === 0 && (
            <div className="text-center py-8">
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-xl font-bold mb-2">No Paralegals Found</h3>
                <p className="text-neutral-dark mb-4">
                  We don't have paralegals listed for this region yet. Please call our helpline for assistance.
                </p>
                <a href="tel:+255800110303" className="inline-block">
                  <Button>
                    Call Helpline: +255 800 110 303
                  </Button>
                </a>
              </div>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+255800110303">
                Call Our Toll-Free Legal Helpline: +255 800 110 303
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Common Legal Issues Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Common Legal Issues</h2>
            <p className="text-lg text-neutral-dark text-center mb-8">
              Find information about common legal issues and how our paralegals can help
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              {legalIssues.map((issue, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {issue.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-neutral-dark">{issue.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="text-neutral-dark mb-4">
                Need help with a legal issue not listed here?
              </p>
              <Button size="lg" asChild>
                <a href="tel:+255800110303">
                  Contact Our Helpline
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile App Promotion */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Download Our Haki Yangu App</h2>
              <p className="text-lg text-neutral-dark mb-6">
                Get legal information, connect with paralegals, and track your case right from your phone with our free Haki Yangu mobile application.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access legal information offline</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Chat with paralegals in your area</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access document templates</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track the status of your cases</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="inline-block">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-12" />
                </a>
                <a href="#" className="inline-block">
                  <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png" alt="Download on the App Store" className="h-12" />
                </a>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Haki Yangu Mobile App" 
                className="rounded-lg shadow-xl mx-auto"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full h-3 w-3 mr-2"></div>
                  <span className="text-sm font-medium">5,000+ users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalHelp;
