-- Enable Row Level Security on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (user_metadata->>'role'),
      (app_metadata->>'role'),
      'user'
    )
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has any of the required roles
CREATE OR REPLACE FUNCTION has_any_role(user_id UUID, required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_id) = ANY(required_roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for public tables

-- News table policies
CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (is_admin(auth.uid()));

-- Publications table policies
CREATE POLICY "Public can view publications" ON public.publications
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage publications" ON public.publications
  FOR ALL USING (is_admin(auth.uid()));

-- Opportunities table policies
CREATE POLICY "Public can view opportunities" ON public.opportunities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage opportunities" ON public.opportunities
  FOR ALL USING (is_admin(auth.uid()));

-- Team members table policies
CREATE POLICY "Public can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (is_admin(auth.uid()));

-- Hero content table policies
CREATE POLICY "Public can view hero content" ON public.hero_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage hero content" ON public.hero_content
  FOR ALL USING (is_admin(auth.uid()));

-- Success stories table policies
CREATE POLICY "Public can view success stories" ON public.success_stories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage success stories" ON public.success_stories
  FOR ALL USING (is_admin(auth.uid()));

-- Programs table policies
CREATE POLICY "Public can view programs" ON public.programs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (is_admin(auth.uid()));

-- Create admin user if not exists (replace with actual admin email)
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   user_metadata
-- ) VALUES (
--   gen_random_uuid(),
--   'admin@lsf.or.tz',
--   crypt('admin123', gen_salt('bf')),
--   now(),
--   now(),
--   now(),
--   '{"role": "admin"}'::jsonb
-- ) ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_publications_type ON public.publications(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_team_members_type ON public.team_members(type);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members(order_index);

-- Create a view for user statistics (admin only)
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed_users,
  COUNT(*) FILTER (WHERE banned_until IS NOT NULL) as banned_users,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_users,
  COUNT(*) FILTER (WHERE user_metadata->>'role' = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE user_metadata->>'role' = 'staff') as staff_users,
  COUNT(*) FILTER (WHERE user_metadata->>'role' = 'paralegal') as paralegal_users,
  COUNT(*) FILTER (WHERE user_metadata->>'role' = 'stakeholder') as stakeholder_users
FROM auth.users;

-- Grant permissions
GRANT SELECT ON user_stats TO authenticated;
GRANT SELECT ON user_stats TO anon;

-- Create a function to get user activity
CREATE OR REPLACE FUNCTION get_user_activity(user_id UUID)
RETURNS TABLE(
  last_sign_in TIMESTAMPTZ,
  sign_in_count BIGINT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.last_sign_in_at,
    u.raw_user_meta_data->>'sign_in_count'::BIGINT,
    u.created_at
  FROM auth.users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table for user actions
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_log
  FOR SELECT USING (is_admin(auth.uid()));

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging on main tables
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event('INSERT', TG_TABLE_NAME, NEW.id, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event('UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event('DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to main tables
DROP TRIGGER IF EXISTS audit_news_trigger ON public.news;
CREATE TRIGGER audit_news_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.news
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_publications_trigger ON public.publications;
CREATE TRIGGER audit_publications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_opportunities_trigger ON public.opportunities;
CREATE TRIGGER audit_opportunities_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_team_members_trigger ON public.team_members;
CREATE TRIGGER audit_team_members_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create a function to get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 50)
RETURNS TABLE(
  id UUID,
  user_email TEXT,
  action TEXT,
  table_name TEXT,
  record_id UUID,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    u.email,
    al.action,
    al.table_name,
    al.record_id,
    al.created_at
  FROM public.audit_log al
  LEFT JOIN auth.users u ON al.user_id = u.id
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
