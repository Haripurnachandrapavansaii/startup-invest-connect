
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PitchDeckManager from '@/components/pitch/PitchDeckManager';

interface PitchDeckViewerProps {
  startupId: string;
  startupName: string;
  userId: string;
}

const PitchDeckViewer: React.FC<PitchDeckViewerProps> = ({ 
  startupId, 
  startupName, 
  userId 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{startupName} - Pitch Decks</span>
          <Badge variant="secondary">Investor View</Badge>
        </CardTitle>
        <CardDescription>
          View and download available pitch decks from {startupName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PitchDeckManager
          startupId={startupId}
          userId={userId}
          isOwner={false}
        />
      </CardContent>
    </Card>
  );
};

export default PitchDeckViewer;
