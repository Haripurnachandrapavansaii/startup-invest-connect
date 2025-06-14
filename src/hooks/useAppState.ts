
import { useState, useEffect } from 'react';
import { AppState, User, StartupProfile, InvestorProfile } from '@/types';

const STORAGE_KEY = 'innovateX_app_state';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>({
    currentUser: null,
    currentScreen: 'login',
    startupProfile: null,
    investorProfile: null,
    tempRegistrationData: null
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setAppState(parsedState);
      } catch (error) {
        console.error('Error parsing saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const login = (email: string, password: string) => {
    // Mock login - in real app, this would validate against backend
    const mockUser: User = {
      id: '1',
      name: appState.tempRegistrationData?.fullName || 'User',
      email,
      role: appState.tempRegistrationData?.role || 'startup',
      createdAt: new Date().toISOString()
    };

    updateState({
      currentUser: mockUser,
      currentScreen: mockUser.role === 'startup' ? 'startupDashboard' : 'investorDashboard'
    });
  };

  const logout = () => {
    updateState({
      currentUser: null,
      currentScreen: 'login',
      startupProfile: null,
      investorProfile: null,
      tempRegistrationData: null
    });
  };

  const setTempRegistrationData = (data: AppState['tempRegistrationData']) => {
    updateState({ tempRegistrationData: data });
  };

  const setRole = (role: 'startup' | 'investor') => {
    updateState({
      tempRegistrationData: {
        ...appState.tempRegistrationData!,
        role
      },
      currentScreen: role === 'startup' ? 'profileSetupStartup' : 'profileSetupInvestor'
    });
  };

  const saveStartupProfile = (profile: Omit<StartupProfile, 'id' | 'userId'>) => {
    const newProfile: StartupProfile = {
      ...profile,
      id: Date.now().toString(),
      userId: appState.currentUser?.id || '1'
    };

    updateState({
      startupProfile: newProfile,
      currentScreen: 'startupDashboard'
    });
  };

  const saveInvestorProfile = (profile: Omit<InvestorProfile, 'id' | 'userId'>) => {
    const newProfile: InvestorProfile = {
      ...profile,
      id: Date.now().toString(),
      userId: appState.currentUser?.id || '1'
    };

    updateState({
      investorProfile: newProfile,
      currentScreen: 'investorDashboard'
    });
  };

  const navigateToScreen = (screen: string) => {
    updateState({ currentScreen: screen });
  };

  return {
    appState,
    login,
    logout,
    setTempRegistrationData,
    setRole,
    saveStartupProfile,
    saveInvestorProfile,
    navigateToScreen,
    updateState
  };
};
