
-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view startup profiles" ON public.startup_profiles;
DROP POLICY IF EXISTS "Users can manage own startup profile" ON public.startup_profiles;
DROP POLICY IF EXISTS "Anyone can view investor profiles" ON public.investor_profiles;
DROP POLICY IF EXISTS "Users can manage own investor profile" ON public.investor_profiles;

-- RLS policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS policies for messages table
CREATE POLICY "Users can view their own messages" ON public.messages 
FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their received messages" ON public.messages 
FOR UPDATE USING (auth.uid() = to_user_id);

-- RLS policies for startup_profiles table
CREATE POLICY "Anyone can view startup profiles" ON public.startup_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own startup profile" ON public.startup_profiles 
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for investor_profiles table  
CREATE POLICY "Anyone can view investor profiles" ON public.investor_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own investor profile" ON public.investor_profiles 
FOR ALL USING (auth.uid() = user_id);
