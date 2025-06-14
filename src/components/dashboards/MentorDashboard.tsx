
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  LogOut, 
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const MentorDashboard: React.FC<MentorDashboardProps> = ({
  mentorName,
  onStartups,
  onMessages,
  onSchedule,
  onResources,
  onCommunity,
  onLogout
}) => {
  const [recentStartups, setRecentStartups] = useState<StartupProfile[]>([]);
  const [stats, setStats] = useState({
    totalStartups: 0,
    messages: 0,
    upcomingEvents: 0,
    resourcesAvailable: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch recent startups
      const { data: startupsData, error: startupsError } = await supabase
        .from('startup_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (startupsError) throw startupsError;

      // Get total startup count
      const { data: allStartups, error: allStartupsError } = await supabase
        .from('startup_profiles')
        .select('id');

      if (allStartupsError) throw allStartupsError;

      // Get messages count
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('to_user_id', user.id);

      if (messagesError) throw messagesError;

      // Get upcoming events count
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .gte('event_date', new Date().toISOString());

      if (eventsError) throw eventsError;

      // Get resources count
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('id');

      if (resourcesError) throw resourcesError;

      setRecentStartups(startupsData || []);
      setStats({
        totalStartups: allStartups?.length || 0,
        messages: messagesData?.length || 0,
        upcomingEvents: eventsData?.length || 0,
        resourcesAvailable: resourcesData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mentorName}!</h1>
            <p className="text-gray-600 mt-2">Guide startups on their entrepreneurial journey</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Startups on Platform</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.totalStartups}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : stats.messages}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats.upcomingEvents}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resources</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {loading ? '...' : stats.resourcesAvailable}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 bg-purple-50" onClick={onStartups}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Browse Startups
              </CardTitle>
              <CardDescription>
                Connect with {stats.totalStartups} startups seeking mentorship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Startups
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
                {stats.messages > 0 ? `${stats.messages} messages waiting` : 'No new messages'}
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
                {stats.upcomingEvents > 0 ? `${stats.upcomingEvents} upcoming events` : 'No upcoming events'}
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
                {stats.resourcesAvailable} mentoring guides and frameworks
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
                  <p className="text-sm text-gray-600">Network & collaborate</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Connect with fellow mentors and share expertise.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Mentoring Tools
              </CardTitle>
              <CardDescription>
                Assessment and tracking tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Startups</CardTitle>
              <CardDescription>Latest startups that joined the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading startups...</div>
              ) : recentStartups.length > 0 ? (
                recentStartups.map((startup) => (
                  <div key={startup.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{startup.startup_name}</h4>
                      <p className="text-sm text-gray-600">{startup.industry} • {startup.stage}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{startup.description}</p>
                    </div>
                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No startups available yet</p>
                  <p className="text-xs mt-1">Check back as more startups join the platform</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentoring Tips</CardTitle>
              <CardDescription>Best practices for effective mentoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                  Listen actively and ask powerful questions
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  Share experiences, not just advice
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  Set clear expectations and boundaries
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                  Focus on the entrepreneur's growth
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2"></div>
                  Provide honest, constructive feedback
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
