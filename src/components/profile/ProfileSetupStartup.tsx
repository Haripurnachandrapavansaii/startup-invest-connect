
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface StartupProfile {
  startupName: string;
  industry: string;
  stage: string;
  website: string;
  description: string;
  tags: string;
  fundingNeeded: string;
}

interface ProfileSetupStartupProps {
  onSubmit: (profile: StartupProfile) => void;
}

const ProfileSetupStartup: React.FC<ProfileSetupStartupProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<StartupProfile>({
    startupName: '',
    industry: '',
    stage: 'Idea',
    website: '',
    description: '',
    tags: '',
    fundingNeeded: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!profile.startupName || !profile.industry || !profile.description || !profile.fundingNeeded) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    onSubmit(profile);
  };

  const updateProfile = (field: keyof StartupProfile, value: string) => {
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
                value={profile.startupName}
                onChange={(e) => updateProfile('startupName', e.target.value)}
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
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={profile.stage}
                onChange={(e) => updateProfile('stage', e.target.value)}
              >
                <option value="Idea">Idea</option>
                <option value="MVP">MVP</option>
                <option value="Revenue">Revenue</option>
              </select>
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
                value={profile.fundingNeeded}
                onChange={(e) => updateProfile('fundingNeeded', e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Submit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupStartup;
