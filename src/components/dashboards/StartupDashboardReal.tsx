
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Upload, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  LogOut, 
  Eye, 
  TrendingUp,
  Target,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import NotificationButton from '@/components/ui/notifications';

interface StartupDashboardRealProps {
  startupName: string;
  onFindInvestors: () => void;
  onUploadPitch: () => void;
  onMessages: () => void;
  onEvents: () => void;
  onResources: () => void;
  onCommunity: () => void;
  onAdmin?: () => void;
  onLogout: () => void;
}

interface DashboardStats {
  profileViews: number;
  investorMatches: number;
  messages: number;
  pitchViews: number;
}

interface Activity {
  id: string;
  type: 'profile_view' | 'message' | 'pitch_download';
  description: string;
  timestamp: string;
}

const StartupDashboardReal: React.FC<StartupDashboardRealProps> = ({
  startupName,
  onFindInvestors,
  onUploadPitch,
  onMessages,
  onEvents,
  onResources,
  onCommunity,
  onAdmin,
  onLogout
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    investorMatches: 0,
    messages: 0,
    pitchViews: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch real message count
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('to_user_id', user.id);

      if (messagesError) throw messagesError;

      // Fetch real investor count for matches
      const { data: investorsData, error: investorsError } = await supabase
        .from('investor_profiles')
        .select('id');

      if (investorsError) throw investorsError;

      // Update stats with real data
      setStats({
        profileViews: 0, // This would need to be tracked separately
        investorMatches: investorsData?.length || 0,
        messages: messagesData?.length || 0,
        pitchViews: 0 // This would need to be tracked separately
      });

      // Fetch real recent messages for activity feed
      const { data: recentMessages, error: recentError } = await supabase
        .from('messages')
        .select('id, from_user_id, created_at, profiles!from_user_id(full_name)')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentError) throw recentError;

      // Convert to activity format
      const realActivities: Activity[] = recentMessages?.map(msg => ({
        id: msg.id,
        type: 'message' as const,
        description: `New message from ${(msg.profiles as any)?.full_name || 'Unknown User'}`,
        timestamp: new Date(msg.created_at).toLocaleDateString()
      })) || [];

      setActivities(realActivities);

    } catch (error) {
      console.error('Error fetching real data:', error);
      // Set empty state on error
      setStats({
        profileViews: 0,
        investorMatches: 0,
        messages: 0,
        pitchViews: 0
      });
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Real notifications from database
  const notifications = activities.slice(0, 2).map((activity, index) => ({
    id: activity.id,
    title: activity.type === 'message' ? 'New Message' : 'New Activity',
    message: activity.description,
    type: 'info' as const,
    timestamp: activity.timestamp,
    read: false
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {startupName}!</h1>
            <p className="text-gray-600 mt-2">Track your progress and connect with investors</p>
          </div>
          <div className="flex gap-2">
            <NotificationButton notifications={notifications} />
            {onAdmin && (
              <Button 
                variant="outline" 
                onClick={onAdmin}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : stats.profileViews}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Investors</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats.investorMatches}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.messages}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pitch Views</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {loading ? '...' : stats.pitchViews}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200 bg-green-50" onClick={onFindInvestors}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Find Investors
              </CardTitle>
              <CardDescription>
                Browse {stats.investorMatches} available investors on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Browse Investors
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onUploadPitch}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Pitch Deck
              </CardTitle>
              <CardDescription>
                Upload and manage your pitch deck materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Pitch Deck
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onMessages}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Messages
              </CardTitle>
              <CardDescription>
                {stats.messages > 0 ? `${stats.messages} messages waiting` : 'No new messages'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onEvents}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Events
              </CardTitle>
              <CardDescription>
                Join networking events and pitch competitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Events
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onResources}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Resources
              </CardTitle>
              <CardDescription>
                Access funding guides and startup resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onCommunity}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-gray-600">Connect & network</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Join discussions with other entrepreneurs and share insights.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Tips */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading activity...</div>
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-600">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                  <p className="text-xs mt-1">Activity will appear here as you use the platform</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Maximize your fundraising success</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  Complete your startup profile to attract more investors
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  Upload a compelling pitch deck with clear financials
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                  Respond to investor messages within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                  Network actively in the community section
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboardReal;
