
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Filter, Users, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMatching } from '@/hooks/useMatching';
import EnhancedMatchCard from '@/components/matching/EnhancedMatchCard';

interface EnhancedMatchingScreenProps {
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onMessage: (userId: string) => void;
}

const EnhancedMatchingScreen: React.FC<EnhancedMatchingScreenProps> = ({
  onBack,
  onViewProfile,
  onMessage
}) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const userRole = profile?.role as 'startup' | 'investor';
  
  const {
    matches,
    loading,
    filters,
    updateFilters
  } = useMatching(userRole, user?.id);

  const getScreenTitle = () => {
    return userRole === 'startup' ? 'Find Perfect Investors' : 'Discover Great Startups';
  };

  const getScreenDescription = () => {
    return userRole === 'startup' 
      ? 'AI-powered matching to find investors aligned with your startup'
      : 'AI-powered matching to find startups that fit your investment criteria';
  };

  const excellentMatches = matches.filter(m => m.compatibility === 'excellent');
  const goodMatches = matches.filter(m => m.compatibility === 'good');
  const fairMatches = matches.filter(m => m.compatibility === 'fair');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Analyzing matches...</p>
          <p className="text-sm text-gray-600">Our AI is finding the best matches for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getScreenTitle()}</h1>
            <p className="text-gray-600">{getScreenDescription()}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Matches</p>
                  <p className="text-2xl font-bold text-blue-600">{matches.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Excellent</p>
                  <p className="text-2xl font-bold text-green-600">{excellentMatches.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Good Matches</p>
                  <p className="text-2xl font-bold text-blue-600">{goodMatches.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.matchScore.score, 0) / matches.length * 100) : 0}%
                  </p>
                </div>
                <Filter className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Match Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Compatibility Level</label>
                <Select value={filters.compatibility} onValueChange={(value) => updateFilters({ compatibility: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="excellent">Excellent Only</SelectItem>
                    <SelectItem value="good">Good & Above</SelectItem>
                    <SelectItem value="fair">Fair & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Score: {Math.round(filters.minScore * 100)}%
                </label>
                <Slider
                  value={[filters.minScore * 100]}
                  onValueChange={(value) => updateFilters({ minScore: value[0] / 100 })}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Match Score</SelectItem>
                    <SelectItem value="compatibility">Compatibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matches */}
        <div className="space-y-6">
          {excellentMatches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Excellent Matches ({excellentMatches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {excellentMatches.map((match, index) => (
                  <EnhancedMatchCard
                    key={`${match.profile.id}-${index}`}
                    matchResult={match}
                    onViewProfile={onViewProfile}
                    onMessage={onMessage}
                    userRole={userRole}
                  />
                ))}
              </div>
            </div>
          )}

          {goodMatches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Good Matches ({goodMatches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goodMatches.map((match, index) => (
                  <EnhancedMatchCard
                    key={`${match.profile.id}-${index}`}
                    matchResult={match}
                    onViewProfile={onViewProfile}
                    onMessage={onMessage}
                    userRole={userRole}
                  />
                ))}
              </div>
            </div>
          )}

          {fairMatches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Fair Matches ({fairMatches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fairMatches.map((match, index) => (
                  <EnhancedMatchCard
                    key={`${match.profile.id}-${index}`}
                    matchResult={match}
                    onViewProfile={onViewProfile}
                    onMessage={onMessage}
                    userRole={userRole}
                  />
                ))}
              </div>
            </div>
          )}

          {matches.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or updating your profile to get better matches.
                </p>
                <Button onClick={() => updateFilters({ minScore: 0.1, compatibility: 'all' })}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMatchingScreen;
