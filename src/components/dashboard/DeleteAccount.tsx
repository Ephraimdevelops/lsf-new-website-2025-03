import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useAction } from 'convex/react';
import { useAuth } from '@clerk/clerk-react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';

export function DeleteAccount() {
  const readError = usePlainError();
  const c = useCopy();
  const remove = useAction(api.accountDeletion.deleteMyAccount);
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function deleteAccount() {
    if (busy || confirmation !== 'DELETE') return;
    setBusy(true); setError('');
    try {
      const result = await remove({ confirmation: 'DELETE' });
      toast.success(result.deleted ? 'Your login has been deleted. Case and audit records have been retained.' : 'Your access is closed. Login deletion is still processing; contact LSF if you have trouble.');
      try { await signOut({ redirectUrl: '/' }); } finally { window.location.assign('/'); }
    } catch (cause) { setError(readError(cause, 'Could not delete your account.')); }
    finally { setBusy(false); }
  }
  return <details className="mt-8 border-t pt-4">
    <summary className="cursor-pointer font-medium text-sm">{c("Account Management")}</summary>
    <div className="py-4 space-y-3">
      <p className="text-sm text-muted-foreground">{c("Delete your login and account access. LSF will retain case and audit records.")}</p>
      <Button variant="outline" onClick={() => { setOpen(true); setConfirmation(''); setError(''); }}><Trash2 size={16} className="mr-2" />{c("Delete account")}</Button>
    </div>
    <AlertDialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{c("Delete Your Account?")}</AlertDialogTitle><AlertDialogDescription>{c("Your login and access will be permanently removed. You will not be able to sign in with this account again. Case and audit records will be retained by LSF.")}</AlertDialogDescription></AlertDialogHeader>
        <Label htmlFor="delete-account-confirmation">{c("Type DELETE to confirm")}</Label>
        <Input id="delete-account-confirmation" value={confirmation} disabled={busy} autoComplete="off" onChange={event => setConfirmation(event.target.value)} />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter><AlertDialogCancel disabled={busy}>{c("Cancel")}</AlertDialogCancel><Button variant="destructive" disabled={busy || confirmation !== 'DELETE'} onClick={() => void deleteAccount()}><Trash2 size={16} className="mr-2" />{busy ? c("Deleting...") : c("Delete account")}</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </details>;
}
