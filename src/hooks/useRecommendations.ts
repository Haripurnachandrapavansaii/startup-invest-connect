
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
  
  // Only use matching for startup and investor roles
  const { matches } = useMatching(
    userRole === 'mentor' ? 'startup' : userRole, // Fallback to 'startup' for mentors to avoid type error
    userRole === 'mentor' ? undefined : userId // Don't pass userId for mentors
  );

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
      } else if (profile?.role === 'mentor') {
        // For mentors, generate basic recommendations without matches
        newRecommendations = [
          {
            id: 'mentor-networking',
            type: 'networking',
            title: 'Connect with Entrepreneurs',
            description: 'Expand your mentoring network by connecting with startups in your expertise areas',
            priority: 'medium',
            category: 'Networking',
            estimatedImpact: 'Build network',
            factors: {
              profileCompleteness: 0.8,
              activityLevel: 0.6,
              matchingSuccess: 0.5,
              industryTrends: 0.7
            }
          }
        ];
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
