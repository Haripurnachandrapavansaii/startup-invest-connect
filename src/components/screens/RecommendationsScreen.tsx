
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, MessageSquare, Download, ExternalLink, Users, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Startup {
  id: string;
  startup_name: string;
  industry: string;
  stage: string;
  description: string;
  pitch_deck_url?: string;
  user_id: string;
}

interface Person {
  id: string;
  full_name: string;
  email: string;
  role: string;
  startup_name?: string;
  investor_name?: string;
  industry?: string;
  sectors_interested?: string;
}

interface RecommendationsScreenProps {
  onBack: () => void;
  onMessage: (userId: string) => void;
}

const RecommendationsScreen = ({ onBack, onMessage }: RecommendationsScreenProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pitches' | 'people'>('pitches');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch startups with pitch decks
      const { data: startupsData, error: startupsError } = await supabase
        .from('startup_profiles')
        .select('*')
        .not('pitch_deck_url', 'is', null)
        .order('created_at', { ascending: false });

      if (startupsError) throw startupsError;
      setStartups(startupsData || []);

      // Fetch people (profiles with additional info)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          startup_profiles (startup_name, industry),
          investor_profiles (investor_name, sectors_interested)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (profilesError) throw profilesError;
      
      const peopleWithDetails = profilesData?.map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        startup_name: profile.startup_profiles?.[0]?.startup_name,
        investor_name: profile.investor_profiles?.[0]?.investor_name,
        industry: profile.startup_profiles?.[0]?.industry,
        sectors_interested: profile.investor_profiles?.[0]?.sectors_interested
      })) || [];

      setPeople(peopleWithDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Recommendations</h1>
            <p className="text-gray-600 mt-2">Discover promising startups and connect with people</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'pitches' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pitches')}
            className="flex items-center gap-2"
          >
            <Building className="h-4 w-4" />
            Pitch Decks ({startups.length})
          </Button>
          <Button
            variant={activeTab === 'people' ? 'default' : 'outline'}
            onClick={() => setActiveTab('people')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            People ({people.length})
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        ) : (
          <>
            {/* Pitch Decks Tab */}
            {activeTab === 'pitches' && (
              startups.length === 0 ? (
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
                          {startup.industry}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {startup.description}
                        </p>
                        <div className="flex flex-col gap-2">
                          {startup.pitch_deck_url && (
                            <Button
                              onClick={() => handleViewPitch(startup.pitch_deck_url!)}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Pitch Deck
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => onMessage(startup.user_id)}
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
              )
            )}

            {/* People Tab */}
            {activeTab === 'people' && (
              people.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-600">No people found yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check back later as more people join the platform!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {people.map((person) => (
                    <Card key={person.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{person.full_name}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            person.role === 'startup' ? 'bg-green-100 text-green-800' : 
                            person.role === 'investor' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {person.role}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          {person.role === 'startup' && person.startup_name && (
                            <span>{person.startup_name} • {person.industry}</span>
                          )}
                          {person.role === 'investor' && person.investor_name && (
                            <span>{person.investor_name}</span>
                          )}
                          {person.role === 'mentor' && (
                            <span>Mentor</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {person.role === 'investor' && person.sectors_interested && (
                          <p className="text-sm text-gray-600 mb-4">
                            Interested in: {person.sectors_interested}
                          </p>
                        )}
                        <Button
                          onClick={() => onMessage(person.id)}
                          className="w-full flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationsScreen;
