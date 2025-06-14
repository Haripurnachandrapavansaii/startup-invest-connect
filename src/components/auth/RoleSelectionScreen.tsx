
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'startup' | 'investor') => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Select Your Role</CardTitle>
          <CardDescription>Choose how you want to use InnovateX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => onSelectRole('startup')} 
            className="w-full h-20 text-lg bg-green-600 hover:bg-green-700"
          >
            <div className="text-center">
              <div className="font-bold">Startup</div>
              <div className="text-sm opacity-90">Looking for investment</div>
            </div>
          </Button>
          <Button 
            onClick={() => onSelectRole('investor')} 
            className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700"
          >
            <div className="text-center">
              <div className="font-bold">Investor</div>
              <div className="text-sm opacity-90">Looking to invest in startups</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionScreen;
