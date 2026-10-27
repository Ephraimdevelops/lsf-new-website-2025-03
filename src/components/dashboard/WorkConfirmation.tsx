import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
export function WorkConfirmation({ open, title, children, busy, onConfirm, onEdit }: { open: boolean; title: string; children: ReactNode; busy: boolean; onConfirm: () => void; onEdit: () => void }) {
 return <Dialog open={open} onOpenChange={value => { if (!value && !busy) onEdit(); }}><DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Check the details below before saving.</DialogDescription></DialogHeader><div className="space-y-3 text-sm">{children}</div><div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={onConfirm}>{busy ? 'Saving…' : 'Confirm and save'}</Button><Button variant="outline" disabled={busy} onClick={onEdit}>Back and edit</Button></div></DialogContent></Dialog>;
}
