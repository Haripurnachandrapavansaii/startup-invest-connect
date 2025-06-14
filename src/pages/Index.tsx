
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAdmin } from '@/hooks/useAdmin';
import AuthScreen from '@/components/auth/AuthScreen';
import LandingPage from '@/components/landing/LandingPage';
import StartupProfileSetup from '@/components/profile/StartupProfileSetup';
import InvestorProfileSetup from '@/components/profile/InvestorProfileSetup';
import MentorProfileSetup from '@/components/profile/MentorProfileSetup';
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
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    profile, 
    startupProfile, 
    investorProfile, 
    mentorProfile,
    loading: profileLoading, 
    saveStartupProfile, 
    saveInvestorProfile,
    saveMentorProfile,
    refetch: refetchProfile
  } = useProfile(user?.id);

  const { isAdmin } = useAdmin(user?.id);

  const [currentScreen, setCurrentScreen] = React.useState<string>('dashboard');
  const [selectedStartupId, setSelectedStartupId] = React.useState<string>('');
  const [selectedUserId, setSelectedUserId] = React.useState<string>('');
  const [setupLoading, setSetupLoading] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);

  const handleStartupProfileSubmit = async (profileData: any) => {
    setSetupLoading(true);
    const success = await saveStartupProfile(profileData);
    if (success) {
      await refetchProfile();
      setCurrentScreen('dashboard');
    }
    setSetupLoading(false);
  };

  const handleInvestorProfileSubmit = async (profileData: any) => {
    setSetupLoading(true);
    const success = await saveInvestorProfile(profileData);
    if (success) {
      await refetchProfile();
      setCurrentScreen('dashboard');
    }
    setSetupLoading(false);
  };

  const handleMentorProfileSubmit = async (profileData: any) => {
    setSetupLoading(true);
    const success = await saveMentorProfile(profileData);
    if (success) {
      await refetchProfile();
      setCurrentScreen('dashboard');
    }
    setSetupLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('dashboard');
    setShowAuth(false);
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setShowAuth(false);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show auth screen if user clicked get started
  if (showAuth && !user) {
    return <AuthScreen onBack={handleBackToLanding} />;
  }

  // Show landing page if user is not logged in
  if (!user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show loading while profile is being fetched
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Setting up your profile...</div>
      </div>
    );
  }

  // If profile doesn't exist, something went wrong - show auth screen
  if (!profile) {
    return <AuthScreen />;
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

  if (profile.role === 'mentor' && !mentorProfile && currentScreen === 'dashboard') {
    return (
      <MentorProfileSetup 
        onSubmit={handleMentorProfileSubmit}
        loading={setupLoading}
      />
    );
  }

  const renderCurrentScreen = () => {
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
              startupName={startupProfile?.startup_name || profile.full_name || 'Startup'}
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
        } else if (profile.role === 'investor') {
          return (
            <InvestorDashboardReal
              investorName={investorProfile?.investor_name || profile.full_name || 'Investor'}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onEvents={() => setCurrentScreen('events')}
              onResources={() => setCurrentScreen('resources')}
              onCommunity={() => setCurrentScreen('community')}
              onRecommendations={() => setCurrentScreen('recommendations')}
              onAdmin={isAdmin ? () => setCurrentScreen('admin') : undefined}
              onLogout={handleLogout}
            />
          );
        } else if (profile.role === 'mentor') {
          return (
            <MentorDashboard
              mentorName={mentorProfile?.mentor_name || profile.full_name || 'Mentor'}
              onStartups={() => setCurrentScreen('dashboard')}
              onMessages={() => setCurrentScreen('messageInbox')}
              onSchedule={() => setCurrentScreen('events')}
              onResources={() => setCurrentScreen('resources')}
              onCommunity={() => setCurrentScreen('community')}
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
