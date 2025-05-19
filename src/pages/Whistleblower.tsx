
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Lock, Eye } from 'lucide-react';

const Whistleblower = () => {
  return (
    <Layout>
      <div className="pt-20 bg-neutral-light">
        {/* Hero section */}
        <div className="bg-primary pattern-bg text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-panton">
                Whistleblower Protection
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90 font-calibri">
                We are committed to maintaining the highest standards of integrity, transparency, and accountability. Report concerns safely and confidentially.
              </p>
            </div>
          </div>
        </div>
        
        {/* Whistleblower Information */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="report" className="font-calibri">Report a Concern</TabsTrigger>
              <TabsTrigger value="policy" className="font-calibri">Our Policy</TabsTrigger>
              <TabsTrigger value="faq" className="font-calibri">FAQs</TabsTrigger>
            </TabsList>
            
            {/* Report a Concern Tab */}
            <TabsContent value="report">
              <Card>
                <CardContent className="p-6">
                  <div className="md:flex gap-8">
                    <div className="md:w-2/3">
                      <h2 className="text-2xl font-bold mb-4 font-panton">Submit a Report</h2>
                      <p className="text-neutral-gray mb-6 font-calibri">
                        Use our secure reporting system to submit information about suspected illegal or unethical conduct. All reports are treated with the utmost confidentiality.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1 font-panton">Protected Reporting</h3>
                            <p className="text-neutral-gray font-calibri">
                              You are protected from retaliation when you report concerns in good faith.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Lock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1 font-panton">Confidentiality</h3>
                            <p className="text-neutral-gray font-calibri">
                              Your identity and information will be kept confidential to the fullest extent possible.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Eye className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-1 font-panton">Anonymous Reports</h3>
                            <p className="text-neutral-gray font-calibri">
                              You may report anonymously, though providing contact information allows for follow-up questions.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Button className="w-full sm:w-auto font-calibri">Submit Online Report</Button>
                        <p className="text-sm text-neutral-gray font-calibri">
                          For urgent concerns, contact our Ethics Hotline: <strong>+255 123 456 789</strong>
                        </p>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 mt-8 md:mt-0 bg-neutral-light p-6 rounded-lg">
                      <h3 className="text-lg font-bold mb-4 font-panton">What to Report</h3>
                      <ul className="space-y-3 font-calibri">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Fraud, corruption, or financial misconduct</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Conflicts of interest</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Violation of organizational policies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Health, safety, or environmental concerns</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Human rights abuses</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Harassment or discrimination</span>
                        </li>
                      </ul>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold mb-3 font-panton">What to Include</h3>
                        <ul className="space-y-2 font-calibri">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">1.</span>
                            <span>Specific details of the incident</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">2.</span>
                            <span>Dates and locations</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">3.</span>
                            <span>Names of individuals involved</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">4.</span>
                            <span>Any supporting documents</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Policy Tab */}
            <TabsContent value="policy">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 font-panton">Whistleblower Protection Policy</h2>
                  <p className="text-neutral-gray mb-6 font-calibri">
                    Our whistleblower policy is designed to encourage staff, volunteers, partners, and other stakeholders to report suspected wrongdoing without fear of retaliation.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Policy Objectives</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">
                        This policy aims to:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-neutral-gray font-calibri">
                        <li>Encourage reporting of suspected wrongdoing as soon as possible</li>
                        <li>Provide guidance on how to raise concerns</li>
                        <li>Reassure whistleblowers that they will be protected from retaliation</li>
                        <li>Establish a fair and transparent investigation process</li>
                        <li>Ensure appropriate action is taken in response to substantiated concerns</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Protection from Retaliation</h3>
                      <p className="text-neutral-gray font-calibri">
                        LSF prohibits retaliation against any person who reports a concern in good faith or participates in an investigation. Retaliation includes dismissal, disciplinary action, threats, harassment, discrimination, or any other unfavorable treatment connected with raising a concern.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-3 font-panton">Investigation Process</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">
                        All reports will be taken seriously and addressed promptly through the following process:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2 text-neutral-gray font-calibri">
                        <li>Initial assessment of the report</li>
                        <li>Appointment of an appropriate investigator</li>
                        <li>Thorough investigation while maintaining confidentiality</li>
                        <li>Documentation of findings and recommendations</li>
                        <li>Implementation of appropriate corrective actions</li>
                        <li>Follow-up with the whistleblower when possible</li>
                      </ol>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button variant="outline" className="font-calibri">
                        Download Full Policy (PDF)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-panton">Frequently Asked Questions</h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-calibri">Who can submit a whistleblower report?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Anyone associated with LSF can submit a report, including employees, volunteers, consultants, partners, beneficiaries, donors, and other stakeholders who have concerns about potential misconduct related to our operations.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-calibri">Can I remain anonymous when reporting?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Yes, you can choose to remain anonymous. However, providing your contact information allows us to follow up with questions that might be important for investigating your concerns. If you do provide your identity, we will make every effort to keep it confidential.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-calibri">What happens after I submit a report?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        After submitting a report, you will receive an acknowledgment within 48 hours. An initial assessment will be conducted to determine if an investigation is needed. If an investigation proceeds, it will be conducted by appropriate personnel who are independent of the issue. You may be contacted for additional information, and you will receive updates on the status when possible.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-calibri">How am I protected from retaliation?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Our policy strictly prohibits retaliation against whistleblowers who report concerns in good faith. If you believe you are experiencing retaliation, report it immediately through the same whistleblower channels. Reports of retaliation will be investigated promptly, and appropriate disciplinary action will be taken against anyone found to have engaged in retaliatory conduct.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-lg font-calibri">What if my report involves a senior leader?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        Reports involving senior leadership are handled with special protocols to ensure independence and objectivity. Such reports may be directed to the Board of Directors or an external investigator to avoid conflicts of interest. The same protections against retaliation apply regardless of who is named in the report.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-lg font-calibri">What if I'm not sure if what I observed is a violation?</AccordionTrigger>
                      <AccordionContent className="font-calibri">
                        If you have a reasonable belief that something inappropriate is occurring, we encourage you to report it. It's better to raise a concern that turns out not to be an issue than to remain silent about a potential violation. As long as reports are made in good faith, whistleblowers are protected even if the investigation determines no misconduct occurred.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="mt-8 bg-neutral-light p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 font-panton">Still Have Questions?</h3>
                    <p className="mb-4 font-calibri">
                      If you have additional questions about the whistleblower process, please contact our Ethics Officer at <strong>ethics@lsf.org</strong> or call <strong>+255 123 456 789</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Whistleblower;
