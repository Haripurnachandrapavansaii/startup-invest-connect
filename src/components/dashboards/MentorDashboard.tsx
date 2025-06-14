
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, BookOpen, LogOut, TrendingUp, Clock, Target, Star, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import NotificationButton from '@/components/ui/notifications';

interface StartupProfile {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  description: string;
  user_id: string;
}

interface MentorDashboardProps {
  mentorName: string;
  onStartups: () => void;
  onMessages: () => void;
  onSchedule: () => void;
  onResources: () => void;
  onCommunity: () => void;
  onLogout: () => void;
}

const MentorDashboard = ({ 
  mentorName, 
  onStartups,
  onMessages,
  onSchedule,
  onResources,
  onCommunity,
  onLogout 
}: MentorDashboardProps) => {
  const [recentStartups, setRecentStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMentees: 0,
    sessionsThisMonth: 0,
    successRate: 0,
    rating: 0
  });

  useEffect(() => {
    fetchRecentStartups();
    fetchMentorStats();
  }, []);

  const fetchRecentStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorStats = async () => {
    try {
      // In a real implementation, these would be actual database queries
      setStats({
        totalMentees: Math.floor(Math.random() * 20) + 5,
        sessionsThisMonth: Math.floor(Math.random() * 15) + 8,
        successRate: Math.floor(Math.random() * 20) + 80,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1) as any
      });
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
    }
  };

  const notifications = [
    {
      id: '1',
      title: 'New Mentorship Request',
      message: 'EcoTech Innovations requested mentorship',
      type: 'info' as const,
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '2',
      title: 'Session Reminder',
      message: 'Mentoring session with DataFlow in 30 minutes',
      type: 'info' as const,
      timestamp: '30 minutes ago',
      read: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mentorName}!</h1>
            <p className="text-gray-600 mt-2">Ready to guide the next generation of entrepreneurs?</p>
          </div>
          <div className="flex gap-2">
            <NotificationButton notifications={notifications} />
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Mentees</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalMentees}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.sessionsThisMonth}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.rating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 bg-purple-50" onClick={onStartups}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Browse Startups
              </CardTitle>
              <CardDescription>
                Discover promising startups seeking mentorship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Find Startups
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onMessages}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with your mentees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSchedule}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Schedule
              </CardTitle>
              <CardDescription>
                Manage your mentoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onResources}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                Resources
              </CardTitle>
              <CardDescription>
                Access mentoring guides and tools
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
                  <p className="text-sm text-gray-600">Connect with mentors</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Share insights and collaborate with other mentors.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Achievements</h3>
                  <p className="text-sm text-gray-600">Track your impact</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                View your mentoring milestones and success stories.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Startups Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Startups</CardTitle>
              <CardDescription>Newly registered startups looking for mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading startups...</p>
                </div>
              ) : recentStartups.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">No startups available yet.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back later as startups join the platform!
                  </p>
                </div>
              ) : (
                recentStartups.map((startup) => (
                  <div key={startup.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{startup.startup_name}</h4>
                      <p className="text-sm text-gray-600">{startup.industry} • {startup.stage}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{startup.description}</p>
                    </div>
                    <Button size="sm" className="ml-4">
                      Mentor
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentoring Excellence</CardTitle>
              <CardDescription>Best practices for impactful mentoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Active Listening</p>
                    <p className="text-xs text-gray-600">Focus on understanding before advising</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Goal Setting</p>
                    <p className="text-xs text-gray-600">Help mentees define clear, actionable objectives</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Network Sharing</p>
                    <p className="text-xs text-gray-600">Connect mentees with relevant opportunities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Regular Check-ins</p>
                    <p className="text-xs text-gray-600">Maintain consistent communication and support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
