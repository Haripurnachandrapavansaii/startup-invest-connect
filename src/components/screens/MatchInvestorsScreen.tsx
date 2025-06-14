
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Eye } from 'lucide-react';

interface MatchInvestorsScreenProps {
  onBack: () => void;
  onMessage: (investorId: string) => void;
}

const MatchInvestorsScreen: React.FC<MatchInvestorsScreenProps> = ({ onBack, onMessage }) => {
  // Mock investor data - in real app this would come from database
  const mockInvestors = [
    {
      id: '1',
      investorName: 'TechVentures Capital',
      investmentRange: '1-5 crores',
      sectorsInterested: 'FinTech, AI, SaaS',
      preferredStages: ['MVP', 'Revenue'],
      matchReason: 'Interested in FinTech startups at MVP stage'
    },
    {
      id: '2',
      investorName: 'Growth Partners',
      investmentRange: '50 lakhs - 2 crores',
      sectorsInterested: 'HealthTech, EdTech, B2B',
      preferredStages: ['Idea', 'MVP'],
      matchReason: 'Looking for early-stage health solutions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Matched Investors ({mockInvestors.length})</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockInvestors.map((investor) => (
            <Card key={investor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{investor.investorName}</CardTitle>
                <CardDescription>
                  Investment Range: {investor.investmentRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Sectors Interested:</h4>
                    <p className="text-sm text-gray-600">{investor.sectorsInterested}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Preferred Stages:</h4>
                    <div className="flex gap-2 mt-1">
                      {investor.preferredStages.map(stage => (
                        <span key={stage} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Why matched:</h4>
                    <p className="text-sm text-gray-600">{investor.matchReason}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => onMessage(investor.id)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
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

        {mockInvestors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No matching investors found yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete your profile and check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchInvestorsScreen;
