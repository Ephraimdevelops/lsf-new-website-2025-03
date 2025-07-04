import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
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
  );
};

export default LoadingIndicator;