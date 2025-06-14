
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PitchDeckManager from '@/components/pitch/PitchDeckManager';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface PitchUploadScreenProps {
  onBack: () => void;
}

const PitchUploadScreen: React.FC<PitchUploadScreenProps> = ({ onBack }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { startupProfile } = useProfile(userId || '');

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  if (!userId || !startupProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Pitch Deck Management</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">Loading...</div>
            </CardContent>
          </Card>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Pitch Deck Management</h1>
        </div>

        <PitchDeckManager
          startupId={startupProfile.id}
          userId={userId}
          isOwner={true}
        />
      </div>
    </div>
  );
};

export default PitchUploadScreen;
