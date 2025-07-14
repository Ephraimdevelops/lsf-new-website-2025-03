import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Typography from '@/components/shared/Typography';

const FAQ = () => {
  const faqs = [
    {
      question: "What is the Legal Services Facility?",
      answer: "The Legal Services Facility is a leading organization dedicated to improving access to justice in Tanzania through legal aid, capacity building, and policy advocacy."
    },
    {
      question: "How can I access legal aid services?",
      answer: "You can access our legal aid services through our mobile clinics, partner organizations, or by contacting us directly. We provide free legal assistance to those who cannot afford it."
    },
    {
      question: "What areas of law do you cover?",
      answer: "We cover various areas including family law, land rights, gender-based violence, labor rights, and human rights issues."
    },
    {
      question: "How can I become a partner organization?",
      answer: "To become a partner, please contact us through our partnership form. We work with civil society organizations, legal firms, and community groups."
    },
    {
      question: "Do you provide training programs?",
      answer: "Yes, we offer various training programs for legal professionals, community leaders, and civil society organizations to build capacity in legal service delivery."
    },
    {
      question: "How can I support your work?",
      answer: "You can support our work through donations, volunteering, partnering with us, or spreading awareness about our mission."
    },
    {
      question: "What is the Haki Yangu app?",
      answer: "Haki Yangu is our mobile application that provides legal information and connects users with legal services in Tanzania."
    },
    {
      question: "How do you ensure quality of legal services?",
      answer: "We maintain quality through rigorous training programs, regular monitoring and evaluation, and adherence to professional standards."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h1" className="mb-6">
                Frequently Asked Questions
              </Typography>
              <Typography variant="body" className="text-muted-foreground">
                Find answers to common questions about our services, programs, and how we work.
              </Typography>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left">
                      <Typography variant="h4">{faq.question}</Typography>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Typography variant="body" className="text-muted-foreground">
                        {faq.answer}
                      </Typography>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h2" className="mb-4">
              Still Have Questions?
            </Typography>
            <Typography variant="body" className="text-muted-foreground mb-8">
              Can't find what you're looking for? Contact us directly.
            </Typography>
            <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FAQ;