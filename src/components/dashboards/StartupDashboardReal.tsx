import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MessageSquare, Upload, Users, Calendar, BookOpen, Settings, LogOut, Star } from 'lucide-react';
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

const StartupDashboardReal = ({ 
  startupName, 
  onFindInvestors, 
  onUploadPitch, 
  onMessages,
  onEvents,
  onResources,
  onCommunity,
  onAdmin,
  onLogout 
}: StartupDashboardRealProps) => {
  // Sample notifications for demo
  const sampleNotifications = [
    {
      id: '1',
      title: 'Investor Interest',
      message: 'BlueVenture Capital viewed your profile',
      type: 'success' as const,
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '2',
      title: 'Event Reminder',
      message: 'Startup Pitch Night tomorrow at 6 PM',
      type: 'info' as const,
      timestamp: '3 hours ago',
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {startupName}!</h1>
            <p className="text-gray-600 mt-2">Ready to take your startup to the next level?</p>
          </div>
          <div className="flex gap-2">
            <NotificationButton notifications={sampleNotifications} />
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onFindInvestors}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Find Investors
              </CardTitle>
              <CardDescription>
                Connect with investors who match your startup's needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Matching
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onUploadPitch}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                Upload Pitch Deck
              </CardTitle>
              <CardDescription>
                Share your pitch deck with potential investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Upload Deck
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
                View and respond to investor messages
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
                Discover upcoming startup events and networking opportunities
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
                Access helpful guides, tools, and articles for startups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Resources
              </Button>
            </CardContent>
          </Card>

          {/* Community Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onCommunity}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-gray-600">Connect with others</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Join the community to share updates, network, and engage with other startups and investors.
              </p>
              <Button className="w-full" onClick={onCommunity}>
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Make sure your pitch deck is up to date before reaching out to investors</li>
                <li>• Attend networking events to build relationships in the startup ecosystem</li>
                <li>• Use our resources section to learn about funding strategies</li>
                <li>• Respond promptly to investor messages to maintain engagement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboardReal;
