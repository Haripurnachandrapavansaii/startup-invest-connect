
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Eye, Star, TrendingUp, Target, DollarSign, Building } from 'lucide-react';
import { MatchResult } from '@/services/matchingAlgorithm';

interface EnhancedMatchCardProps {
  matchResult: MatchResult;
  onViewProfile: (id: string) => void;
  onMessage: (userId: string) => void;
  userRole: 'startup' | 'investor';
}

const EnhancedMatchCard: React.FC<EnhancedMatchCardProps> = ({
  matchResult,
  onViewProfile,
  onMessage,
  userRole
}) => {
  const { profile, matchScore, compatibility } = matchResult;
  
  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompatibilityBadgeColor = (compatibility: string) => {
    switch (compatibility) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isStartupProfile = 'startup_name' in profile;
  
  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4" style={{
      borderLeftColor: compatibility === 'excellent' ? '#10b981' : 
                      compatibility === 'good' ? '#3b82f6' :
                      compatibility === 'fair' ? '#f59e0b' : '#6b7280'
    }}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isStartupProfile ? profile.startup_name : profile.investor_name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCompatibilityBadgeColor(compatibility)}>
                {compatibility.toUpperCase()} MATCH
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {Math.round(matchScore.score * 100)}% Match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              Industry
            </span>
            <span>{Math.round(matchScore.factors.industryMatch * 100)}%</span>
          </div>
          <Progress value={matchScore.factors.industryMatch * 100} className="h-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Stage
            </span>
            <span>{Math.round(matchScore.factors.stageMatch * 100)}%</span>
          </div>
          <Progress value={matchScore.factors.stageMatch * 100} className="h-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Funding
            </span>
            <span>{Math.round(matchScore.factors.fundingMatch * 100)}%</span>
          </div>
          <Progress value={matchScore.factors.fundingMatch * 100} className="h-1" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Keywords
            </span>
            <span>{Math.round(matchScore.factors.keywordMatch * 100)}%</span>
          </div>
          <Progress value={matchScore.factors.keywordMatch * 100} className="h-1" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Profile Info */}
        <div className="space-y-2 mb-4">
          {isStartupProfile ? (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Industry:</span> {profile.industry}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Stage:</span> {profile.stage}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Funding Needed:</span> {profile.funding_needed}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sectors:</span> {profile.sectors_interested || 'Various'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Investment Range:</span> {profile.investment_range_min} - {profile.investment_range_max}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Preferred Stages:</span> {profile.preferred_stages?.join(', ') || 'Various'}
              </p>
            </>
          )}
        </div>

        {/* Match Reasoning */}
        {matchScore.reasoning.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Why this is a good match:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {matchScore.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {isStartupProfile ? profile.description : `Looking for ${profile.sectors_interested || 'various'} opportunities`}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onViewProfile(profile.id)}
            className="flex-1"
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Profile
          </Button>
          <Button 
            onClick={() => onMessage(profile.user_id)}
            className="flex-1"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMatchCard;
