import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload, Copy, RefreshCcw } from 'lucide-react';

type MediaItem = {
  id: string;
  name: string;
  path: string;
  size: number | null;
  updated_at: string | null;
  publicUrl?: string;
};

const BUCKET = 'media'; // Ensure a Supabase Storage bucket named "media" exists

const AdminMediaLibrary: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return files;
    return files.filter(f => f.name.toLowerCase().includes(term));
  }, [files, search]);

  async function listFiles(): Promise<void> {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET).list(undefined, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'updated_at', order: 'desc' },
      });
      if (error) throw error;

      const items: MediaItem[] = (data || []).map((f: { name: string; updated_at?: string; metadata?: { size?: number } }) => {
        const path = f.name;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return {
          id: path,
          name: f.name,
          path,
          size: f.metadata?.size ?? null,
          updated_at: f.updated_at ?? null,
          publicUrl: pub?.publicUrl,
        } as MediaItem;
      });
      setFiles(items);
    } catch (err) {
      console.error('List media error:', err);
      toast({ title: 'Failed to load media', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    listFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(ev: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      toast({ title: 'File uploaded' });
      await listFiles();
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
      ev.target.value = '';
    }
  }

  async function handleDelete(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) throw error;
      toast({ title: 'File deleted' });
      setFiles(curr => curr.filter(f => f.path !== path));
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  }

  async function copyLink(path: string): Promise<void> {
    try {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = data?.publicUrl;
      if (!url) throw new Error('No public URL');
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied to clipboard' });
    } catch (err) {
      console.error('Copy link error:', err);
      toast({ title: 'Could not copy link', variant: 'destructive' });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Media Library</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={listFiles} disabled={isLoading}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <label className="inline-flex items-center">
            <input
              type="file"
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button>
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search media by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-sm text-gray-500">{filtered.length} items</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-4 space-y-2">
              <div className="font-medium truncate" title={item.name}>{item.name}</div>
              <div className="text-xs text-gray-500 break-all">{item.publicUrl || item.path}</div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => copyLink(item.path)}>
                  <Copy className="w-4 h-4 mr-1" /> Copy link
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.path)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="text-gray-500">Loading media...</div>
      )}
    </div>
  );
};

export default AdminMediaLibrary;


