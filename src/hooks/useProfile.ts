
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'startup' | 'investor';
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

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [startupProfile, setStartupProfile] = useState<StartupProfile | null>(null);
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
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
      setProfile(profileData);

      // Fetch role-specific profile
      if (profileData.role === 'startup') {
        const { data: startupData, error: startupError } = await supabase
          .from('startup_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (startupError) throw startupError;
        setStartupProfile(startupData);
      } else if (profileData.role === 'investor') {
        const { data: investorData, error: investorError } = await supabase
          .from('investor_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (investorError) throw investorError;
        setInvestorProfile(investorData);
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
      setStartupProfile(data);
      
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

  return {
    profile,
    startupProfile,
    investorProfile,
    loading,
    saveStartupProfile,
    saveInvestorProfile,
    refetch: fetchProfile
  };
};
