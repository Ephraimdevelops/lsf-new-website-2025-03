import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  isOnline: boolean;
  onClose: () => void;
}

const ChatHeader = ({ isOnline, onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="/sara-avatar-v2.png"
            alt="Saada"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm">Saada</h3>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-green-400" : "bg-red-400"
            )} />
          </div>
          <p className="text-xs text-white/80 flex items-center space-x-1">
            <span>LSF Legal Assistant</span>
            <span>•</span>
            <span className={cn(
              "font-medium",
              isOnline ? "text-green-200" : "text-red-200"
            )}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
        className="text-white hover:bg-white/20 h-8 w-8 p-0"
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default ChatHeader;