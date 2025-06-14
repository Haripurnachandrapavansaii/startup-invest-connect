
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, TrendingUp, Users, DollarSign, Target, BookOpen } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    type: 'profile_improvement' | 'networking' | 'market_insight' | 'funding_opportunity' | 'mentorship';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    estimatedImpact: string;
    factors: {
      profileCompleteness: number;
      activityLevel: number;
      matchingSuccess: number;
      industryTrends: number;
    };
  };
  onDismiss: (id: string) => void;
  onAction?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onDismiss,
  onAction
}) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'profile_improvement':
        return <Target className="w-5 h-5" />;
      case 'networking':
        return <Users className="w-5 h-5" />;
      case 'market_insight':
        return <TrendingUp className="w-5 h-5" />;
      case 'funding_opportunity':
        return <DollarSign className="w-5 h-5" />;
      case 'mentorship':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'profile_improvement':
        return 'text-blue-600';
      case 'networking':
        return 'text-purple-600';
      case 'market_insight':
        return 'text-green-600';
      case 'funding_opportunity':
        return 'text-orange-600';
      case 'mentorship':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${getTypeColor()}`}>
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getPriorityColor()}>
                  {recommendation.priority.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">{recommendation.category}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(recommendation.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4">{recommendation.description}</p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Estimated Impact</span>
            <span className="text-green-600 font-medium">{recommendation.estimatedImpact}</span>
          </div>
        </div>

        {/* Recommendation factors */}
        <div className="space-y-2 mb-4">
          <div className="text-sm font-medium text-gray-700">Based on:</div>
          
          <div className="flex items-center justify-between text-xs">
            <span>Profile Completeness</span>
            <span>{Math.round(recommendation.factors.profileCompleteness * 100)}%</span>
          </div>
          <Progress value={recommendation.factors.profileCompleteness * 100} className="h-1" />

          <div className="flex items-center justify-between text-xs">
            <span>Activity Level</span>
            <span>{Math.round(recommendation.factors.activityLevel * 100)}%</span>
          </div>
          <Progress value={recommendation.factors.activityLevel * 100} className="h-1" />

          <div className="flex items-center justify-between text-xs">
            <span>Industry Trends</span>
            <span>{Math.round(recommendation.factors.industryTrends * 100)}%</span>
          </div>
          <Progress value={recommendation.factors.industryTrends * 100} className="h-1" />
        </div>

        <Button 
          onClick={onAction}
          className="w-full"
          variant={recommendation.priority === 'high' ? 'default' : 'outline'}
        >
          Take Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
