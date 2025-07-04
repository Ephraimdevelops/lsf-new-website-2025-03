import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useChatStatus } from '@/hooks/useChatStatus';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import LoadingIndicator from './LoadingIndicator';

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
  const { isOnline } = useChatStatus();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || !isOnline) return;

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
          <ChatHeader isOnline={isOnline} onClose={() => setIsOpen(false)} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                
                {/* Show quick actions after the first bot message */}
                {index === 0 && message.sender === 'bot' && (
                  <QuickActions 
                    onActionClick={sendMessage}
                    isLoading={isLoading}
                    isOnline={isOnline}
                  />
                )}
              </div>
            ))}
            
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSend={handleSendClick}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            isOnline={isOnline}
          />
        </Card>
      </div>

      {/* Chat Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700",
          "transform hover:scale-110 active:scale-95",
          isOpen ? "rotate-180" : "",
          !isOnline && "opacity-75"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {/* Online/Offline indicator */}
        <div className={cn(
          "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
          isOnline ? "bg-green-500" : "bg-red-500"
        )} />
      </Button>
    </>
  );
};

export default LSFChatbot;