
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { matchingAlgorithm, MatchResult } from '@/services/matchingAlgorithm';
import { useToast } from '@/hooks/use-toast';

interface StartupProfile {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  description: string;
  funding_needed: string;
  tags?: string;
  user_id: string;
}

interface InvestorProfile {
  id: string;
  investor_name: string;
  sectors_interested?: string;
  preferred_stages?: string[];
  investment_range_min: string;
  investment_range_max: string;
  user_id: string;
}

export const useMatching = (userRole: 'startup' | 'investor', userId?: string) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minScore: 0.4,
    compatibility: 'all' as 'all' | 'excellent' | 'good' | 'fair',
    sortBy: 'score' as 'score' | 'compatibility'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchMatches();
    }
  }, [userId, userRole, filters]);

  const fetchMatches = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      if (userRole === 'investor') {
        await fetchStartupsForInvestor();
      } else {
        await fetchInvestorsForStartup();
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStartupsForInvestor = async () => {
    // Get investor profile
    const { data: investorData, error: investorError } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (investorError || !investorData) {
      throw new Error('Investor profile not found');
    }

    // Get all startup profiles
    const { data: startupsData, error: startupsError } = await supabase
      .from('startup_profiles')
      .select('*');

    if (startupsError) throw startupsError;

    // Calculate matches
    const matchResults = matchingAlgorithm.matchStartupsForInvestor(
      investorData as InvestorProfile,
      (startupsData || []) as StartupProfile[]
    );

    // Apply filters
    let filteredMatches = matchResults.filter(match => match.matchScore.score >= filters.minScore);
    
    if (filters.compatibility !== 'all') {
      filteredMatches = filteredMatches.filter(match => match.compatibility === filters.compatibility);
    }

    setMatches(filteredMatches);
  };

  const fetchInvestorsForStartup = async () => {
    // Get startup profile
    const { data: startupData, error: startupError } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (startupError || !startupData) {
      throw new Error('Startup profile not found');
    }

    // Get all investor profiles
    const { data: investorsData, error: investorsError } = await supabase
      .from('investor_profiles')
      .select('*');

    if (investorsError) throw investorsError;

    // Calculate matches
    const matchResults = matchingAlgorithm.matchInvestorsForStartup(
      startupData as StartupProfile,
      (investorsData || []) as InvestorProfile[]
    );

    // Apply filters
    let filteredMatches = matchResults.filter(match => match.matchScore.score >= filters.minScore);
    
    if (filters.compatibility !== 'all') {
      filteredMatches = filteredMatches.filter(match => match.compatibility === filters.compatibility);
    }

    setMatches(filteredMatches);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    matches,
    loading,
    filters,
    updateFilters,
    refetch: fetchMatches
  };
};
