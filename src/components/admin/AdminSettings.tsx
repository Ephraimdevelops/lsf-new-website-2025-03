
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AdminSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'Legal Services Facility',
    contactEmail: 'info@lsftz.org',
    contactPhone: '+255 123 456 789',
    socialMedia: {
      facebook: 'https://facebook.com/lsftz',
      twitter: 'https://twitter.com/lsftz',
      instagram: 'https://instagram.com/lsftz',
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof typeof settings],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-panton">Admin Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-panton">Site Information</CardTitle>
              <CardDescription className="font-calibri">
                Update your organization information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="siteName" className="text-sm font-medium font-calibri">Organization Name</label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium font-calibri">Contact Email</label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="text-sm font-medium font-calibri">Contact Phone</label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-panton">Social Media</CardTitle>
              <CardDescription className="font-calibri">
                Manage your social media links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="facebook" className="text-sm font-medium font-calibri">Facebook URL</label>
                  <Input
                    id="facebook"
                    name="socialMedia.facebook"
                    value={settings.socialMedia.facebook}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm font-medium font-calibri">Twitter URL</label>
                  <Input
                    id="twitter"
                    name="socialMedia.twitter"
                    value={settings.socialMedia.twitter}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="instagram" className="text-sm font-medium font-calibri">Instagram URL</label>
                  <Input
                    id="instagram"
                    name="socialMedia.instagram"
                    value={settings.socialMedia.instagram}
                    onChange={handleChange}
                    className="font-calibri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-panton">Security Settings</CardTitle>
              <CardDescription className="font-calibri">
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium font-calibri">Current Password</label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium font-calibri">New Password</label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="font-calibri"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium font-calibri">Confirm New Password</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="font-calibri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="font-calibri">
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
