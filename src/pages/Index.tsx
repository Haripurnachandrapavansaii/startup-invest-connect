import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAdmin } from '@/hooks/useAdmin';
import AuthScreen from '@/components/auth/AuthScreen';
import MentorLoginScreen from '@/components/auth/MentorLoginScreen';
import StartupProfileSetup from '@/components/profile/StartupProfileSetup';
import InvestorProfileSetup from '@/components/profile/InvestorProfileSetup';
import StartupDashboardReal from '@/components/dashboards/StartupDashboardReal';
import InvestorDashboardReal from '@/components/dashboards/InvestorDashboardReal';
import MentorDashboard from '@/components/dashboards/MentorDashboard';
import MatchInvestorsScreenReal from '@/components/screens/MatchInvestorsScreenReal';
import PitchUploadScreen from '@/components/screens/PitchUploadScreen';
import MessageInboxScreen from '@/components/screens/MessageInboxScreen';
import StartupProfileViewScreen from '@/components/screens/StartupProfileViewScreen';
import EventsScreen from '@/components/screens/EventsScreen';
import ResourcesScreen from '@/components/screens/ResourcesScreen';
import CommunityScreen from '@/components/screens/CommunityScreen';
import AdminScreen from '@/components/screens/AdminScreen';
import RecommendationsScreen from '@/components/screens/RecommendationsScreen';

const Index = () => {
  const { user, loading: authLoading, signOut, signIn } = useAuth();
  const { 
    profile, 
    startupProfile, 
    investorProfile, 
    loading: profileLoading, 
    saveStartupProfile, 
    saveInvestorProfile 
  } = useProfile(user?.id);

  const { isAdmin } = useAdmin(user?.id);

  const [currentScreen, setCurrentScreen] = React.useState<string>('dashboard');
  const [selectedStartupId, setSelectedStartupId] = React.useState<string>('');
  const [selectedUserId, setSelectedUserId] = React.useState<string>('');
  const [setupLoading, setSetupLoading] = React.useState(false);
  const [isMentorMode, setIsMentorMode] = React.useState(false);

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

  const handleViewProfile = (startupId: string) => {
    console.log('Viewing startup profile:', startupId);
    setSelectedStartupId(startupId);
    setCurrentScreen('viewStartupProfile');
  };

  const handleMessage = (userId: string) => {
    console.log('Opening message thread with user:', userId);
    setSelectedUserId(userId);
    setCurrentScreen('messageInbox');
  };

  const handleMentorLogin = async (credentials: { email: string; password: string }) => {
    const success = await signIn(credentials.email, credentials.password);
    if (success) {
      setIsMentorMode(true);
      setCurrentScreen('dashboard');
    }
  };

  const handleBackToMainAuth = () => {
    setIsMentorMode(false);
    setCurrentScreen('dashboard');
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
    if (currentScreen === 'mentorLogin') {
      return (
        <MentorLoginScreen
          onBack={handleBackToMainAuth}
          onLogin={handleMentorLogin}
          loading={setupLoading}
        />
      );
    }

    if (isMentorMode) {
      return (
        <MentorDashboard
          mentorName="Mentor"
          onStartups={() => setCurrentScreen('dashboard')}
          onMessages={() => setCurrentScreen('messageInbox')}
          onSchedule={() => setCurrentScreen('events')}
          onResources={() => setCurrentScreen('resources')}
          onLogout={() => {
            handleLogout();
            setIsMentorMode(false);
          }}
        />
      );
    }

    switch (currentScreen) {
      case 'recommendations':
        return (
          <RecommendationsScreen
            onBack={() => setCurrentScreen('dashboard')}
            onMessage={handleMessage}
          />
        );

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
            selectedUserId={selectedUserId}
          />
        );

      case 'viewStartupProfile':
        return (
          <StartupProfileViewScreen
            startupId={selectedStartupId}
            onBack={() => setCurrentScreen('dashboard')}
            onMessage={handleMessage}
          />
        );

      case 'events':
        return (
          <EventsScreen
            onBack={() => setCurrentScreen('dashboard')}
            currentUserId={user.id}
          />
        );

      case 'resources':
        return (
          <ResourcesScreen
            onBack={() => setCurrentScreen('dashboard')}
          />
        );

      case 'community':
        return (
          <CommunityScreen
            onBack={() => setCurrentScreen('dashboard')}
            onMessage={handleMessage}
          />
        );

      case 'admin':
        return (
          <AdminScreen
            onBack={() => setCurrentScreen('dashboard')}
            currentUserId={user.id}
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
              onEvents={() => setCurrentScreen('events')}
              onResources={() => setCurrentScreen('resources')}
              onCommunity={() => setCurrentScreen('community')}
              onAdmin={isAdmin ? () => setCurrentScreen('admin') : undefined}
              onLogout={handleLogout}
            />
          );
        } else {
          return (
            <InvestorDashboardReal
              investorName={investorProfile?.investor_name || 'Investor'}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onEvents={() => setCurrentScreen('events')}
              onResources={() => setCurrentScreen('resources')}
              onCommunity={() => setCurrentScreen('community')}
              onAdmin={isAdmin ? () => setCurrentScreen('admin') : undefined}
              onLogout={handleLogout}
            />
          );
        }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Add Mentor Login Button to Auth Screen */}
      {!user && currentScreen === 'dashboard' && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={() => setCurrentScreen('mentorLogin')}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            Mentor Login
          </Button>
        </div>
      )}
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
