
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

interface MatchScore {
  score: number;
  factors: {
    industryMatch: number;
    stageMatch: number;
    fundingMatch: number;
    keywordMatch: number;
  };
  reasoning: string[];
}

export interface MatchResult {
  profile: StartupProfile | InvestorProfile;
  matchScore: MatchScore;
  compatibility: 'excellent' | 'good' | 'fair' | 'poor';
}

export class MatchingAlgorithm {
  // Convert funding strings to numbers for comparison
  private parseFunding(funding: string): number {
    const cleaned = funding.toLowerCase().replace(/[^0-9.kmb]/g, '');
    let multiplier = 1;
    
    if (cleaned.includes('k')) multiplier = 1000;
    else if (cleaned.includes('m')) multiplier = 1000000;
    else if (cleaned.includes('b')) multiplier = 1000000000;
    
    const baseNumber = parseFloat(cleaned.replace(/[kmb]/g, ''));
    return baseNumber * multiplier;
  }

  // Calculate industry/sector compatibility
  private calculateIndustryMatch(startupIndustry: string, investorSectors?: string): number {
    if (!investorSectors) return 0.3; // Neutral score for missing data
    
    const startupIndustryLower = startupIndustry.toLowerCase();
    const investorSectorsLower = investorSectors.toLowerCase();
    
    // Direct match
    if (investorSectorsLower.includes(startupIndustryLower)) return 1.0;
    
    // Related industries matching
    const industryMap: Record<string, string[]> = {
      'fintech': ['finance', 'banking', 'payment', 'cryptocurrency', 'blockchain'],
      'healthtech': ['healthcare', 'medical', 'biotech', 'pharmaceutical'],
      'edtech': ['education', 'learning', 'training'],
      'proptech': ['real estate', 'property', 'construction'],
      'retailtech': ['retail', 'ecommerce', 'commerce'],
      'foodtech': ['food', 'restaurant', 'agriculture'],
      'mobility': ['transportation', 'automotive', 'logistics'],
      'energy': ['renewable', 'solar', 'clean tech', 'sustainability']
    };
    
    for (const [category, keywords] of Object.entries(industryMap)) {
      if (keywords.some(keyword => startupIndustryLower.includes(keyword) || investorSectorsLower.includes(keyword))) {
        if (startupIndustryLower.includes(category) || investorSectorsLower.includes(category)) {
          return 0.8;
        }
      }
    }
    
    return 0.2; // Low match
  }

  // Calculate stage compatibility
  private calculateStageMatch(startupStage: string, preferredStages?: string[]): number {
    if (!preferredStages || preferredStages.length === 0) return 0.3;
    
    const startupStageLower = startupStage.toLowerCase();
    const preferredStagesLower = preferredStages.map(stage => stage.toLowerCase());
    
    // Direct match
    if (preferredStagesLower.includes(startupStageLower)) return 1.0;
    
    // Adjacent stage matching
    const stageOrder = ['idea', 'pre-seed', 'seed', 'series a', 'series b', 'series c', 'growth', 'ipo'];
    const startupIndex = stageOrder.findIndex(stage => stage === startupStageLower);
    
    if (startupIndex !== -1) {
      for (const preferredStage of preferredStagesLower) {
        const preferredIndex = stageOrder.findIndex(stage => stage === preferredStage);
        if (preferredIndex !== -1 && Math.abs(startupIndex - preferredIndex) <= 1) {
          return 0.7; // Adjacent stage
        }
      }
    }
    
    return 0.1; // Poor match
  }

  // Calculate funding compatibility
  private calculateFundingMatch(startupFunding: string, investorMin: string, investorMax: string): number {
    const startupAmount = this.parseFunding(startupFunding);
    const investorMinAmount = this.parseFunding(investorMin);
    const investorMaxAmount = this.parseFunding(investorMax);
    
    // Perfect fit within range
    if (startupAmount >= investorMinAmount && startupAmount <= investorMaxAmount) {
      return 1.0;
    }
    
    // Close to range
    const rangeSize = investorMaxAmount - investorMinAmount;
    const deviation = Math.min(
      Math.abs(startupAmount - investorMinAmount),
      Math.abs(startupAmount - investorMaxAmount)
    );
    
    if (deviation <= rangeSize * 0.5) return 0.7;
    if (deviation <= rangeSize * 1.0) return 0.4;
    
    return 0.1;
  }

