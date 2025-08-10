import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/upload';

interface TeamMember {
  id?: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  photo_url?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  expertise?: string[];
  featured?: boolean;
}

interface TeamMemberFormProps {
  initialData?: TeamMember;
  onSubmit: (data: TeamMember) => Promise<void>;
  onCancel: () => void;
  type: 'team' | 'board';
}

export default function TeamMemberForm({ initialData, onSubmit, onCancel, type }: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMember>(initialData || {
    name: '',
    position: '',
    department: '',
    bio: '',
    photo_url: '',
    email: '',
    linkedin: '',
    twitter: '',
    expertise: [],
    featured: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadFile({
        contentType: type, // 'team' or 'board'
        subFolder: 'photos',
        file,
        existingUrl: formData.photo_url
      });
      
      setFormData(prev => ({ ...prev, photo_url: imageUrl }));
      toast({ title: 'Success', description: 'Photo uploaded successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to upload photo',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.bio) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save team member',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="position">Position*</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio*</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
          {formData.photo_url && (
            <img 
              src={formData.photo_url} 
              alt="Preview" 
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            value={formData.linkedin || ''}
            onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="twitter">Twitter Profile</Label>
          <Input
            id="twitter"
            value={formData.twitter || ''}
            onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
