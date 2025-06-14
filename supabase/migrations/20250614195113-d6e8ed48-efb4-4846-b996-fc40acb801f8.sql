
-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pitch-decks', 
  'pitch-decks', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
);

-- Create pitch_decks table
CREATE TABLE public.pitch_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID REFERENCES public.startup_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for pitch_decks table
ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;

-- Startup owners can manage their own pitch decks
CREATE POLICY "Startup owners can manage their pitch decks" 
  ON public.pitch_decks 
  FOR ALL 
  USING (
    startup_id IN (
      SELECT id FROM public.startup_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Investors can view pitch decks
CREATE POLICY "Investors can view pitch decks" 
  ON public.pitch_decks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'investor'
    )
  );

-- Storage policies for pitch-decks bucket
CREATE POLICY "Startup owners can upload pitch decks"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pitch-decks' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Startup owners can update their pitch decks"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pitch-decks' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Startup owners can delete their pitch decks"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pitch-decks' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Authenticated users can view pitch decks"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pitch-decks' AND
    auth.role() = 'authenticated'
  );
