
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, MessageCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StartupProfile {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  tags: string;
  description: string;
  funding_needed: string;
}

interface InvestorDashboardRealProps {
  investorName: string;
  onViewProfile: (startupId: string) => void;
  onMessage: (startupId: string) => void;
  onLogout: () => void;
}

const InvestorDashboardReal: React.FC<InvestorDashboardRealProps> = ({
  investorName,
  onViewProfile,
  onMessage,
  onLogout
}) => {
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
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
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {investorName}!</h1>
            <p className="text-gray-600">Discover promising startups</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Startups ({startups.length})</h2>
          
          {startups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No startups found yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Check back later as more startups join the platform!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
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
                    {startup.tags && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {startup.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {tag.trim()}
                            </span>
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
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onMessage(startup.id)}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardReal;
