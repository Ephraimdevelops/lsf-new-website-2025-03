
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import LegalAidFinder from '../components/home/LegalAidFinder';
import { ChevronDown, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect } from 'react';
import { analyticsService } from '@/services/api';

const LegalHelp = () => {
  const [activeTab, setActiveTab] = useState('finder');

  // Track page visits
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await analyticsService.recordPageView('/legal-help');
      } catch (error) {
        console.error("Failed to record page view:", error);
      }
    };
    
    trackPageView();
  }, []);

  return (
    <Layout>
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-panton">
              Get Legal Help
            </h1>
            <p className="text-xl text-neutral-gray font-calibri">
              Find legal assistance, connect with paralegals, and access resources to help resolve your legal issues.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="flex flex-wrap border-b">
              <button
                className={`px-6 py-4 text-center flex-1 font-calibri ${
                  activeTab === 'finder' ? 'bg-primary text-white' : 'text-neutral-gray hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('finder')}
              >
                Find Legal Aid
              </button>
              <button
                className={`px-6 py-4 text-center flex-1 font-calibri ${
                  activeTab === 'resources' ? 'bg-primary text-white' : 'text-neutral-gray hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                Legal Resources
              </button>
              <button
                className={`px-6 py-4 text-center flex-1 font-calibri ${
                  activeTab === 'contact' ? 'bg-primary text-white' : 'text-neutral-gray hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                Contact Support
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'finder' && (
                <LegalAidFinder />
              )}

              {activeTab === 'resources' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 font-panton">Common Legal Issues</h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="land-disputes">
                      <AccordionTrigger className="font-calibri text-lg">Land Disputes</AccordionTrigger>
                      <AccordionContent className="text-neutral-gray font-calibri">
                        <p className="mb-4">Land disputes are among the most common legal issues in Tanzania. Here are some resources to help understand your rights:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>The Land Act of 1999 (PDF download)</li>
                          <li>Village Land Act (PDF download)</li>
                          <li>Guide to Land Dispute Resolution Process</li>
                        </ul>
                        <Button variant="outline" className="mt-2 font-calibri">Download Land Rights Guide</Button>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="family-law">
                      <AccordionTrigger className="font-calibri text-lg">Family Law</AccordionTrigger>
                      <AccordionContent className="text-neutral-gray font-calibri">
                        <p className="mb-4">Family law covers marriage, divorce, child custody, and maintenance issues. Find resources on:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Marriage Act</li>
                          <li>Child custody rights</li>
                          <li>Inheritance law and practices</li>
                        </ul>
                        <Button variant="outline" className="mt-2 font-calibri">Download Family Law Guide</Button>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="gender-violence">
                      <AccordionTrigger className="font-calibri text-lg">Gender-Based Violence</AccordionTrigger>
                      <AccordionContent className="text-neutral-gray font-calibri">
                        <p className="mb-4">Resources for victims of gender-based violence including:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Reporting procedures</li>
                          <li>Legal protection options</li>
                          <li>Support services directory</li>
                          <li>Emergency hotlines</li>
                        </ul>
                        <Button variant="outline" className="mt-2 font-calibri">Download GBV Support Guide</Button>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="labor-disputes">
                      <AccordionTrigger className="font-calibri text-lg">Labor Disputes</AccordionTrigger>
                      <AccordionContent className="text-neutral-gray font-calibri">
                        <p className="mb-4">Find information about workplace rights, including:</p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                          <li>Employment and Labor Relations Act</li>
                          <li>Unfair termination</li>
                          <li>Workplace discrimination</li>
                          <li>Wage disputes</li>
                        </ul>
                        <Button variant="outline" className="mt-2 font-calibri">Download Workers' Rights Guide</Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 font-panton">Contact Support</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2 font-panton">Call Us</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">Speak directly with our legal support team</p>
                      <p className="font-medium text-lg font-calibri">+255 123 456 789</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2 font-panton">Online Chat</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">Chat with a paralegal advisor</p>
                      <Button size="sm" className="font-calibri">Start Chat</Button>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2 font-panton">Visit Office</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">Come to our nearest office</p>
                      <Button size="sm" variant="outline" className="font-calibri">Find Location</Button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-bold mb-4 font-panton">Send us a message</h3>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1 font-calibri">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1 font-calibri">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="issue" className="block text-sm font-medium mb-1 font-calibri">Type of Legal Issue</label>
                        <select
                          id="issue"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select issue type</option>
                          <option value="land">Land Dispute</option>
                          <option value="family">Family Law</option>
                          <option value="gbv">Gender-Based Violence</option>
                          <option value="labor">Labor Issue</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1 font-calibri">Your Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Describe your legal issue"
                        ></textarea>
                      </div>
                      <div>
                        <Button type="submit" className="w-full font-calibri">Send Message</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalHelp;
