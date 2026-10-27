import { UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';

export default function PersonalAvatar({ className = 'h-16 w-16' }: { className?: string }) {
  const { name, imageUrl, initials } = usePersonalGreeting();
  return <Avatar className={`${className} shrink-0 border border-neutral-200`}>
    <AvatarImage src={imageUrl} alt={name ? `${name}'s profile` : 'Your profile'} className="object-cover" />
    <AvatarFallback className="bg-primary/10 font-semibold text-primary">{initials || <UserRound size={22} />}</AvatarFallback>
  </Avatar>;
}
