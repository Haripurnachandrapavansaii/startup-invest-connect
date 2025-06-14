
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, MessageSquare, Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Pitch {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  description: string;
  pitch_deck_url?: string;
  user_id: string;
}

interface RecommendationsScreenProps {
  onBack: () => void;
  onMessage: (userId: string) => void;
}

const RecommendationsScreen = ({ onBack, onMessage }: RecommendationsScreenProps) => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .not('pitch_deck_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPitches(data || []);
    } catch (error) {
      console.error('Error fetching pitches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPitch = (pitchUrl: string) => {
    window.open(pitchUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pitch Recommendations</h1>
            <p className="text-gray-600 mt-2">Discover promising startups and their pitch decks</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        ) : pitches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No pitch decks available yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later as startups upload their pitch decks!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pitches.map((pitch) => (
              <Card key={pitch.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{pitch.startup_name}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {pitch.stage}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {pitch.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {pitch.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    {pitch.pitch_deck_url && (
                      <Button
                        onClick={() => handleViewPitch(pitch.pitch_deck_url!)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Pitch Deck
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => onMessage(pitch.user_id)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact Startup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsScreen;
