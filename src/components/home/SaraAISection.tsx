import { useState } from 'react';
import { Bot, Sparkles, MessageCircle, Clock, Shield, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';

const SaraAISection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get legal assistance anytime, anywhere"
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Your conversations are private and secure"
    },
    {
      icon: Star,
      title: "Tanzanian Law Expert",
      description: "Trained on local laws and regulations"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-teal/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 border border-primary/20">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                    Meet Sara AI
                  </Typography>
                </div>
                
                {/* Heading */}
                <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Your Smart Legal
                  <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                    Assistant
                  </span>
                </Typography>
                
                {/* Description */}
                <Typography variant="body" className="text-xl text-muted-foreground leading-relaxed">
                  Sara is your intelligent legal assistant, powered by AI and trained on Tanzanian law. 
                  Get instant, reliable answers to your legal questions with 24/7 availability.
                </Typography>

                {/* Features */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <Typography variant="h4" className="text-lg font-bold mb-1">
                          {feature.title}
                        </Typography>
                        <Typography variant="bodySmall" className="text-muted-foreground">
                          {feature.description}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Link to="/sara-ai">
                      Chat with Sara
                      <MessageCircle className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <Link to="/legal-help">
                      Get Human Help
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                {/* Chat Interface Preview */}
                <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-primary to-secondary-orange p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div>
                        <Typography variant="h4" className="text-xl font-bold">
                          Sara AI
                        </Typography>
                        <Typography variant="body" className="text-white/80">
                          Legal Assistant • Online
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Sample Messages */}
                  <div className="p-6 space-y-4">
                    {/* Sara's Message */}
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary-orange rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                          <Typography variant="body" className="text-sm leading-relaxed">
                            Hello! I'm Sara, your AI Legal Assistant. How can I help you with legal questions today?
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* User's Message */}
                    <div className="flex justify-end">
                      <div className="flex items-start gap-3 max-w-[80%] flex-row-reverse">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-primary text-white rounded-2xl px-4 py-3">
                          <Typography variant="body" className="text-sm leading-relaxed">
                            What are my rights as a tenant?
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Sara's Response */}
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary-orange rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                          <Typography variant="body" className="text-sm leading-relaxed">
                            As a tenant in Tanzania, you have several important rights including...
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Typing Indicator */}
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary-orange rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-neutral-600">Sara is typing</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary-teal/20 rounded-full flex items-center justify-center animate-pulse delay-1000">
                  <Shield className="h-6 w-6 text-secondary-teal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SaraAISection;
