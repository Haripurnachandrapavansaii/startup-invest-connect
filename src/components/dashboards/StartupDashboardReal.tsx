
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Inbox, Users, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StartupDashboardRealProps {
  startupName: string;
  onFindInvestors: () => void;
  onUploadPitch: () => void;
  onMessages: () => void;
  onLogout: () => void;
}

const StartupDashboardReal: React.FC<StartupDashboardRealProps> = ({
  startupName,
  onFindInvestors,
  onUploadPitch,
  onMessages,
  onLogout
}) => {
  const [stats, setStats] = useState({
    profileViews: 0,
    investorMatches: 0,
    messages: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get investor count (as a proxy for potential matches)
      const { count: investorCount } = await supabase
        .from('investor_profiles')
        .select('*', { count: 'exact' });

      // Get message count for current user
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('to_user_id', (await supabase.auth.getUser()).data.user?.id);

      setStats({
        profileViews: 0, // This would need additional tracking
        investorMatches: investorCount || 0,
        messages: messageCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {startupName}!</h1>
            <p className="text-gray-600">Manage your startup journey</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onFindInvestors}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Find Investors
              </CardTitle>
              <CardDescription>
                Discover investors interested in your sector and stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Browse Investors</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onUploadPitch}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Upload Pitch Deck
              </CardTitle>
              <CardDescription>
                Share your pitch deck with potential investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Upload Deck</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onMessages}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-600" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with interested investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">View Messages</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.profileViews}</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.investorMatches}</div>
                  <div className="text-sm text-gray-600">Potential Matches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.messages}</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboardReal;
