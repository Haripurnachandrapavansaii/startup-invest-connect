
-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_likes table
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create community_comments table
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on community tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for community_posts
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = author_id);

-- RLS policies for community_likes
CREATE POLICY "Anyone can view likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.community_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for community_comments
CREATE POLICY "Anyone can view comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON public.community_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON public.community_comments FOR DELETE USING (auth.uid() = author_id);
