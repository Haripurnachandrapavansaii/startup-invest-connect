
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, BookOpen, LogOut, TrendingUp, Clock, Target } from 'lucide-react';
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

  useEffect(() => {
    fetchRecentStartups();
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

  // Sample notifications for demo
  const sampleNotifications = [
    {
      id: '1',
      title: 'Mentorship Request',
      message: 'TechFlow startup requested mentorship',
      type: 'info' as const,
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '2',
      title: 'Session Reminder',
      message: 'Mentoring session with DataCorp in 30 minutes',
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
            <NotificationButton notifications={sampleNotifications} />
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
                  <p className="text-sm font-medium text-gray-600">Total Mentees</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
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
                  <p className="text-2xl font-bold text-blue-600">24</p>
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
                  <p className="text-2xl font-bold text-green-600">85%</p>
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
                  <p className="text-2xl font-bold text-yellow-600">4.9</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onStartups}>
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
                Share insights and collaborate with other mentors in the community.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Join Community
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
                  <div key={startup.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{startup.startup_name}</h4>
                      <p className="text-sm text-gray-600">{startup.industry} • {startup.stage}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{startup.description}</p>
                    </div>
                    <Button size="sm">
                      Mentor
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentoring Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Listen actively and ask thoughtful questions</li>
                <li>• Share specific examples from your experience</li>
                <li>• Set clear goals and expectations with mentees</li>
                <li>• Provide honest and constructive feedback</li>
                <li>• Connect mentees with relevant opportunities</li>
                <li>• Follow up regularly on their progress</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
