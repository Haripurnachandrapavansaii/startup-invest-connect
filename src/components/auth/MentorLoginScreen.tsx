
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Users } from 'lucide-react';

interface MentorLoginScreenProps {
  onBackToRoleSelection: () => void;
}

const MentorLoginScreen = ({ onBackToRoleSelection }: MentorLoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setLoading(true);
    const success = await signIn(email, password);
    setLoading(false);
    
    // If successful, the user will be redirected automatically by the auth state change
    console.log('Mentor login attempt completed:', success);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" onClick={onBackToRoleSelection} size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="mx-auto mb-2 p-2 bg-purple-100 rounded-full w-fit">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back, Mentor</CardTitle>
              <CardDescription>Sign in to access your mentor dashboard</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mentor@example.com"
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In as Mentor'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Don't have a mentor account? 
              <Button variant="link" onClick={onBackToRoleSelection} className="text-purple-600 p-0 ml-1" disabled={loading}>
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorLoginScreen;
