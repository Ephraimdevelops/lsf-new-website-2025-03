import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
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
  );
};

export default ChatMessage;