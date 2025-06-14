
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Eye, 
  Send,
  LogOut,
  DollarSign,
  Calendar
} from 'lucide-react';

interface StartupProfile {
  id: string;
  user_id: string;
  startup_name: string;
  industry: string;
  stage: string;
  website: string | null;
  description: string;
  tags: string | null;
  funding_needed: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface InvestorDashboardRealProps {
  investorName: string;
  onViewProfile: (startupId: string) => void;
  onMessage: (userId: string) => void;
  onLogout: () => void;
}

const InvestorDashboardReal: React.FC<InvestorDashboardRealProps> = ({
  investorName,
  onViewProfile,
  onMessage,
  onLogout
}) => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10);

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {investorName}
            </h1>
            <p className="text-gray-600">Discover promising startups to invest in</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Startups</p>
                  <p className="text-2xl font-bold">{startups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Stage</p>
                  <p className="text-2xl font-bold">{startups.filter(s => s.stage === 'Revenue').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">MVP Stage</p>
                  <p className="text-2xl font-bold">{startups.filter(s => s.stage === 'MVP').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Idea Stage</p>
                  <p className="text-2xl font-bold">{startups.filter(s => s.stage === 'Idea').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Startup Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Available Startups
            </CardTitle>
            <CardDescription>
              Browse and connect with promising startups looking for investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{startup.startup_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{startup.industry}</Badge>
                          <Badge variant="outline">{startup.stage}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {startup.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Funding Needed:</span>
                        <span>{startup.funding_needed}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Listed:</span>
                        <span>{new Date(startup.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {startup.tags && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {startup.tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewProfile(startup.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => onMessage(startup.user_id)}
                        className="flex items-center gap-1"
                      >
                        <Send className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {startups.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No startups available at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorDashboardReal;
