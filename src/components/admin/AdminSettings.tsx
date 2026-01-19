import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Save, RefreshCw } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const { user: clerkUser } = useUser();

  // Fetch settings from database
  const dbSettings = useQuery(api.settings.getSettings);
  const updateSettings = useMutation(api.settings.updateSettings);

  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with database
  useEffect(() => {
    if (dbSettings) {
      setSettings({
        siteName: dbSettings.siteName || '',
        contactEmail: dbSettings.contactEmail || '',
        contactPhone: dbSettings.contactPhone || '',
        facebookUrl: dbSettings.facebookUrl || '',
        twitterUrl: dbSettings.twitterUrl || '',
        instagramUrl: dbSettings.instagramUrl || '',
      });
    }
  }, [dbSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateSettings({ settings });
      setHasChanges(false);
      toast({
        title: "Settings Saved",
        description: "Your changes have been saved to the database.",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!dbSettings) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-panton">Admin Settings</h2>
        {hasChanges && (
          <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Site Information */}
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
                  <label htmlFor="siteName" className="text-sm font-medium font-calibri">
                    Organization Name
                  </label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="Legal Services Facility"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium font-calibri">
                    Contact Email
                  </label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="info@lsftz.org"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="text-sm font-medium font-calibri">
                    Contact Phone
                  </label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="+255 123 456 789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
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
                  <label htmlFor="facebookUrl" className="text-sm font-medium font-calibri">
                    Facebook URL
                  </label>
                  <Input
                    id="facebookUrl"
                    name="facebookUrl"
                    value={settings.facebookUrl}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="https://facebook.com/lsftz"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="twitterUrl" className="text-sm font-medium font-calibri">
                    Twitter URL
                  </label>
                  <Input
                    id="twitterUrl"
                    name="twitterUrl"
                    value={settings.twitterUrl}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="https://twitter.com/lsftz"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagramUrl" className="text-sm font-medium font-calibri">
                    Instagram URL
                  </label>
                  <Input
                    id="instagramUrl"
                    name="instagramUrl"
                    value={settings.instagramUrl}
                    onChange={handleChange}
                    className="font-calibri"
                    placeholder="https://instagram.com/lsftz"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security - Clerk Integration */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="font-panton flex items-center gap-2">
                Account Security
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-normal">
                  Managed by Clerk
                </span>
              </CardTitle>
              <CardDescription className="font-calibri">
                Your account security settings are managed by our authentication provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {clerkUser?.primaryEmailAddress?.emailAddress || 'Admin User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Change password, enable 2FA, manage sessions
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Open Clerk's user profile modal
                      const clerkBtn = document.querySelector('[data-clerk-user-button]');
                      if (clerkBtn) {
                        (clerkBtn as HTMLElement).click();
                      } else {
                        // Fallback: Open Clerk directly
                        window.open('https://accounts.clerk.dev/user', '_blank');
                      }
                    }}
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Manage Security
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (dbSettings) {
                  setSettings({
                    siteName: dbSettings.siteName || '',
                    contactEmail: dbSettings.contactEmail || '',
                    contactPhone: dbSettings.contactPhone || '',
                    facebookUrl: dbSettings.facebookUrl || '',
                    twitterUrl: dbSettings.twitterUrl || '',
                    instagramUrl: dbSettings.instagramUrl || '',
                  });
                  setHasChanges(false);
                }
              }}
              disabled={!hasChanges || isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="font-calibri gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
