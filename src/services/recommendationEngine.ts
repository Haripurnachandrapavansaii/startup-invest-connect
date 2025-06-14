
interface RecommendationFactors {
  profileCompleteness: number;
  activityLevel: number;
  matchingSuccess: number;
  industryTrends: number;
}

interface Recommendation {
  id: string;
  type: 'profile_improvement' | 'networking' | 'market_insight' | 'funding_opportunity' | 'mentorship';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  category: string;
  estimatedImpact: string;
  factors: RecommendationFactors;
}

export class RecommendationEngine {
  // Generate recommendations for startups
  public generateStartupRecommendations(
    startupProfile: any,
    recentMatches: any[],
    marketData?: any
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Profile completeness recommendations
    const profileScore = this.calculateProfileCompleteness(startupProfile);
    if (profileScore < 0.8) {
      recommendations.push({
        id: 'profile-completion',
        type: 'profile_improvement',
        title: 'Complete Your Startup Profile',
        description: 'Adding missing information can increase your match rate by up to 40%',
        priority: 'high',
        category: 'Profile',
        estimatedImpact: '+40% match rate',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.5,
          matchingSuccess: 0.3,
          industryTrends: 0.2
        }
      });
    }

    // Industry-specific recommendations
    if (startupProfile?.industry) {
      recommendations.push({
        id: 'industry-networking',
        type: 'networking',
        title: `Connect with ${startupProfile.industry} Investors`,
        description: `There are 12 active investors in ${startupProfile.industry} looking for ${startupProfile.stage} startups`,
        priority: 'medium',
        category: 'Networking',
        estimatedImpact: '12 potential matches',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.7,
          matchingSuccess: 0.6,
          industryTrends: 0.9
        }
      });
    }

    // Funding stage recommendations
    if (startupProfile?.stage && startupProfile?.funding_needed) {
      recommendations.push({
        id: 'funding-opportunity',
        type: 'funding_opportunity',
        title: 'Optimize Your Funding Ask',
        description: `Startups at ${startupProfile.stage} stage typically raise 20% more when they have detailed financial projections`,
        priority: 'medium',
        category: 'Funding',
        estimatedImpact: '+20% funding success',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.6,
          matchingSuccess: 0.4,
          industryTrends: 0.8
        }
      });
    }

    // Market insight recommendations
    recommendations.push({
      id: 'market-insight',
      type: 'market_insight',
      title: 'Market Trends in Your Industry',
      description: 'AI and automation startups are seeing 35% higher investor interest this quarter',
      priority: 'low',
      category: 'Market Intelligence',
      estimatedImpact: '35% trend boost',
      factors: {
        profileCompleteness: profileScore,
        activityLevel: 0.4,
        matchingSuccess: 0.3,
        industryTrends: 1.0
      }
    });

    // Mentorship recommendations
    if (recentMatches.length < 3) {
      recommendations.push({
        id: 'mentorship',
        type: 'mentorship',
        title: 'Connect with Industry Mentors',
        description: 'Startups with mentors are 70% more likely to secure funding within 6 months',
        priority: 'medium',
        category: 'Mentorship',
        estimatedImpact: '+70% funding probability',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.3,
          matchingSuccess: 0.2,
          industryTrends: 0.7
        }
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Generate recommendations for investors
  public generateInvestorRecommendations(
    investorProfile: any,
    recentMatches: any[],
    marketData?: any
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Profile completeness recommendations
    const profileScore = this.calculateInvestorProfileCompleteness(investorProfile);
    if (profileScore < 0.8) {
      recommendations.push({
        id: 'investor-profile-completion',
        type: 'profile_improvement',
        title: 'Enhance Your Investor Profile',
        description: 'Complete profiles receive 60% more quality startup applications',
        priority: 'high',
        category: 'Profile',
        estimatedImpact: '+60% applications',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.5,
          matchingSuccess: 0.4,
          industryTrends: 0.3
        }
      });
    }

    // Investment opportunity recommendations
    if (investorProfile?.sectors_interested) {
      recommendations.push({
        id: 'investment-opportunities',
        type: 'funding_opportunity',
        title: 'Hot Startups in Your Sectors',
        description: `8 high-growth startups in ${investorProfile.sectors_interested} are actively seeking funding`,
        priority: 'high',
        category: 'Investment Opportunities',
        estimatedImpact: '8 quality deals',
        factors: {
          profileCompleteness: profileScore,
          activityLevel: 0.8,
          matchingSuccess: 0.7,
          industryTrends: 0.9
        }
      });
    }

    // Portfolio diversification
    recommendations.push({
      id: 'diversification',
      type: 'market_insight',
      title: 'Portfolio Diversification Insights',
      description: 'Consider expanding into emerging sectors like CleanTech for balanced portfolio growth',
      priority: 'medium',
      category: 'Strategy',
      estimatedImpact: 'Risk reduction',
      factors: {
        profileCompleteness: profileScore,
        activityLevel: 0.6,
        matchingSuccess: 0.5,
        industryTrends: 0.8
      }
    });

    // Networking recommendations
    recommendations.push({
      id: 'investor-networking',
      type: 'networking',
      title: 'Connect with Co-investors',
      description: 'Join investor syndicates in your preferred sectors to increase deal flow',
      priority: 'medium',
      category: 'Networking',
      estimatedImpact: '+40% deal flow',
      factors: {
        profileCompleteness: profileScore,
        activityLevel: 0.7,
        matchingSuccess: 0.6,
        industryTrends: 0.5
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculateProfileCompleteness(profile: any): number {
    if (!profile) return 0;
    
    const fields = ['startup_name', 'industry', 'stage', 'description', 'funding_needed'];
    const optionalFields = ['website', 'tags', 'pitch_deck_url'];
    
    const requiredScore = fields.reduce((score, field) => {
      return score + (profile[field] ? 0.15 : 0);
    }, 0);
    
    const optionalScore = optionalFields.reduce((score, field) => {
      return score + (profile[field] ? 0.05 : 0);
    }, 0);
    
    return Math.min(requiredScore + optionalScore, 1);
  }

  private calculateInvestorProfileCompleteness(profile: any): number {
    if (!profile) return 0;
    
    const fields = ['investor_name', 'investment_range_min', 'investment_range_max', 'contact_email'];
    const optionalFields = ['sectors_interested', 'preferred_stages'];
    
    const requiredScore = fields.reduce((score, field) => {
      return score + (profile[field] ? 0.2 : 0);
    }, 0);
    
    const optionalScore = optionalFields.reduce((score, field) => {
      return score + (profile[field] ? 0.1 : 0);
    }, 0);
    
    return Math.min(requiredScore + optionalScore, 1);
  }
}

export const recommendationEngine = new RecommendationEngine();
