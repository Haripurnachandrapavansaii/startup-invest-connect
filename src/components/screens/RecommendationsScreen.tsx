
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRecommendations } from '@/hooks/useRecommendations';
import RecommendationCard from '@/components/recommendations/RecommendationCard';

interface RecommendationsScreenProps {
  onBack: () => void;
  onMessage: (userId: string) => void;
}

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  onBack,
  onMessage
}) => {
  const { user } = useAuth();
  const { recommendations, loading, dismissRecommendation, refreshRecommendations } = useRecommendations(user?.id);

  const handleRecommendationAction = (recommendationId: string) => {
    // For now, we'll just dismiss the recommendation when action is taken
    // In a real app, this would navigate to the relevant screen or perform the action
    console.log('Taking action for recommendation:', recommendationId);
    dismissRecommendation(recommendationId);
  };

  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  const totalRecommendations = recommendations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Recommendations</h1>
              <p className="text-gray-600">Personalized insights to grow your business</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold">{totalRecommendations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{highPriorityCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Generating personalized recommendations...</p>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile and start networking to receive personalized recommendations.
            </p>
            <Button onClick={refreshRecommendations} variant="outline">
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Recommendations ({totalRecommendations})
              </h2>
            </div>
            
            <div className="grid gap-6">
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onDismiss={dismissRecommendation}
                  onAction={() => handleRecommendationAction(recommendation.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsScreen;
