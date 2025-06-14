
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'startup' | 'investor';
  createdAt: string;
}

export interface StartupProfile {
  id: string;
  userId: string;
  startupName: string;
  industry: string;
  stage: 'Idea' | 'MVP' | 'Revenue';
  website?: string;
  description: string;
  tags: string;
  fundingNeeded: string;
  pitchDeckURL?: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  investorName: string;
  investmentRangeMin: string;
  investmentRangeMax: string;
  sectorsInterested: string;
  preferredStages: string[];
  contactEmail: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: string;
}

export interface AppState {
  currentUser: User | null;
  currentScreen: string;
  startupProfile: StartupProfile | null;
  investorProfile: InvestorProfile | null;
  tempRegistrationData: {
    fullName: string;
    email: string;
    password: string;
    role?: 'startup' | 'investor';
  } | null;
}
