
import React from 'react';
import { useAppState } from '@/hooks/useAppState';
import LoginScreen from '@/components/auth/LoginScreen';
import RegisterScreen from '@/components/auth/RegisterScreen';
import RoleSelectionScreen from '@/components/auth/RoleSelectionScreen';
import ProfileSetupStartup from '@/components/profile/ProfileSetupStartup';
import ProfileSetupInvestor from '@/components/profile/ProfileSetupInvestor';
import StartupDashboard from '@/components/dashboards/StartupDashboard';
import InvestorDashboard from '@/components/dashboards/InvestorDashboard';
import MatchInvestorsScreen from '@/components/screens/MatchInvestorsScreen';
import PitchUploadScreen from '@/components/screens/PitchUploadScreen';
import MessageInboxScreen from '@/components/screens/MessageInboxScreen';

const Index = () => {
  const {
    appState,
    login,
    logout,
    setTempRegistrationData,
    setRole,
    saveStartupProfile,
    saveInvestorProfile,
    navigateToScreen
  } = useAppState();

  // Mock matched startups for investor dashboard
  const mockMatchedStartups = [
    {
      id: '1',
      startupName: 'FinFlow',
      industry: 'FinTech',
      stage: 'MVP' as const,
      tags: 'AI, Payments, B2B',
      description: 'Revolutionary payment processing platform using AI to reduce transaction costs by 40%.',
      fundingNeeded: '2 crores'
    },
    {
      id: '2',
      startupName: 'HealthAI',
      industry: 'HealthTech',
      stage: 'Revenue' as const,
      tags: 'AI, Healthcare, SaaS',
      description: 'AI-powered diagnostic platform helping doctors make faster and more accurate diagnoses.',
      fundingNeeded: '5 crores'
    }
  ];

  const handleRegistrationNext = (userData: { fullName: string; email: string; password: string }) => {
    setTempRegistrationData(userData);
    navigateToScreen('roleSelection');
  };

  const handleMessage = (targetId: string) => {
    console.log('Opening message thread with:', targetId);
    navigateToScreen('messageInbox');
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={login}
            onNavigateToRegister={() => navigateToScreen('register')}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onNext={handleRegistrationNext}
            onBackToLogin={() => navigateToScreen('login')}
          />
        );
      
      case 'roleSelection':
        return (
          <RoleSelectionScreen
            onSelectRole={setRole}
          />
        );
      
      case 'profileSetupStartup':
        return (
          <ProfileSetupStartup
            onSubmit={saveStartupProfile}
          />
        );
      
      case 'profileSetupInvestor':
        return (
          <ProfileSetupInvestor
            onSubmit={saveInvestorProfile}
          />
        );
      
      case 'startupDashboard':
        return (
          <StartupDashboard
            startupName={appState.startupProfile?.startupName || 'Startup'}
            onFindInvestors={() => navigateToScreen('matchInvestors')}
            onUploadPitch={() => navigateToScreen('pitchUpload')}
            onMessages={() => navigateToScreen('messageInbox')}
            onLogout={logout}
          />
        );
      
      case 'investorDashboard':
        return (
          <InvestorDashboard
            investorName={appState.investorProfile?.investorName || 'Investor'}
            matchedStartups={mockMatchedStartups}
            onViewProfile={(startupId) => console.log('View profile:', startupId)}
            onMessage={handleMessage}
            onLogout={logout}
          />
        );

      case 'matchInvestors':
        return (
          <MatchInvestorsScreen
            onBack={() => navigateToScreen('startupDashboard')}
            onMessage={handleMessage}
          />
        );

      case 'pitchUpload':
        return (
          <PitchUploadScreen
            onBack={() => navigateToScreen('startupDashboard')}
          />
        );

      case 'messageInbox':
        return (
          <MessageInboxScreen
            onBack={() => {
              // Navigate back to appropriate dashboard based on user role
              const userRole = appState.currentUser?.role || appState.tempRegistrationData?.role;
              if (userRole === 'startup') {
                navigateToScreen('startupDashboard');
              } else {
                navigateToScreen('investorDashboard');
              }
            }}
          />
        );
      
      default:
        return (
          <LoginScreen
            onLogin={login}
            onNavigateToRegister={() => navigateToScreen('register')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
