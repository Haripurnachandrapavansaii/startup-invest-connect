
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  FileText, 
  Calendar,
  HardDrive,
  BarChart3
} from 'lucide-react';
import { usePitchDecks } from '@/hooks/usePitchDecks';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface PitchDeckManagerProps {
  startupId: string;
  userId: string;
  isOwner?: boolean;
}

const PitchDeckManager: React.FC<PitchDeckManagerProps> = ({ 
  startupId, 
  userId, 
  isOwner = false 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    pitchDecks, 
    loading, 
    uploading, 
    uploadPitchDeck, 
    downloadPitchDeck, 
    deletePitchDeck, 
    viewPitchDeck 
  } = usePitchDecks(startupId);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or PowerPoint file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await uploadPitchDeck(selectedFile, userId);
    if (success) {
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('pitchFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section - Only show to owners */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Pitch Deck
            </CardTitle>
            <CardDescription>
              Upload your pitch deck (PDF or PowerPoint, max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pitchFile">Select File</Label>
              <Input
                id="pitchFile"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            
            {selectedFile && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFileIcon(selectedFile.type)}
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pitch Decks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pitch Decks ({pitchDecks.length})
          </CardTitle>
          <CardDescription>
            {isOwner ? 'Manage your pitch decks' : 'Available pitch decks'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading pitch decks...</p>
            </div>
          ) : pitchDecks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pitch decks uploaded yet</p>
              {isOwner && <p className="text-sm mt-1">Upload your first pitch deck above</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {pitchDecks.map((deck) => (
                <div
                  key={deck.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(deck.file_type)}
                    <div>
                      <h4 className="font-medium">{deck.file_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(deck.file_size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(deck.upload_date), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {deck.download_count} downloads
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {deck.file_type.includes('pdf') ? 'PDF' : 'PPT'}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewPitchDeck(deck)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPitchDeck(deck)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    
                    {isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePitchDeck(deck)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PitchDeckManager;
