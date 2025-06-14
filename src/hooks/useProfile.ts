import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'startup' | 'investor' | 'mentor';
  created_at: string;
  updated_at: string;
}

interface StartupProfile {
  id: string;
  user_id: string;
  startup_name: string;
  industry: string;
  stage: 'Idea' | 'MVP' | 'Revenue';
  website?: string;
  description: string;
  tags?: string;
  funding_needed: string;
  pitch_deck_url?: string;
}

interface InvestorProfile {
  id: string;
  user_id: string;
  investor_name: string;
  investment_range_min: string;
  investment_range_max: string;
  sectors_interested?: string;
  preferred_stages: string[];
  contact_email: string;
}

interface MentorProfile {
  id: string;
  user_id: string;
  mentor_name: string;
  expertise: string;
  experience: string;
  bio: string;
  linkedin?: string;
  website?: string;
}

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [startupProfile, setStartupProfile] = useState<StartupProfile | null>(null);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      // Type assertion to ensure the role is properly typed
      const typedProfile: Profile = {
        ...profileData,
        role: profileData.role as 'startup' | 'investor' | 'mentor'
      };
      setProfile(typedProfile);

      // Fetch role-specific profile
      if (profileData.role === 'startup') {
        const { data: startupData, error: startupError } = await supabase
          .from('startup_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (startupError) throw startupError;
        
        if (startupData) {
          // Type assertion to ensure the stage is properly typed
          const typedStartupProfile: StartupProfile = {
            ...startupData,
            stage: startupData.stage as 'Idea' | 'MVP' | 'Revenue'
          };
          setStartupProfile(typedStartupProfile);
        }
      } else if (profileData.role === 'investor') {
        const { data: investorData, error: investorError } = await supabase
          .from('investor_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (investorError) throw investorError;
        setInvestorProfile(investorData);
      } else if (profileData.role === 'mentor') {
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentor_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (mentorError) throw mentorError;
        setMentorProfile(mentorData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStartupProfile = async (profileData: Omit<StartupProfile, 'id' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .upsert({
          user_id: userId,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion to ensure the stage is properly typed
      const typedData: StartupProfile = {
        ...data,
        stage: data.stage as 'Idea' | 'MVP' | 'Revenue'
      };
      setStartupProfile(typedData);
      
      toast({
        title: "Success",
        description: "Startup profile saved successfully!",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const saveInvestorProfile = async (profileData: Omit<InvestorProfile, 'id' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .upsert({
          user_id: userId,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      setInvestorProfile(data);
      
      toast({
        title: "Success",
        description: "Investor profile saved successfully!",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const saveMentorProfile = async (profileData: Omit<MentorProfile, 'id' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .upsert({
          user_id: userId,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      setMentorProfile(data);
      
      toast({
        title: "Success",
        description: "Mentor profile saved successfully!",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    profile,
    startupProfile,
    investorProfile,
    mentorProfile,
    loading,
    saveStartupProfile,
    saveInvestorProfile,
    saveMentorProfile,
    refetch: fetchProfile
  };
};
