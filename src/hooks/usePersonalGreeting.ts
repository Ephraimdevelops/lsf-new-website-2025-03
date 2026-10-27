import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function usePersonalGreeting() {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const profile = useQuery(api.users.current, isAuthenticated ? {} : 'skip');
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const update = () => setHour(new Date().getHours());
    const timer = window.setInterval(update, 60000);
    window.addEventListener('focus', update);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update); };
  }, []);
  const name = profile?.name?.trim() || user?.fullName?.trim() || user?.firstName?.trim() || '';
  const firstName = name.split(/\s+/)[0] || '';
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const swGreeting = hour < 12 ? 'Habari za asubuhi' : hour < 17 ? 'Habari za mchana' : 'Habari za jioni';
  return {
    name,
    firstName,
    imageUrl: profile?.imageUrl || user?.imageUrl,
    initials: name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase(),
    greeting: `${timeGreeting}${firstName ? `, ${firstName}` : ''}`,
    greetingSw: `${swGreeting}${firstName ? `, ${firstName}` : ''}`,
  };
}
