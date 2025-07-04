import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isOnline: boolean;
}

const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  onSend, 
  onKeyPress, 
  isLoading, 
  isOnline 
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-neutral-200">
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isOnline ? "Ask about legal services..." : "AI is offline - try again later"}
          className="flex-1 text-sm"
          disabled={isLoading || !isOnline}
        />
        <Button
          onClick={onSend}
          disabled={!inputMessage.trim() || isLoading || !isOnline}
          className="bg-primary hover:bg-primary-600 px-3"
        >
          <Send size={16} />
        </Button>
      </div>
      {!isOnline && (
        <p className="text-xs text-red-500 mt-2 text-center">
          AI Assistant is currently offline. Please try again later.
        </p>
      )}
    </div>
  );
};

export default ChatInput;