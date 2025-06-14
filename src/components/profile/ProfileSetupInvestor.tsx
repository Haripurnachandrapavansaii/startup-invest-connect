
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface InvestorProfile {
  investorName: string;
  investmentRangeMin: string;
  investmentRangeMax: string;
  sectorsInterested: string;
  preferredStages: string[];
  contactEmail: string;
}

interface ProfileSetupInvestorProps {
  onSubmit: (profile: InvestorProfile) => void;
}

const ProfileSetupInvestor: React.FC<ProfileSetupInvestorProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<InvestorProfile>({
    investorName: '',
    investmentRangeMin: '',
    investmentRangeMax: '',
    sectorsInterested: '',
    preferredStages: [],
    contactEmail: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!profile.investorName || !profile.investmentRangeMin || !profile.investmentRangeMax || !profile.contactEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    onSubmit(profile);
  };

  const updateProfile = (field: keyof InvestorProfile, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStageToggle = (stage: string) => {
    const newStages = profile.preferredStages.includes(stage)
      ? profile.preferredStages.filter(s => s !== stage)
      : [...profile.preferredStages, stage];
    updateProfile('preferredStages', newStages);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Setup Your Investor Profile</CardTitle>
          <CardDescription>Connect with promising startups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investorName">Investor/Firm Name *</Label>
            <Input
              id="investorName"
              placeholder="Enter investor or firm name"
              value={profile.investorName}
              onChange={(e) => updateProfile('investorName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minRange">Min Investment (₹) *</Label>
              <Input
                id="minRange"
                placeholder="e.g., 10 lakhs"
                value={profile.investmentRangeMin}
                onChange={(e) => updateProfile('investmentRangeMin', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRange">Max Investment (₹) *</Label>
              <Input
                id="maxRange"
                placeholder="e.g., 5 crores"
                value={profile.investmentRangeMax}
                onChange={(e) => updateProfile('investmentRangeMax', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectors">Sectors Interested</Label>
            <Input
              id="sectors"
              placeholder="FinTech, HealthTech, EdTech (comma separated)"
              value={profile.sectorsInterested}
              onChange={(e) => updateProfile('sectorsInterested', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Startup Stages</Label>
            <div className="flex gap-4">
              {['Idea', 'MVP', 'Revenue'].map(stage => (
                <label key={stage} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferredStages.includes(stage)}
                    onChange={() => handleStageToggle(stage)}
                    className="rounded"
                  />
                  <span>{stage}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="Enter contact email"
              value={profile.contactEmail}
              onChange={(e) => updateProfile('contactEmail', e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Submit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupInvestor;
