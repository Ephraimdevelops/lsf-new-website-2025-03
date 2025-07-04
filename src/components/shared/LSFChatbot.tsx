import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const LSFChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your LSF AI Assistant. I can help you with legal services, information about our programs, and connect you with resources. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { text: "Legal Aid Services", icon: <HelpCircle size={14} /> },
    { text: "Our Programs", icon: <Sparkles size={14} /> },
    { text: "Contact Information", icon: <MessageCircle size={14} /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const requestBody: any = {
        message: textToSend,
        timestamp: new Date().toISOString()
      };

      // Include threadId if available for conversation continuity
      if (threadId) {
        requestBody.threadId = threadId;
      }

      const response = await fetch('https://lsfai.app.n8n.cloud/webhook-test/43fc1f39-c9ef-4313-afce-c266d0cd81b5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      // Store threadId for conversation continuity
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || data.response || data.message || 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m currently offline. Please try again later or contact us directly at info@legalservicesfacility.org',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = () => {
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Popup */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-96 h-[500px] z-50 transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="h-full flex flex-col bg-white shadow-2xl border-2 border-primary/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">LSF AI Assistant</h3>
                <p className="text-xs text-white/80">Legal Services Support</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "flex items-start space-x-3",
                    message.sender === 'user' ? "flex-row-reverse space-x-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.sender === 'user' 
                      ? "bg-secondary-teal text-white shadow-md" 
                      : "bg-gradient-to-br from-primary/10 to-primary/20 text-primary border border-primary/20"
                  )}>
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[70%] p-3 rounded-xl text-sm shadow-sm",
                    message.sender === 'user'
                      ? "bg-gradient-to-br from-secondary-teal to-secondary-teal/90 text-white rounded-br-md"
                      : "bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-800 rounded-bl-md border border-neutral-200"
                  )}>
                    <p className="leading-relaxed">{message.text}</p>
                    <span className={cn(
                      "text-xs mt-2 block",
                      message.sender === 'user' ? "text-white/70" : "text-neutral-500"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                {/* Show quick actions after the first bot message */}
                {index === 0 && message.sender === 'bot' && (
                  <div className="mt-4 ml-11">
                    <p className="text-xs text-neutral-500 mb-2 font-medium">Quick Actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(action.text)}
                          disabled={isLoading}
                          className="h-8 text-xs bg-white hover:bg-primary/5 border-primary/20 text-primary hover:text-primary transition-all duration-200"
                        >
                          <span className="mr-1.5">{action.icon}</span>
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 p-3 rounded-xl rounded-bl-md shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-neutral-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about legal services..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendClick}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-primary hover:bg-primary-600 px-3"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700",
          "transform hover:scale-110 active:scale-95",
          isOpen ? "rotate-180" : ""
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </>
  );
};

export default LSFChatbot;