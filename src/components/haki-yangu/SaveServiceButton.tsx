import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';

export default function SaveServiceButton({ serviceId }: { serviceId: Id<'justice_services'> }) {
  const { isSignedIn } = useAuth();
  const saved = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : 'skip');
  const toggle = useMutation(api.justiceServices.toggleSavedService);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const active = saved?.some((item) => item.service._id === serviceId) ?? false;
  if (!isSignedIn) return <Link to="/login"><Button variant="outline">Sign in to save</Button></Link>;
  return <span><Button variant="outline" disabled={busy || saved === undefined} onClick={async () => { setBusy(true); setError(''); try { await toggle({ serviceId, saved: !active }); } catch { setError('Could not update saved help.'); } finally { setBusy(false); } }}>{active ? 'Saved · remove' : 'Save service'}</Button>{error && <span role="alert" className="ml-2 text-xs text-red-700">{error}</span>}</span>;
}
