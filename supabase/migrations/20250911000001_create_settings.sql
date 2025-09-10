-- Create settings table for system configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Legal Services Facility',
  contact_email TEXT,
  contact_phone TEXT,
  social_media JSONB DEFAULT '{"facebook": "", "twitter": "", "instagram": ""}',
  analytics_id TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set RLS policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Everyone can view settings
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
