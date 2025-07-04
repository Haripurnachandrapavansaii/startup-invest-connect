
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageSquare, TrendingUp, Calendar, BookOpen, Settings, LogOut, Users, Star, Eye, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import NotificationButton from '@/components/ui/notifications';

interface StartupProfile {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  description: string;
  funding_needed: string;
  user_id: string;
}

interface InvestorDashboardRealProps {
  investorName: string;
  onViewProfile: (startupId: string) => void;
  onMessage: (userId: string) => void;
  onEvents: () => void;
  onResources: () => void;
  onCommunity: () => void;
  onRecommendations: () => void;
  onAdmin?: () => void;
  onLogout: () => void;
}

const InvestorDashboardReal = ({ 
  investorName, 
  onViewProfile, 
  onMessage,
  onEvents,
  onResources,
  onCommunity,
  onRecommendations,
  onAdmin,
  onLogout 
}: InvestorDashboardRealProps) => {
  const [featuredStartups, setFeaturedStartups] = useState<StartupProfile[]>([]);
  const [showAllStartups, setShowAllStartups] = useState(false);
  const [allStartups, setAllStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    startupsAvailable: 0,
    messagesReceived: 0,
    eventsAvailable: 0,
    resourcesAvailable: 0
  });

  useEffect(() => {
    fetchFeaturedStartups();
    fetchInvestorStats();
  }, []);

  const fetchFeaturedStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedStartups(data || []);
    } catch (error) {
      console.error('Error fetching featured startups:', error);
    }
  };

  const fetchInvestorStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get real startup count
      const { data: startupsData, error: startupsError } = await supabase
        .from('startup_profiles')
        .select('id');

      if (startupsError) throw startupsError;

      // Get real messages count
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('to_user_id', user.id);

      if (messagesError) throw messagesError;

      // Get real events count
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .gte('event_date', new Date().toISOString());

      if (eventsError) throw eventsError;

      // Get real resources count
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('id');

      if (resourcesError) throw resourcesError;

      setStats({
        startupsAvailable: startupsData?.length || 0,
        messagesReceived: messagesData?.length || 0,
        eventsAvailable: eventsData?.length || 0,
        resourcesAvailable: resourcesData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching investor stats:', error);
    }
  };

  const fetchAllStartups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllStartups(data || []);
      setShowAllStartups(true);
    } catch (error) {
      console.error('Error fetching all startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseStartups = () => {
    if (!showAllStartups) {
      fetchAllStartups();
    } else {
      setShowAllStartups(false);
    }
  };

  // Real notifications based on actual data
  const notifications = featuredStartups.slice(0, 2).map((startup, index) => ({
    id: startup.id,
    title: 'New Startup Registered',
    message: `${startup.startup_name} is seeking ${startup.funding_needed} in funding`,
    type: 'info' as const,
    timestamp: 'Recently',
    read: false
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {investorName}!</h1>
            <p className="text-gray-600 mt-2">Discover promising startups and investment opportunities</p>
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
                  <p className="text-sm font-medium text-gray-600">Available Startups</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.startupsAvailable}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-green-600">{stats.messagesReceived}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.eventsAvailable}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resources</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.resourcesAvailable}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Browse Startups
              </CardTitle>
              <CardDescription>
                Explore {stats.startupsAvailable} startups looking for investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={handleBrowseStartups}
                disabled={loading}
              >
                {loading ? 'Loading...' : showAllStartups ? 'Hide All Startups' : 'Browse All Startups'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Recommendations
              </CardTitle>
              <CardDescription>
                AI-curated startup matches for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={onRecommendations}>
                View Recommendations
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Portfolio
              </CardTitle>
              <CardDescription>
                Track your investment portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
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
                {stats.eventsAvailable} upcoming events available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Events
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onResources}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                Resources
              </CardTitle>
              <CardDescription>
                {stats.resourcesAvailable} investment guides and market insights
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
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-gray-600">Network & connect</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Connect with fellow investors and promising startups.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Explore Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* All Startups Section */}
        {showAllStartups && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">All Startups ({allStartups.length})</h2>
              <Button variant="outline" onClick={() => setShowAllStartups(false)}>
                Hide
              </Button>
            </div>
            {allStartups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No startups found.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Check back later as more startups join the platform!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allStartups.map((startup) => (
                  <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{startup.startup_name}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {startup.stage}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {startup.industry} • {startup.funding_needed}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {startup.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewProfile(startup.id)}
                          className="flex items-center gap-1"
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onMessage(startup.user_id)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recently Registered Startups</CardTitle>
              <CardDescription>Latest startups seeking investment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredStartups.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">No startups available yet.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back later as startups join the platform!
                  </p>
                </div>
              ) : (
                featuredStartups.map((startup) => (
                  <div key={startup.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{startup.startup_name}</h4>
                      <p className="text-sm text-gray-600">{startup.industry} • {startup.stage}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{startup.description}</p>
                      <p className="text-xs font-medium text-green-600 mt-1">Seeking: {startup.funding_needed}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => onViewProfile(startup.id)}>
                        View
                      </Button>
                      <Button size="sm" onClick={() => onMessage(startup.user_id)}>
                        Contact
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Current activity and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Active Startups</span>
                  <span className="text-sm text-blue-600 font-semibold">{stats.startupsAvailable}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Your Messages</span>
                  <span className="text-sm text-green-600 font-semibold">{stats.messagesReceived}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Upcoming Events</span>
                  <span className="text-sm text-purple-600 font-semibold">{stats.eventsAvailable}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Resources Available</span>
                  <span className="text-sm text-orange-600 font-semibold">{stats.resourcesAvailable}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardReal;
