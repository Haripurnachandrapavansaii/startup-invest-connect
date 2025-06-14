
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Globe, DollarSign, Building, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StartupProfile {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  website?: string;
  description: string;
  tags?: string;
  funding_needed: string;
  pitch_deck_url?: string;
  user_id: string;
}

interface StartupProfileViewScreenProps {
  startupId: string;
  onBack: () => void;
  onMessage: (userId: string) => void;
}

const StartupProfileViewScreen: React.FC<StartupProfileViewScreenProps> = ({ 
  startupId, 
  onBack, 
  onMessage 
}) => {
  const [startup, setStartup] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartup();
  }, [startupId]);

  const fetchStartup = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('id', startupId)
        .single();

      if (error) throw error;
      setStartup(data);
    } catch (error) {
      console.error('Error fetching startup:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div>Loading startup profile...</div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div>Startup profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{startup.startup_name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{startup.startup_name}</CardTitle>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {startup.stage}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {startup.industry}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{startup.description}</p>
                </div>

                {startup.tags && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {startup.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Funding Needed
                  </h3>
                  <p className="text-gray-600">{startup.funding_needed}</p>
                </div>

                {startup.website && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </h3>
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {startup.website}
                    </a>
                  </div>
                )}

                {startup.pitch_deck_url && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pitch Deck</h3>
                    <a
                      href={startup.pitch_deck_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Pitch Deck
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
                <CardDescription>
                  Interested in this startup? Send them a message!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => onMessage(startup.user_id)}
                  className="w-full flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfileViewScreen;
