
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Link, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PitchUploadScreenProps {
  onBack: () => void;
}

const PitchUploadScreen: React.FC<PitchUploadScreenProps> = ({ onBack }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [pitchUrl, setPitchUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        toast({
          title: "Success!",
          description: "Pitch deck uploaded successfully",
        });
      }, 2000);
    }
  };

  const handleUrlSubmit = () => {
    if (!pitchUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      toast({
        title: "Success!",
        description: "Pitch deck URL saved successfully",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Upload Pitch Deck</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Pitch Deck</CardTitle>
            <CardDescription>
              Upload your pitch deck file or provide a link to share with investors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadSuccess ? (
              <div className="text-center py-8">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pitch Deck Uploaded!</h3>
                <p className="text-gray-600 mb-4">Your pitch deck is now available to investors</p>
                <Button onClick={onBack}>Back to Dashboard</Button>
              </div>
            ) : (
              <>
                <div className="flex gap-4 mb-6">
                  <Button
                    variant={uploadMethod === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('file')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant={uploadMethod === 'link' ? 'default' : 'outline'}
                    onClick={() => setUploadMethod('link')}
                    className="flex-1"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                </div>

                {uploadMethod === 'file' ? (
                  <div className="space-y-4">
                    <Label htmlFor="pitchFile">Upload Pitch Deck (PDF, PPT, PPTX)</Label>
                    <Input
                      id="pitchFile"
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <p className="text-sm text-gray-500">
                      Maximum file size: 10MB. Supported formats: PDF, PowerPoint
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="pitchUrl">Pitch Deck URL</Label>
                    <Input
                      id="pitchUrl"
                      placeholder="https://drive.google.com/... or https://docsend.com/..."
                      value={pitchUrl}
                      onChange={(e) => setPitchUrl(e.target.value)}
                      disabled={isUploading}
                    />
                    <p className="text-sm text-gray-500">
                      Share a link to your pitch deck from Google Drive, DocSend, or other platforms
                    </p>
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={isUploading || !pitchUrl}
                      className="w-full"
                    >
                      {isUploading ? 'Saving...' : 'Save Pitch Deck URL'}
                    </Button>
                  </div>
                )}

                {isUploading && uploadMethod === 'file' && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Uploading your pitch deck...</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PitchUploadScreen;
