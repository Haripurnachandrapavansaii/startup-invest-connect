
import React, { useState } from 'react';
import RoleSelectionScreen from './RoleSelectionScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import MentorLoginScreen from './MentorLoginScreen';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthScreenProps {
  onBack?: () => void;
}

const AuthScreen = ({ onBack }: AuthScreenProps) => {
  const [currentView, setCurrentView] = useState<'roleSelection' | 'register' | 'login' | 'mentorLogin'>('roleSelection');
  const [selectedRole, setSelectedRole] = useState<'startup' | 'investor' | 'mentor' | null>(null);

  const handleRoleSelect = (role: 'startup' | 'investor' | 'mentor') => {
    setSelectedRole(role);
    if (role === 'mentor') {
      setCurrentView('mentorLogin');
    } else {
      setCurrentView('register');
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentView('roleSelection');
    setSelectedRole(null);
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <RegisterScreen
            role={selectedRole!}
            onBackToRoleSelection={handleBackToRoleSelection}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onBackToRoleSelection={handleBackToRoleSelection}
            onSwitchToRegister={handleSwitchToRegister}
          />
        );
      case 'mentorLogin':
        return (
          <MentorLoginScreen
            onBackToRoleSelection={handleBackToRoleSelection}
          />
        );
      default:
        return (
          <RoleSelectionScreen onRoleSelect={handleRoleSelect} />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {onBack && currentView === 'roleSelection' && (
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      )}
      {renderCurrentView()}
    </div>
  );
};

export default AuthScreen;
