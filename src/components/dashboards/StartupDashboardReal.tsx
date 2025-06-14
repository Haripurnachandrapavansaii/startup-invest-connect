
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
  Settings,
  Bell
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real implementation, these would be actual database queries
      // For now, we'll simulate some realistic data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Simulate fetching real stats
        setStats({
          profileViews: Math.floor(Math.random() * 50) + 10,
          investorMatches: Math.floor(Math.random() * 8) + 2,
          messages: Math.floor(Math.random() * 15) + 3,
          pitchViews: Math.floor(Math.random() * 25) + 5
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample notifications
  const notifications = [
    {
      id: '1',
      title: 'New Investor Interest',
      message: 'TechVentures Capital viewed your pitch deck',
      type: 'info' as const,
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Message Received',
      message: 'You have a new message from Sarah Chen',
      type: 'success' as const,
      timestamp: '1 day ago',
      read: false
    }
  ];

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
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investor Matches</p>
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
                Discover investors interested in your sector and stage
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
                Communicate with interested investors
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

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Profile viewed by TechVentures Capital</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">New message from Sarah Chen</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Pitch deck downloaded by Innovation Partners</p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
              </div>
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
                  Keep your pitch deck updated with latest metrics
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  Respond to investor messages within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                  Attend networking events to meet potential investors
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                  Share regular updates about your progress
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
