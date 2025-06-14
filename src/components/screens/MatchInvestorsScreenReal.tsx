
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InvestorProfile {
  id: string;
  user_id: string;
  investor_name: string;
  investment_range_min: string;
  investment_range_max: string;
  sectors_interested: string;
  preferred_stages: string[];
  contact_email: string;
}

interface MatchInvestorsScreenRealProps {
  onBack: () => void;
  onMessage: (investorUserId: string) => void;
}

const MatchInvestorsScreenReal: React.FC<MatchInvestorsScreenRealProps> = ({ onBack, onMessage }) => {
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestors(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <div className="text-lg">Loading investors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Available Investors ({investors.length})</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investors.map((investor) => (
            <Card key={investor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{investor.investor_name}</CardTitle>
                <CardDescription>
                  Investment Range: {investor.investment_range_min} - {investor.investment_range_max}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investor.sectors_interested && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Sectors Interested:</h4>
                      <p className="text-sm text-gray-600">{investor.sectors_interested}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Preferred Stages:</h4>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {investor.preferred_stages?.map(stage => (
                        <span key={stage} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {stage}
                        </span>
                      )) || <span className="text-xs text-gray-500">Not specified</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Contact:</h4>
                    <p className="text-sm text-gray-600">{investor.contact_email}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => onMessage(investor.user_id)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      disabled
                    >
                      <Eye className="w-3 h-3" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {investors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No investors found yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later as more investors join the platform!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchInvestorsScreenReal;
