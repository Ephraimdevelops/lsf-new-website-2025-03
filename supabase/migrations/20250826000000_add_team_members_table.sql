-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  linkedin TEXT,
  email TEXT,
  twitter TEXT,
  type TEXT NOT NULL CHECK (type IN ('team', 'board')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view team members" 
ON public.team_members 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample team members data
INSERT INTO public.team_members (name, position, bio, image, linkedin, email, twitter, type, order_index) VALUES
-- Executive Team
('Dr. Fatuma Mwalimu', 'Executive Director', 'Leading LSF with over 15 years of experience in legal empowerment and human rights advocacy across Tanzania. Dr. Mwalimu holds a PhD in Law from the University of London and has been instrumental in establishing LSF as a leading organization in legal empowerment.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'fatuma@lsf.or.tz', NULL, 'team', 1),
('John Mwangi', 'Programs Director', 'Overseeing program implementation and community partnerships across all 184 districts of Tanzania. John brings over 10 years of experience in development programming and has successfully managed programs worth over USD 25 million.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'john@lsf.or.tz', NULL, 'team', 2),
('Grace Kimani', 'Legal Affairs Coordinator', 'Coordinating legal aid services and training programs for community paralegals nationwide. Grace is an advocate of the High Court of Tanzania and has trained over 1,000 community paralegals across the country.', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'grace@lsf.or.tz', NULL, 'team', 3),
('Ahmed Hassan', 'Communications Manager', 'Managing public communications, advocacy campaigns, and stakeholder engagement initiatives. Ahmed has increased LSF''s media visibility by 300% and led the successful Mama Samia Legal Aid Campaign.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'ahmed@lsf.or.tz', '#', 'team', 4),
('Dr. Amina Juma', 'Research & Policy Director', 'Leading research initiatives and policy advocacy to strengthen legal frameworks. Dr. Juma has authored over 20 research papers on legal empowerment and has been instrumental in influencing policy changes at national level.', 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'amina@lsf.or.tz', NULL, 'team', 5),
('Michael Ngozi', 'Finance Manager', 'Managing financial operations and ensuring compliance with donor requirements. Michael is a certified accountant with 12 years of experience in NGO financial management and has successfully managed LSF''s financial operations.', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'michael@lsf.or.tz', NULL, 'team', 6),

-- Board Members
('Hon. Justice Mary Kimani', 'Board Chairperson', 'Former High Court Judge with 25 years of experience in the judiciary and a strong advocate for access to justice. Justice Kimani has led landmark cases on women''s property rights and established the first mobile court services in rural Tanzania.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'mary.kimani@lsf.or.tz', NULL, 'board', 1),
('Prof. David Mwalimu', 'Vice Chairperson', 'Law Professor at University of Dar es Salaam, specializing in human rights law and legal empowerment. Prof. Mwalimu has published 45 academic papers and serves as a consultant to the African Union on legal empowerment.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'david.mwalimu@lsf.or.tz', NULL, 'board', 2),
('Ms. Sarah Ndugu', 'Secretary', 'Civil society leader with extensive experience in community development and women''s rights advocacy. Sarah has led campaigns resulting in 3 policy changes for women''s rights and trained over 500 community paralegals.', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', NULL, 'sarah.ndugu@lsf.or.tz', NULL, 'board', 3),
('Mr. James Mwenda', 'Treasurer', 'Financial expert with 20 years in development finance and organizational management. James has managed over $100M in development funds and implemented financial systems for 50+ NGOs across Tanzania.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', NULL, 'james.mwenda@lsf.or.tz', NULL, 'board', 4),
('Dr. Rehema Mwalimu', 'Board Member', 'Development expert with 18 years of experience in international development and gender equality. Dr. Mwalimu has worked with UN Women and has extensive experience in legal empowerment programs across East Africa.', 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', '#', 'rehema@lsf.or.tz', NULL, 'board', 5);
