import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Lock, Eye, AlertCircle, CheckCircle, Users, Scale, Heart, Phone, Mail, FileText, MessageSquare, Clock, Globe } from 'lucide-react';

const Whistleblower = () => {
  const protectionFeatures = [
    {
      icon: Shield,
      title: "Complete Protection",
      description: "You are fully protected from retaliation when you report concerns in good faith.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: Lock,
      title: "Absolute Confidentiality", 
      description: "Your identity and information will be kept confidential to the fullest extent possible.",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Eye,
      title: "Anonymous Reporting",
      description: "You may report completely anonymously, though contact information helps with follow-up.",
      color: "from-secondary-orange to-secondary-orange/80"
    }
  ];

  const impactStats = [
    { value: "98%", label: "Cases Resolved", description: "of reported concerns are thoroughly investigated" },
    { value: "24/7", label: "Available Support", description: "round-the-clock ethics hotline access" },
    { value: "100%", label: "Zero Retaliation", description: "protection guarantee for good faith reports" },
    { value: "48hrs", label: "Response Time", description: "maximum time to acknowledge your report" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/lovable-uploads/background with mother umage .png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/60 to-black/70"></div>
        
        <Container className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-secondary-orange/20 p-6 rounded-full backdrop-blur-sm border border-secondary-orange/30">
              <Shield className="h-16 w-16 text-secondary-orange" />
            </div>
          </div>
          
          <Typography variant="overline" className="text-secondary-orange mb-6 text-lg font-bold tracking-wider">
            SAFE. SECURE. PROTECTED.
          </Typography>
          <Typography variant="h1" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Speak Up with<br />
            <span className="text-secondary-orange">Confidence</span>
          </Typography>
          <Typography variant="body" className="text-2xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed">
            Your voice matters in maintaining the highest standards of integrity. Report concerns safely, 
            knowing you're protected every step of the way.
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-xl px-8 py-4">
              <MessageSquare className="mr-3 h-6 w-6" />
              Submit Report Now
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-8 py-4">
              <Phone className="mr-3 h-6 w-6" />
              Call Ethics Hotline
            </Button>
          </div>
        </Container>
      </section>

      {/* Protection Guarantee Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              Your Protection is Our Priority
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              We've built multiple layers of protection to ensure you can report with complete confidence.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {protectionFeatures.map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${feature.color} p-8 text-white relative`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h3" className="text-white mb-4 text-2xl">
                      {feature.title}
                    </Typography>
                    <Typography variant="body" className="text-white/90 leading-relaxed">
                      {feature.description}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <Typography variant="h1" className="text-4xl md:text-5xl text-primary mb-2 font-bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="h4" className="mb-2 text-lg">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {stat.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl">
              Your Voice Creates Change
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl">
              Every report helps us build a more ethical, transparent, and accountable organization. 
              Join us in maintaining the highest standards of integrity.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4 text-lg">
                <MessageSquare className="mr-3 h-6 w-6" />
                Submit Report
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Phone className="mr-3 h-6 w-6" />
                Call Hotline
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Mail className="mr-3 h-6 w-6" />
                Email Ethics Team
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced Reporting Options */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <Tabs defaultValue="report" className="w-full">
            <div className="text-center mb-12">
              <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
                Multiple Ways to Report
              </Typography>
              <TabsList className="grid grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="report" className="font-calibri text-base">Submit Online</TabsTrigger>
                <TabsTrigger value="policy" className="font-calibri text-base">Our Commitment</TabsTrigger>
                <TabsTrigger value="faq" className="font-calibri text-base">Common Questions</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="report">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Main Reporting Section */}
                <div className="bg-white rounded-3xl p-10 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl mr-6">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <Typography variant="h2" className="text-3xl">Secure Online Form</Typography>
                      <Typography variant="body" className="text-neutral-gray">
                        Your most secure and convenient option
                      </Typography>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <Typography variant="h4" className="mb-1">Encrypted Transmission</Typography>
                        <Typography variant="body" className="text-neutral-gray">
                          All reports are encrypted end-to-end for maximum security
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <Typography variant="h4" className="mb-1">Immediate Receipt</Typography>
                        <Typography variant="body" className="text-neutral-gray">
                          Get instant confirmation and tracking number
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <Globe className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <Typography variant="h4" className="mb-1">24/7 Availability</Typography>
                        <Typography variant="body" className="text-neutral-gray">
                          Submit reports anytime, from anywhere
                        </Typography>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full text-lg py-4 bg-primary hover:bg-primary/90">
                      <MessageSquare className="mr-3 h-6 w-6" />
                      Start Secure Report
                    </Button>
                    <div className="text-center">
                      <Typography variant="body" className="text-neutral-gray mb-2">
                        Need to speak to someone directly?
                      </Typography>
                      <Typography variant="body" className="font-bold text-primary">
                        Ethics Hotline: +255 123 456 789
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        Available 24/7 in Swahili and English
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* What to Report Section */}
                <div className="space-y-8">
                  <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <Typography variant="h3" className="mb-6 text-2xl flex items-center">
                      <AlertCircle className="mr-3 h-8 w-8 text-secondary-orange" />
                      What Should You Report?
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Fraud or financial misconduct",
                        "Conflicts of interest", 
                        "Policy violations",
                        "Safety concerns",
                        "Human rights abuses",
                        "Harassment or discrimination",
                        "Environmental violations",
                        "Data breaches or privacy issues"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <Typography variant="body" className="text-sm">
                            {item}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/5 rounded-3xl p-8 border border-secondary-orange/20">
                    <Typography variant="h4" className="mb-4 text-xl flex items-center">
                      <Heart className="mr-3 h-6 w-6 text-secondary-orange" />
                      Remember: Every Report Matters
                    </Typography>
                    <Typography variant="body" className="text-neutral-gray leading-relaxed">
                      Whether big or small, your concerns help us maintain the highest standards of integrity. 
                      If something doesn't feel right, trust your instincts and speak up.
                    </Typography>
                  </div>
                </div>
              </div>
            </TabsContent>
            
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
        </Container>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              Built on Trust & Transparency
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our whistleblower program is independently audited and recognized for its effectiveness.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Independent Oversight</Typography>
              <Typography variant="body" className="text-neutral-gray">
                Our processes are regularly reviewed by independent ethics experts to ensure fairness and effectiveness.
              </Typography>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-secondary-teal/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-secondary-teal" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Trained Investigators</Typography>
              <Typography variant="body" className="text-neutral-gray">
                All investigations are conducted by professionally trained staff with expertise in ethics and compliance.
              </Typography>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg">
              <div className="bg-secondary-orange/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-secondary-orange" />
              </div>
              <Typography variant="h3" className="mb-4 text-2xl">Proven Results</Typography>
              <Typography variant="body" className="text-neutral-gray">
                98% of reports lead to positive organizational changes, demonstrating our commitment to continuous improvement.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      
    </Layout>
  );
};

export default Whistleblower;