  // Calculate keyword/description match
  private calculateKeywordMatch(startupDesc: string, startupTags?: string, investorSectors?: string): number {
    const startupText = `${startupDesc} ${startupTags || ''}`.toLowerCase();
    const investorText = (investorSectors || '').toLowerCase();
    
    if (!investorText) return 0.3;
    
    const startupKeywords = startupText.split(/\s+/).filter(word => word.length > 3);
    const investorKeywords = investorText.split(/\s+/).filter(word => word.length > 3);
    
    const matches = startupKeywords.filter(keyword => 
      investorKeywords.some(invKeyword => invKeyword.includes(keyword) || keyword.includes(invKeyword))
    );
    
    return Math.min(matches.length / Math.max(startupKeywords.length, 1) * 2, 1.0);
  }

  // Main matching function for investors finding startups
  public matchStartupsForInvestor(investor: InvestorProfile, startups: StartupProfile[]): MatchResult[] {
    return startups.map(startup => {
      const industryMatch = this.calculateIndustryMatch(startup.industry, investor.sectors_interested);
      const stageMatch = this.calculateStageMatch(startup.stage, investor.preferred_stages);
      const fundingMatch = this.calculateFundingMatch(
        startup.funding_needed,
        investor.investment_range_min,
        investor.investment_range_max
      );
      const keywordMatch = this.calculateKeywordMatch(
        startup.description,
        startup.tags,
        investor.sectors_interested
      );

      const factors = {
        industryMatch,
        stageMatch,
        fundingMatch,
        keywordMatch
      };

      // Weighted average
      const score = (industryMatch * 0.3 + stageMatch * 0.25 + fundingMatch * 0.25 + keywordMatch * 0.2);

      const reasoning: string[] = [];
      if (industryMatch > 0.7) reasoning.push(`Strong industry alignment in ${startup.industry}`);
      if (stageMatch > 0.7) reasoning.push(`Perfect stage match for ${startup.stage} companies`);
      if (fundingMatch > 0.7) reasoning.push(`Funding requirement fits investment range`);
      if (keywordMatch > 0.6) reasoning.push(`High keyword compatibility in business description`);

      let compatibility: 'excellent' | 'good' | 'fair' | 'poor';
      if (score >= 0.8) compatibility = 'excellent';
      else if (score >= 0.6) compatibility = 'good';
      else if (score >= 0.4) compatibility = 'fair';
      else compatibility = 'poor';

      return {
        profile: startup,
        matchScore: { score, factors, reasoning },
        compatibility
      };
    }).sort((a, b) => b.matchScore.score - a.matchScore.score);
  }

  // Main matching function for startups finding investors
  public matchInvestorsForStartup(startup: StartupProfile, investors: InvestorProfile[]): MatchResult[] {
    return investors.map(investor => {
      const industryMatch = this.calculateIndustryMatch(startup.industry, investor.sectors_interested);
      const stageMatch = this.calculateStageMatch(startup.stage, investor.preferred_stages);
      const fundingMatch = this.calculateFundingMatch(
        startup.funding_needed,
        investor.investment_range_min,
        investor.investment_range_max
      );
      const keywordMatch = this.calculateKeywordMatch(
        startup.description,
        startup.tags,
        investor.sectors_interested
      );

      const factors = {
        industryMatch,
        stageMatch,
        fundingMatch,
        keywordMatch
      };

      const score = (industryMatch * 0.3 + stageMatch * 0.25 + fundingMatch * 0.25 + keywordMatch * 0.2);

      const reasoning: string[] = [];
      if (industryMatch > 0.7) reasoning.push(`Strong interest in ${startup.industry} sector`);
      if (stageMatch > 0.7) reasoning.push(`Actively invests in ${startup.stage} stage companies`);
      if (fundingMatch > 0.7) reasoning.push(`Investment range aligns with funding needs`);
      if (keywordMatch > 0.6) reasoning.push(`Investment focus matches business model`);

      let compatibility: 'excellent' | 'good' | 'fair' | 'poor';
      if (score >= 0.8) compatibility = 'excellent';
      else if (score >= 0.6) compatibility = 'good';
      else if (score >= 0.4) compatibility = 'fair';
      else compatibility = 'poor';

      return {
        profile: investor,
        matchScore: { score, factors, reasoning },
        compatibility
      };
    }).sort((a, b) => b.matchScore.score - a.matchScore.score);
  }
}

export const matchingAlgorithm = new MatchingAlgorithm();
