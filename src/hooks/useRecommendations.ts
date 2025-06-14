
import { useState, useEffect } from 'react';
import { recommendationEngine } from '@/services/recommendationEngine';
import { useProfile } from '@/hooks/useProfile';
import { useMatching } from '@/hooks/useMatching';

interface Recommendation {
  id: string;
  type: 'profile_improvement' | 'networking' | 'market_insight' | 'funding_opportunity' | 'mentorship';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  category: string;
  estimatedImpact: string;
  factors: {
    profileCompleteness: number;
    activityLevel: number;
    matchingSuccess: number;
    industryTrends: number;
  };
}

export const useRecommendations = (userId?: string) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);

  const { profile, startupProfile, investorProfile } = useProfile(userId);
  const userRole = profile?.role as 'startup' | 'investor' | 'mentor';
  const { matches } = useMatching(userRole, userId);

  useEffect(() => {
    if (profile && userId) {
      generateRecommendations();
    }
  }, [profile, startupProfile, investorProfile, matches, userId]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      let newRecommendations: Recommendation[] = [];

      if (profile?.role === 'startup' && startupProfile) {
        newRecommendations = recommendationEngine.generateStartupRecommendations(
          startupProfile,
          matches || []
        );
      } else if (profile?.role === 'investor' && investorProfile) {
        newRecommendations = recommendationEngine.generateInvestorRecommendations(
          investorProfile,
          matches || []
        );
      }

      // Filter out dismissed recommendations
      const filteredRecommendations = newRecommendations.filter(
        rec => !dismissedRecommendations.includes(rec.id)
      );

      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissRecommendation = (recommendationId: string) => {
    setDismissedRecommendations(prev => [...prev, recommendationId]);
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  return {
    recommendations,
    loading,
    dismissRecommendation,
    refreshRecommendations
  };
};
