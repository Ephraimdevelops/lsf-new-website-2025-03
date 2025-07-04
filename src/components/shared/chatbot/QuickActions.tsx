import { Button } from '@/components/ui/button';
import { HelpCircle, Sparkles, MessageCircle } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (text: string) => void;
  isLoading: boolean;
  isOnline: boolean;
}

const QuickActions = ({ onActionClick, isLoading, isOnline }: QuickActionsProps) => {
  const quickActions = [
    { text: "Legal Aid Services", icon: <HelpCircle size={14} /> },
    { text: "Our Programs", icon: <Sparkles size={14} /> },
    { text: "Contact Information", icon: <MessageCircle size={14} /> },
  ];

  return (
    <div className="mt-4 ml-11">
      <p className="text-xs text-neutral-500 mb-2 font-medium">Quick Actions:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, actionIndex) => (
          <Button
            key={actionIndex}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.text)}
            disabled={isLoading || !isOnline}
            className="h-8 text-xs bg-white hover:bg-primary/5 border-primary/20 text-primary hover:text-primary transition-all duration-200"
          >
            <span className="mr-1.5">{action.icon}</span>
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;