
-- Create mentor_profiles table
CREATE TABLE public.mentor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  expertise TEXT NOT NULL,
  experience TEXT NOT NULL,
  bio TEXT NOT NULL,
  linkedin TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for mentor profiles
CREATE POLICY "Anyone can view mentor profiles" ON public.mentor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own mentor profile" ON public.mentor_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentor profile" ON public.mentor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Update profiles table to include mentor role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('startup', 'investor', 'mentor'));
