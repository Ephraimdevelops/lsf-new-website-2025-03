
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, File as FileIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  enableCompression?: boolean; // Enable image compression
}

// ==========================================
// IMAGE COMPRESSION UTILITY
// Uses Canvas to resize images before upload
// Prevents 3G timeouts for large camera photos
// ==========================================
async function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve) => {
    // Skip non-images
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width <= maxWidth) {
        // Already small enough
        resolve(file);
        return;
      }

      // Scale down
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * ratio);

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            console.log(`[OPTIMIZATION] Compressed ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        0.85 // 85% quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

const FileUpload = ({
  accept = "image/*,application/pdf,.doc,.docx",
  multiple = false,
  onUpload,
  maxSize = 20, // Default to 20MB
  label = "Upload Files",
  description = "Select files to upload",
  enableCompression = true, // Compression on by default
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large / Faili ni kubwa",
        description: `Max size allowed is ${maxSize}MB. Tafadhali chagua faili dogo zaidi.`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    if (accept && accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type);
      });

      if (!isAccepted) {
        toast({
          title: "Invalid file type",
          description: `Please select a valid file type: ${accept}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const filesToProcess: File[] = [];

    // Initial validation
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Pre-check before compression (allow slightly larger for compression)
      if (file.size <= maxSize * 2 * 1024 * 1024) {
        filesToProcess.push(file);
      } else {
        toast({
          title: "File too large",
          description: `${file.name} exceeds maximum size even after compression.`,
          variant: "destructive",
        });
      }
    }

    if (filesToProcess.length === 0) return;

    // Compress images if enabled
    setIsCompressing(true);
    const processedFiles: File[] = [];

    for (const file of filesToProcess) {
      let processed = file;

      if (enableCompression && file.type.startsWith('image/')) {
        try {
          processed = await compressImage(file, 1920);
        } catch (e) {
          console.warn('Compression failed, using original:', e);
        }
      }

      // Final validation after compression
      if (validateFile(processed)) {
        processedFiles.push(processed);
      }
    }

    setIsCompressing(false);

    if (processedFiles.length > 0) {
      setUploadedFiles(prev => multiple ? [...prev, ...processedFiles] : processedFiles);
      onUpload(processedFiles);

      toast({
        title: "Files uploaded",
        description: `${processedFiles.length} file(s) uploaded successfully`,
      });
    }
  }, [maxSize, enableCompression, multiple, onUpload, toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} className="text-blue-500" />;
    }
    return <FileIcon size={16} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isCompressing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
            <p className="text-sm text-gray-600">Optimizing images...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-700 underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Max file size: {maxSize}MB. Images auto-compressed for fast uploads.
              </p>
            </div>
          </>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
