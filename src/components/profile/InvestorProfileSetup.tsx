
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface InvestorProfileData {
  investor_name: string;
  investment_range_min: string;
  investment_range_max: string;
  sectors_interested: string;
  preferred_stages: string[];
  contact_email: string;
}

interface InvestorProfileSetupProps {
  onSubmit: (profile: InvestorProfileData) => void;
  loading?: boolean;
}

const InvestorProfileSetup: React.FC<InvestorProfileSetupProps> = ({ onSubmit, loading = false }) => {
  const [profile, setProfile] = useState<InvestorProfileData>({
    investor_name: '',
    investment_range_min: '',
    investment_range_max: '',
    sectors_interested: '',
    preferred_stages: [],
    contact_email: ''
  });

  const handleSubmit = () => {
    if (!profile.investor_name || !profile.investment_range_min || !profile.investment_range_max || !profile.contact_email) {
      return;
    }
    onSubmit(profile);
  };

  const updateProfile = (field: keyof InvestorProfileData, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStageToggle = (stage: string, checked: boolean) => {
    const newStages = checked
      ? [...profile.preferred_stages, stage]
      : profile.preferred_stages.filter(s => s !== stage);
    updateProfile('preferred_stages', newStages);
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
              value={profile.investor_name}
              onChange={(e) => updateProfile('investor_name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minRange">Min Investment (₹) *</Label>
              <Input
                id="minRange"
                placeholder="e.g., 10 lakhs"
                value={profile.investment_range_min}
                onChange={(e) => updateProfile('investment_range_min', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRange">Max Investment (₹) *</Label>
              <Input
                id="maxRange"
                placeholder="e.g., 5 crores"
                value={profile.investment_range_max}
                onChange={(e) => updateProfile('investment_range_max', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectors">Sectors Interested</Label>
            <Input
              id="sectors"
              placeholder="FinTech, HealthTech, EdTech (comma separated)"
              value={profile.sectors_interested}
              onChange={(e) => updateProfile('sectors_interested', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Startup Stages</Label>
            <div className="flex gap-4">
              {['Idea', 'MVP', 'Revenue'].map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox
                    id={stage}
                    checked={profile.preferred_stages.includes(stage)}
                    onCheckedChange={(checked) => handleStageToggle(stage, checked as boolean)}
                  />
                  <Label htmlFor={stage}>{stage}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="Enter contact email"
              value={profile.contact_email}
              onChange={(e) => updateProfile('contact_email', e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorProfileSetup;
