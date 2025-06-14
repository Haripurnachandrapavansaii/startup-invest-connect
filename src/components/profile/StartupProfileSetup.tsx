
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StartupProfileData {
  startup_name: string;
  industry: string;
  stage: 'Idea' | 'MVP' | 'Revenue';
  website: string;
  description: string;
  tags: string;
  funding_needed: string;
}

interface StartupProfileSetupProps {
  onSubmit: (profile: StartupProfileData) => void;
  loading?: boolean;
}

const StartupProfileSetup: React.FC<StartupProfileSetupProps> = ({ onSubmit, loading = false }) => {
  const [profile, setProfile] = useState<StartupProfileData>({
    startup_name: '',
    industry: '',
    stage: 'Idea',
    website: '',
    description: '',
    tags: '',
    funding_needed: ''
  });

  const handleSubmit = () => {
    if (!profile.startup_name || !profile.industry || !profile.description || !profile.funding_needed) {
      return;
    }
    onSubmit(profile);
  };

  const updateProfile = (field: keyof StartupProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Setup Your Startup Profile</CardTitle>
          <CardDescription>Tell investors about your startup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name *</Label>
              <Input
                id="startupName"
                placeholder="Enter startup name"
                value={profile.startup_name}
                onChange={(e) => updateProfile('startup_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                placeholder="e.g., FinTech, HealthTech"
                value={profile.industry}
                onChange={(e) => updateProfile('industry', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select value={profile.stage} onValueChange={(value: 'Idea' | 'MVP' | 'Revenue') => updateProfile('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Idea">Idea</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={profile.website}
                onChange={(e) => updateProfile('website', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your startup, what problem you solve, and your solution"
              value={profile.description}
              onChange={(e) => updateProfile('description', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="AI, SaaS, B2B (comma separated)"
                value={profile.tags}
                onChange={(e) => updateProfile('tags', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fundingNeeded">Funding Needed (₹) *</Label>
              <Input
                id="fundingNeeded"
                placeholder="e.g., 50 lakhs, 2 crores"
                value={profile.funding_needed}
                onChange={(e) => updateProfile('funding_needed', e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupProfileSetup;
