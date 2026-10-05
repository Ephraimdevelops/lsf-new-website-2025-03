import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { ImageOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Testimonial = NonNullable<ReturnType<typeof useQuery<typeof api.testimonials.get>>>[number];
type Form = { name: string; role: string; location: string; content: string; category: string; featured: boolean };
const emptyForm: Form = { name: '', role: '', location: '', content: '', category: '', featured: true };

export default function AdminTestimonials() {
  const testimonials = useQuery(api.testimonials.get);
  const create = useMutation(api.testimonials.create);
  const update = useMutation(api.testimonials.update);
  const remove = useMutation(api.testimonials.remove);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMedia = useMutation(api.media.saveMedia);
  const { toast } = useToast();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const start = (item: Testimonial | null) => {
    setEditing(item);
    setForm(item ? { name: item.name, role: item.role, location: item.location, content: item.content, category: item.category, featured: item.featured } : emptyForm);
    setFile(null);
    setOpen(true);
  };

  const uploadPhoto = async (photo: File): Promise<Id<'_storage'>> => {
    if (!photo.type.startsWith('image/') || photo.type === 'image/svg+xml') throw new Error('Choose a JPG, PNG, or WebP image.');
    if (photo.size > 20 * 1024 * 1024) throw new Error('The image must be under 20 MB.');
    const postUrl = await generateUploadUrl();
    const response = await fetch(postUrl, { method: 'POST', headers: { 'Content-Type': photo.type }, body: photo });
    if (!response.ok) throw new Error('Image upload failed. Please try again.');
    const uploaded = await response.json() as { storageId?: Id<'_storage'> };
    if (!uploaded.storageId) throw new Error('Image upload did not return a storage ID.');
    await saveMedia({ storageId: uploaded.storageId, name: photo.name, type: photo.type, size: photo.size });
    return uploaded.storageId;
  };

  const save = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      toast({ title: 'Name and testimonial are required', variant: 'destructive' });
      return;
    }
    if (!editing && !file) {
      toast({ title: 'Upload the testimonial image before publishing', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const imageStorageId = file ? await uploadPhoto(file) : undefined;
      const fields = { ...form, name: form.name.trim(), role: form.role.trim(), location: form.location.trim(), content: form.content.trim(), category: form.category.trim() };
      if (editing) {
        await update({ id: editing._id, ...fields, ...(imageStorageId ? { imageStorageId } : {}) });
      } else {
        if (!imageStorageId) throw new Error('Upload the testimonial image before saving.');
        await create({ ...fields, imageStorageId, rating: 5 });
      }
      setOpen(false);
      setEditing(null);
      setFile(null);
      toast({ title: editing ? 'Testimonial updated' : 'Testimonial created' });
    } catch (error) {
      toast({ title: 'Could not save testimonial', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: Testimonial) => {
    if (!window.confirm(`Delete the testimonial from ${item.name}?`)) return;
    try {
      await remove({ id: item._id });
      toast({ title: 'Testimonial deleted' });
    } catch (error) {
      toast({ title: 'Could not delete testimonial', description: error instanceof Error ? error.message : undefined, variant: 'destructive' });
    }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-2xl font-bold">Testimonials</h2><p className="text-sm text-gray-600">Each testimonial uses its own uploaded image on Homepage 3. Records marked “Needs image” have an invalid or missing link.</p></div>
      <Button onClick={() => start(null)}><Plus size={16} className="mr-2" />Add testimonial</Button>
    </div>
    {open && <div className="rounded-lg border bg-white p-5 space-y-4 max-w-3xl">
      <h3 className="text-lg font-semibold">{editing ? `Edit ${editing.name}` : 'New testimonial'}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">Name<Input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
        <label className="text-sm font-medium">Role<Input value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} /></label>
        <label className="text-sm font-medium">Location<Input value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} /></label>
        <label className="text-sm font-medium">Category<Input value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} /></label>
      </div>
      <label className="block text-sm font-medium">Testimonial<Textarea rows={5} value={form.content} onChange={event => setForm({ ...form, content: event.target.value })} /></label>
      <label className="block text-sm font-medium">{editing?.imageStatus === 'ready' ? 'Replace uploaded image' : 'Upload testimonial image'}<Input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setFile(event.target.files?.[0] || null)} />{file && <span className="block mt-1 font-normal text-gray-600">Selected: {file.name}</span>}</label>
      {editing?.imageStatus === 'ready' && editing.imageUrl && <img src={editing.imageUrl} alt={`Current image for ${editing.name}`} className="h-28 w-40 object-cover rounded" />}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={event => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
      <div className="flex gap-2"><Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save testimonial'}</Button><Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button></div>
    </div>}
    <div className="grid gap-3">
      {testimonials?.map(item => <div key={item._id} className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-4">
        {item.imageStatus === 'ready' && item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-20 w-24 rounded object-cover" /> : <div className="flex h-20 w-24 items-center justify-center rounded bg-rose-50 text-primary"><ImageOff size={25} /></div>}
        <div className="min-w-0 flex-1"><strong className="block">{item.name}</strong><span className="text-sm text-gray-600">{item.role}{item.location ? ` · ${item.location}` : ''}</span><p className="text-sm line-clamp-2 mt-1">{item.content}</p><span className={`text-xs font-semibold ${item.imageStatus === 'ready' ? 'text-green-700' : 'text-red-700'}`}>{item.imageStatus === 'ready' ? 'Image ready' : 'Needs image'}</span></div>
        <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => start(item)}><Pencil size={15} className="mr-1" />Edit</Button><Button variant="outline" size="sm" onClick={() => deleteItem(item)} aria-label={`Delete testimonial from ${item.name}`}><Trash2 size={15} /></Button></div>
      </div>)}
      {testimonials?.length === 0 && <p className="rounded-lg border bg-white p-6 text-gray-600">No testimonials yet. Add a verified quote and its image above.</p>}
    </div>
  </div>;
}
