import { supabase } from './supabase';

export type ContentType = 
  | 'hero-slides' 
  | 'news' 
  | 'publications' 
  | 'success-stories' 
  | 'resources'
  | 'team'
  | 'board';

interface UploadOptions {
  contentType: ContentType;
  subFolder?: string;
  file: File;
  existingUrl?: string;
}

export async function uploadFile({ contentType, subFolder, file, existingUrl }: UploadOptions): Promise<string> {
  try {
    // If there's an existing file, delete it first
    if (existingUrl) {
      const path = existingUrl.split('/').pop();
      if (path) {
        await supabase.storage
          .from(contentType)
          .remove([`${subFolder ? `${subFolder}/` : ''}${path}`]);
      }
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    const filePath = `${subFolder ? `${subFolder}/` : ''}${fileName}`;

    // Upload the new file
    const { data, error } = await supabase.storage
      .from(contentType)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(contentType)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(contentType: ContentType, url: string): Promise<void> {
  try {
    const path = url.split('/').pop();
    if (!path) return;

    await supabase.storage
      .from(contentType)
      .remove([path]);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
