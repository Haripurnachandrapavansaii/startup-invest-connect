
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface RegisterScreenProps {
  role: 'startup' | 'investor' | 'mentor';
  onBackToRoleSelection: () => void;
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ role, onBackToRoleSelection, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleNext = () => {
    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    // Handle registration logic here
    console.log('Registration data:', { fullName, email, password, role });
  };

  const getRoleColor = () => {
    switch (role) {
      case 'startup': return 'text-green-600';
      case 'investor': return 'text-blue-600';
      case 'mentor': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" onClick={onBackToRoleSelection} size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create <span className={getRoleColor()}>{role}</span> Account
          </CardTitle>
          <CardDescription>Join the InnovateX community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleNext} className="w-full">
            Create Account
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={onSwitchToLogin}>
              Already have an account? Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;
