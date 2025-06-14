
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageSquare, TrendingUp, Calendar, BookOpen, Settings, LogOut, Users } from 'lucide-react';

interface InvestorDashboardRealProps {
  investorName: string;
  onViewProfile: (startupId: string) => void;
  onMessage: (userId: string) => void;
  onEvents: () => void;
  onResources: () => void;
  onAdmin?: () => void;
  onLogout: () => void;
}

const InvestorDashboardReal = ({ 
  investorName, 
  onViewProfile, 
  onMessage,
  onEvents,
  onResources,
  onAdmin,
  onLogout 
}: InvestorDashboardRealProps) => {
  // Mock startup data for demo
  const featuredStartups = [
    {
      id: '1',
      name: 'TechFlow',
      industry: 'SaaS',
      stage: 'Series A',
      description: 'AI-powered workflow automation platform'
    },
    {
      id: '2', 
      name: 'GreenEnergy Solutions',
      industry: 'CleanTech',
      stage: 'Seed',
      description: 'Renewable energy management system'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {investorName}!</h1>
            <p className="text-gray-600 mt-2">Discover promising startups and investment opportunities</p>
          </div>
          <div className="flex gap-2">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Browse Startups
              </CardTitle>
              <CardDescription>
                Explore startups looking for investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Browsing
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onMessage('')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with startup founders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Messages
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
                Attend startup events and demo days
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
                Investment guides and market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Network
              </CardTitle>
              <CardDescription>
                Connect with other investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Featured Startups</CardTitle>
              <CardDescription>Promising startups seeking investment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredStartups.map((startup) => (
                <div key={startup.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{startup.name}</h4>
                    <p className="text-sm text-gray-600">{startup.industry} • {startup.stage}</p>
                    <p className="text-xs text-gray-500">{startup.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onViewProfile(startup.id)}>
                      View
                    </Button>
                    <Button size="sm" onClick={() => onMessage(startup.id)}>
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Diversify your startup portfolio across different industries</li>
                <li>• Look for strong founding teams with relevant experience</li>
                <li>• Attend networking events to discover new opportunities</li>
                <li>• Review pitch decks and financial projections carefully</li>
                <li>• Consider the market size and growth potential</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardReal;
