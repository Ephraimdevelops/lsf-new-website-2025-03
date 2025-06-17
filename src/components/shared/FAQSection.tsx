
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQ[];
  variant?: 'default' | 'secondary' | 'primary';
  backgroundImage?: string;
}

const FAQSection = ({ 
  title, 
  subtitle, 
  faqs, 
  variant = 'default',
  backgroundImage
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section variant={variant} padding="xl" className="relative">
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </>
      )}
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <HelpCircle className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              FREQUENTLY ASKED QUESTIONS
            </Typography>
          </div>
          <Typography variant="h2" className="mb-6">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              {subtitle}
            </Typography>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} variant="elevated" className="overflow-hidden backdrop-blur-sm bg-white/95">
              <button
                className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <Typography variant="h4" className="pr-4">
                  {faq.question}
                </Typography>
                <ChevronDown 
                  className={`h-5 w-5 text-primary transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div className={`transition-all duration-200 ${
                openIndex === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="px-6 pb-6">
                  <Typography variant="body" className="text-neutral-gray leading-relaxed">
                    {faq.answer}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FAQSection;
