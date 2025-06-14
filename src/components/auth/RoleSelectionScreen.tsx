
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, TrendingUp, Users } from 'lucide-react';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: 'startup' | 'investor' | 'mentor') => void;
  loading?: boolean;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelect, loading = false }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to InnovateX</CardTitle>
          <CardDescription className="text-lg">Choose how you want to join our community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => onRoleSelect('startup')} 
            className="w-full h-20 text-lg bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <div className="flex items-center gap-3">
              <Rocket className="h-6 w-6" />
              <div className="text-center">
                <div className="font-bold">Startup</div>
                <div className="text-sm opacity-90">Looking for investment and mentorship</div>
              </div>
            </div>
          </Button>
          <Button 
            onClick={() => onRoleSelect('investor')} 
            className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6" />
              <div className="text-center">
                <div className="font-bold">Investor</div>
                <div className="text-sm opacity-90">Looking to invest in promising startups</div>
              </div>
            </div>
          </Button>
          <Button 
            onClick={() => onRoleSelect('mentor')} 
            className="w-full h-20 text-lg bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-bold">Mentor</div>
                <div className="text-sm opacity-90">Guide startups to success</div>
              </div>
            </div>
          </Button>
          {loading && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Setting up your account...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelectionScreen;
