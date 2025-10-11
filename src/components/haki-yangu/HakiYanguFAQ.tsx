import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguFAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const faqs = [
    {
      question: "What is Haki Yangu and how does it work?",
      answer: "Haki Yangu (My Rights) is a mobile application that connects Tanzanians with legal education, trained paralegals, and real-time legal support. The app provides access to legal information, connects users with qualified legal professionals, and offers document templates and educational resources to help users understand and protect their legal rights."
    },
    {
      question: "Is Haki Yangu free to use?",
      answer: "Yes, Haki Yangu is completely free to download and use. There are no hidden costs, subscription fees, or charges for basic legal information and connecting with paralegals. We believe that access to justice should be free and available to all Tanzanians."
    },
    {
      question: "Can I use Haki Yangu without internet connection?",
      answer: "Yes, Haki Yangu is designed to work offline in remote areas with limited connectivity. The app downloads essential legal information and resources that can be accessed without internet. However, for connecting with paralegals and real-time support, an internet connection is required."
    },
    {
      question: "How quickly can I get help through the app?",
      answer: "Most users receive responses from legal professionals within 2 hours during business hours. For urgent matters, our 24/7 support system ensures that critical legal issues are addressed promptly. The app also provides immediate access to legal guides and self-help resources."
    },
    {
      question: "Is my personal information safe on Haki Yangu?",
      answer: "Absolutely. Haki Yangu uses end-to-end encryption to protect all user data and communications. We follow strict privacy policies and never share personal information without consent. Your legal matters remain confidential and secure."
    },
    {
      question: "What types of legal issues can Haki Yangu help with?",
      answer: "Haki Yangu can assist with various legal matters including land rights, family law, employment issues, business law, tenant rights, and more. Our network of trained paralegals and legal professionals can provide guidance on most common legal issues faced by Tanzanians."
    },
    {
      question: "How do I connect with a paralegal in my area?",
      answer: "Simply use the 'Find Paralegal' feature in the app, and it will show you trained legal professionals in your region. You can view their profiles, ratings, and areas of expertise before choosing to connect with them for personalized legal support."
    },
    {
      question: "Can Haki Yangu help me with court cases?",
      answer: "While Haki Yangu can provide legal information and connect you with legal professionals who can offer guidance, it's important to note that the app is primarily designed for legal education and connecting users with paralegals. For complex court cases, users may need to engage qualified lawyers directly."
    },
    {
      question: "What languages does Haki Yangu support?",
      answer: "Haki Yangu is available in both Swahili and English to ensure accessibility for all Tanzanians. The app interface, legal guides, and educational materials are provided in both languages to accommodate different language preferences."
    },
    {
      question: "How can I provide feedback or report issues with the app?",
      answer: "You can provide feedback directly through the app using the 'Feedback' section in the settings menu. We also have a dedicated support team that responds to user inquiries and continuously improves the app based on user feedback and suggestions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <HelpCircle className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Frequently Asked Questions
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Got Questions?
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                We Have Answers
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Find answers to the most common questions about Haki Yangu and how it can help you access legal services.
            </Typography>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
                    >
                      <Typography variant="h4" className="text-lg font-bold pr-4">
                        {faq.question}
                      </Typography>
                      <ChevronDown 
                        className={`h-6 w-6 text-primary transition-transform duration-200 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-8 pb-6">
                        <Typography variant="body" className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-8 border border-primary/10">
              <Typography variant="h3" className="mb-4 text-2xl font-bold">
                Still Have Questions?
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground mb-6">
                Our support team is here to help. Contact us directly through the app or reach out to our team.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Download App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguFAQ;
