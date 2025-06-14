
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthScreen from '@/components/auth/AuthScreen';
import StartupProfileSetup from '@/components/profile/StartupProfileSetup';
import InvestorProfileSetup from '@/components/profile/InvestorProfileSetup';
import StartupDashboardReal from '@/components/dashboards/StartupDashboardReal';
import InvestorDashboardReal from '@/components/dashboards/InvestorDashboardReal';
import MatchInvestorsScreenReal from '@/components/screens/MatchInvestorsScreenReal';
import PitchUploadScreen from '@/components/screens/PitchUploadScreen';
import MessageInboxScreen from '@/components/screens/MessageInboxScreen';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    profile, 
    startupProfile, 
    investorProfile, 
    loading: profileLoading, 
    saveStartupProfile, 
    saveInvestorProfile 
  } = useProfile(user?.id);

  const [currentScreen, setCurrentScreen] = React.useState<string>('dashboard');
  const [setupLoading, setSetupLoading] = React.useState(false);

  const handleStartupProfileSubmit = async (profileData: any) => {
    setSetupLoading(true);
    const success = await saveStartupProfile(profileData);
    if (success) {
      setCurrentScreen('dashboard');
    }
    setSetupLoading(false);
  };

  const handleInvestorProfileSubmit = async (profileData: any) => {
    setSetupLoading(true);
    const success = await saveInvestorProfile(profileData);
    if (success) {
      setCurrentScreen('dashboard');
    }
    setSetupLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('dashboard');
  };

  const handleMessage = (targetId: string) => {
    console.log('Opening message thread with:', targetId);
    setCurrentScreen('messageInbox');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Setting up your profile...</div>
      </div>
    );
  }

  // Check if user needs to complete profile setup
  if (profile.role === 'startup' && !startupProfile && currentScreen === 'dashboard') {
    return (
      <StartupProfileSetup 
        onSubmit={handleStartupProfileSubmit}
        loading={setupLoading}
      />
    );
  }

  if (profile.role === 'investor' && !investorProfile && currentScreen === 'dashboard') {
    return (
      <InvestorProfileSetup 
        onSubmit={handleInvestorProfileSubmit}
        loading={setupLoading}
      />
    );
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'matchInvestors':
        return (
          <MatchInvestorsScreenReal
            onBack={() => setCurrentScreen('dashboard')}
            onMessage={handleMessage}
          />
        );

      case 'pitchUpload':
        return (
          <PitchUploadScreen
            onBack={() => setCurrentScreen('dashboard')}
          />
        );

      case 'messageInbox':
        return (
          <MessageInboxScreen
            onBack={() => setCurrentScreen('dashboard')}
          />
        );

      default:
        if (profile.role === 'startup') {
          return (
            <StartupDashboardReal
              startupName={startupProfile?.startup_name || 'Startup'}
              onFindInvestors={() => setCurrentScreen('matchInvestors')}
              onUploadPitch={() => setCurrentScreen('pitchUpload')}
              onMessages={() => setCurrentScreen('messageInbox')}
              onLogout={handleLogout}
            />
          );
        } else {
          return (
            <InvestorDashboardReal
              investorName={investorProfile?.investor_name || 'Investor'}
              onViewProfile={(startupId) => console.log('View profile:', startupId)}
              onMessage={handleMessage}
              onLogout={handleLogout}
            />
          );
        }
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
