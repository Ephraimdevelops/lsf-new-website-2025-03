import { supabase } from './supabase';

export type ContentBucket = 
  // Main content
  | 'hero-slides'
  | 'news'
  | 'publications'
  | 'success-stories'
  | 'resources'
  | 'team'
  | 'board'
  // Additional content
  | 'partners'
  | 'programs'
  | 'gallery'
  | 'testimonials'
  | 'documents'
  | 'approach'
  | 'blog';

export type FileType = 'image' | 'document' | 'pdf' | 'video';

interface UploadOptions {
  bucket: ContentBucket;
  file: File;
  type: FileType;
  subFolder?: string;
  existingUrl?: string;
  metadata?: Record<string, string>;
}

interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  metadata?: Record<string, string>;
}

export class FileUploadService {
  private static readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  private static readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  private static validateFile(file: File, type: FileType): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file type
    switch (type) {
      case 'image':
        if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
          throw new Error('Invalid image type. Allowed types: JPG, PNG, GIF, WebP');
        }
        break;
      case 'document':
      case 'pdf':
        if (!this.ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
          throw new Error('Invalid document type. Allowed types: PDF, DOC, DOCX, XLS, XLSX');
        }
        break;
      // Add more type validations as needed
    }
  }

  private static generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  static async uploadFile({
    bucket,
    file,
    type,
    subFolder = '',
    existingUrl,
    metadata = {}
  }: UploadOptions): Promise<FileUploadResult> {
    try {
      // Validate file
      this.validateFile(file, type);

      // Delete existing file if URL provided
      if (existingUrl) {
        const path = existingUrl.split('/').pop();
        if (path) {
          await supabase.storage
            .from(bucket)
            .remove([`${subFolder ? `${subFolder}/` : ''}${path}`]);
        }
      }

      // Generate unique filename
      const fileName = this.generateFileName(file);
      const filePath = `${subFolder ? `${subFolder}/` : ''}${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
          metadata
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: data.path,
        size: file.size,
        metadata
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async deleteFile(bucket: ContentBucket, url: string): Promise<void> {
    try {
      const path = url.split('/').pop();
      if (!path) return;

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  static getFileUrl(bucket: ContentBucket, path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return publicUrl;
  }
}

// Simplified export for common use cases
export const uploadFile = FileUploadService.uploadFile.bind(FileUploadService);
export const deleteFile = FileUploadService.deleteFile.bind(FileUploadService);
export const getFileUrl = FileUploadService.getFileUrl.bind(FileUploadService);
