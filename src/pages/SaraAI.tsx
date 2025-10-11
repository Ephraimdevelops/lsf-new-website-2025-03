import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Shield, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Layout from '@/components/layout/Layout';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sara';
  timestamp: Date;
  isTyping?: boolean;
}

const SaraAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Sara, your AI Legal Assistant. I'm here to help you with legal questions and provide reliable guidance on legal issues in Tanzania. How can I assist you today?",
      sender: 'sara',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'sara',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Send message to n8n webhook
      const response = await fetch('/api/sara-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
          userId: 'anonymous' // You can implement user authentication later
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Remove typing indicator
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
        
        // Add Sara's response
        const saraResponse: Message = {
          id: Date.now().toString() + '_sara',
          content: data.response || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
          sender: 'sara',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, saraResponse]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add error response
      const errorResponse: Message = {
        id: Date.now().toString() + '_error',
        content: "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment or contact our support team at support@lsftz.org for immediate assistance.",
        sender: 'sara',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <section className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5">
        <Container size="2xl" className="py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-6 border border-primary/20">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Sara AI Legal Assistant
              </Typography>
            </div>
            
            <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Meet Sara
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Your Smart Legal Assistant
              </span>
            </Typography>
            
            <Typography variant="body" className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Sara is your intelligent legal assistant, powered by AI and trained on Tanzanian law. 
              Get instant, reliable answers to your legal questions with 24/7 availability.
            </Typography>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <Typography variant="h4" className="text-lg font-bold mb-2">
                  24/7 Availability
                </Typography>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Get legal assistance anytime, anywhere
                </Typography>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100">
                <div className="w-12 h-12 bg-secondary-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-secondary-teal" />
                </div>
                <Typography variant="h4" className="text-lg font-bold mb-2">
                  Reliable & Secure
                </Typography>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Your conversations are private and secure
                </Typography>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100">
                <div className="w-12 h-12 bg-secondary-orange/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-secondary-orange" />
                </div>
                <Typography variant="h4" className="text-lg font-bold mb-2">
                  Tanzanian Law Expert
                </Typography>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  Trained on local laws and regulations
                </Typography>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-secondary-orange p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <Typography variant="h3" className="text-xl font-bold">
                      Sara AI
                    </Typography>
                    <Typography variant="body" className="text-white/80">
                      Legal Assistant • Online
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gradient-to-r from-primary to-secondary-orange text-white'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : message.isTyping ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">Sara is typing</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        ) : (
                          <Typography variant="body" className="text-sm leading-relaxed">
                            {message.content}
                          </Typography>
                        )}
                        <Typography variant="caption" className="block mt-2 opacity-70 text-xs">
                          {formatTime(message.timestamp)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-neutral-200 p-6">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Sara about legal issues, rights, or any legal questions you have..."
                      className="w-full p-3 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                <Typography variant="caption" className="block mt-3 text-center text-neutral-500">
                  Sara is designed to provide general legal information. For specific legal advice, please consult with a qualified lawyer.
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default SaraAI;
