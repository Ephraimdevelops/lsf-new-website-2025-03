-- Create news table for blog posts and articles
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT,
  category TEXT,
  slug TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  read_time TEXT,
  author TEXT,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create publications table for downloadable resources
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  excerpt TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT,
  image TEXT,
  file_url TEXT,
  featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  file_size TEXT,
  pages TEXT,
  category TEXT,
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  location TEXT[],
  objectives TEXT[],
  approach TEXT,
  beneficiaries JSONB,
  geographic_coverage TEXT[],
  results JSONB[],
  donors TEXT[],
  partners TEXT[],
  best_practices TEXT[],
  budget NUMERIC,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table for jobs and opportunities
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  is_open BOOLEAN DEFAULT true,
  deadline DATE,
  organization TEXT,
  location TEXT,
  requirements TEXT[],
  responsibilities TEXT[],
  application_url TEXT,
  salary_range TEXT,
  employment_type TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  category TEXT,
  url TEXT,
  file_url TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create success_stories table
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  client_name TEXT,
  client_image TEXT,
  location TEXT,
  category TEXT,
  impact_metrics JSONB,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for viewing)
CREATE POLICY "Public can view published news" 
ON public.news 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view published publications" 
ON public.publications 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view active programs" 
ON public.programs 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view open opportunities" 
ON public.opportunities 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view resources" 
ON public.resources 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view success stories" 
ON public.success_stories 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publications_updated_at
    BEFORE UPDATE ON public.publications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON public.programs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
    BEFORE UPDATE ON public.success_stories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for news
INSERT INTO public.news (title, content, excerpt, date, image, category, slug, featured, read_time, author, tags) VALUES
('LSF Launches Revolutionary Digital Legal Aid Platform', 'The Legal Services Facility has launched a groundbreaking digital platform that connects rural communities with legal services through an innovative mobile application. This platform represents a significant milestone in Tanzania''s digital transformation of legal services.', 'Groundbreaking technology makes legal services accessible to rural communities through innovative mobile app.', '2024-06-08', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Innovation', 'lsf-launches-digital-legal-aid-platform', true, '3 min', 'LSF Communications Team', ARRAY['innovation', 'digital', 'mobile app', 'rural communities']),
('Supreme Court Rules in Favor of Women''s Land Rights', 'In a historic legal precedent, the Supreme Court ruled in favor of women''s land rights after LSF''s strategic litigation empowered thousands of women across Tanzania.', 'Historic legal precedent established after LSF''s strategic litigation empowers thousands of women across Tanzania.', '2024-06-05', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Legal Victory', 'supreme-court-womens-land-rights', true, '5 min', 'Legal Team', ARRAY['women rights', 'land rights', 'legal victory', 'supreme court']),
('Community Paralegals Graduate from Training Program', 'A new cohort of 150 paralegals is ready to serve rural communities across 20 districts after completing comprehensive training.', 'New cohort of 150 paralegals ready to serve rural communities across 20 districts.', '2024-06-03', 'https://images.unsplash.com/photo-1517245386807-bb43f82c4c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 'Training', 'community-paralegals-graduate-training', true, '4 min', 'Training Team', ARRAY['training', 'paralegals', 'community', 'rural']);

-- Insert sample data for publications
INSERT INTO public.publications (title, description, excerpt, date, type, image, file_url, featured, download_count, file_size, pages, category) VALUES
('Annual Report 2023: Impact and Progress', 'Comprehensive annual report showcasing LSF''s transformative impact across Tanzania throughout 2023, including detailed analysis of program outcomes and beneficiary stories.', 'Comprehensive overview of LSF''s achievements, challenges, and impact in 2023.', '2024-01-15', 'annual-report', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '/downloads/annual-report-2023.pdf', true, 1250, '12.5 MB', '84 pages', 'Impact Report'),
('Women''s Land Rights Policy Framework', 'Evidence-based policy recommendations for strengthening legal protections for women across Tanzania.', 'Policy recommendations for strengthening gender justice mechanisms in Tanzania.', '2023-11-20', 'policy-brief', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '/downloads/womens-land-rights-policy.pdf', true, 890, '8.2 MB', '56 pages', 'Policy Document');

-- Insert sample data for opportunities
INSERT INTO public.opportunities (title, description, type, status, is_open, deadline, organization, location, requirements, responsibilities, application_url, salary_range, employment_type, featured) VALUES
('Senior Legal Officer - Community Programs', 'Join our dynamic team as a Senior Legal Officer to lead community-based legal empowerment initiatives and provide direct legal assistance to underserved communities.', 'job', 'open', true, '2024-07-15', 'Legal Services Facility', 'Dar es Salaam', ARRAY['Bachelor''s degree in Law (LLB) from a recognized institution', 'Valid practicing certificate from Law Society of Tanzania', 'Minimum 3 years experience in legal aid or community law', 'Fluency in English and Swahili'], ARRAY['Provide legal assistance and representation to community members', 'Train and supervise community paralegals', 'Develop legal education materials and conduct outreach programs', 'Collaborate with local partners and stakeholders'], 'mailto:careers@lsf.or.tz', 'TZS 1,500,000 - 2,200,000', 'full-time', true);