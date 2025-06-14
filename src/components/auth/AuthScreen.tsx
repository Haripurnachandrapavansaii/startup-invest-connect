import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Users, TrendingUp, UserCircle } from 'lucide-react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import RoleSelectionScreen from './RoleSelectionScreen';
import MentorLoginScreen from './MentorLoginScreen';
import { useAuth } from '@/hooks/useAuth';

const AuthScreen = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'roleSelection' | 'mentorLogin'>('landing');
  const [loading, setLoading] = useState(false);
  const [tempUserData, setTempUserData] = useState<{ fullName: string; email: string; password: string } | null>(null);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const success = await signIn(email, password);
    if (success) {
      setCurrentView('landing');
    }
    setLoading(false);
  };

  const handleRegister = async (userData: { fullName: string; email: string; password: string }) => {
    setTempUserData(userData);
    setCurrentView('roleSelection');
  };

  const handleRoleSelection = async (role: 'startup' | 'investor') => {
    if (!tempUserData) return;
    
    setLoading(true);
    const success = await signUp(tempUserData.email, tempUserData.password, tempUserData.fullName, role);
    if (success) {
      setCurrentView('landing');
    }
    setLoading(false);
  };

  const handleMentorLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    const success = await signIn(credentials.email, credentials.password);
    if (success) {
      setCurrentView('landing');
    }
    setLoading(false);
  };

  if (currentView === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentView('register')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterScreen
        onNext={handleRegister}
        onBackToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'roleSelection') {
    return (
      <RoleSelectionScreen
        onSelectRole={handleRoleSelection}
      />
    );
  }

  if (currentView === 'mentorLogin') {
    return (
      <MentorLoginScreen
        onBack={() => setCurrentView('landing')}
        onLogin={handleMentorLogin}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mentor Login Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          onClick={() => setCurrentView('mentorLogin')}
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2"
        >
          <UserCircle className="h-4 w-4" />
          Mentor Login
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect <span className="text-blue-600">Startups</span> with <span className="text-purple-600">Investors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform for entrepreneurs to showcase their ideas and for investors to discover the next big opportunity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('register')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentView('login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Rocket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>For Startups</CardTitle>
              <CardDescription>
                Showcase your startup, upload pitch decks, and connect with potential investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Upload and share pitch decks</li>
                <li>• Match with relevant investors</li>
                <li>• Get funding opportunities</li>
                <li>• Access mentorship programs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>For Investors</CardTitle>
              <CardDescription>
                Discover promising startups and connect with innovative entrepreneurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Browse curated startups</li>
                <li>• View detailed pitch decks</li>
                <li>• Direct messaging system</li>
                <li>• Investment tracking tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>For Mentors</CardTitle>
              <CardDescription>
                Guide startups on their journey to success and share your expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Mentor promising startups</li>
                <li>• Share industry expertise</li>
                <li>• Build your network</li>
                <li>• Make a difference</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join thousands of entrepreneurs and investors already using our platform</p>
          <Button 
            size="lg" 
            onClick={() => setCurrentView('register')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
