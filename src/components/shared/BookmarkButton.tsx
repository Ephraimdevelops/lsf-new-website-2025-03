
import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/useBookmarks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  id: string;
  type: 'news' | 'publication' | 'program' | 'opportunity';
  title: string;
  url: string;
  description?: string;
  image?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const BookmarkButton = ({
  id,
  type,
  title,
  url,
  description,
  image,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
  className
}: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);

  const bookmarked = isBookmarked(id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    toggleBookmark({
      id,
      type,
      title,
      url,
      description,
      image
    });

    toast.success(
      bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      {
        description: title,
        duration: 2000
      }
    );
  };

  const Icon = bookmarked ? BookmarkCheck : Bookmark;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-all duration-200',
        bookmarked && 'text-primary',
        isAnimating && 'scale-110',
        className
      )}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Icon 
        size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
        className={cn(
          'transition-all duration-200',
          bookmarked && 'fill-current',
          showLabel && 'mr-2'
        )} 
      />
      {showLabel && (
        <span className="text-sm">
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </Button>
  );
};

export default BookmarkButton;
