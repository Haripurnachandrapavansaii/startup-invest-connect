
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, Send } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (content: string, imageUrl?: string) => void;
  userRole?: 'startup' | 'investor' | 'mentor';
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  open,
  onOpenChange,
  onCreatePost,
  userRole
}) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    await onCreatePost(content, imageUrl || undefined);
    setContent('');
    setImageUrl('');
    setLoading(false);
  };

  const getPlaceholderText = () => {
    if (userRole === 'startup') {
      return "Share your startup journey, milestones, or insights...";
    } else if (userRole === 'investor') {
      return "Share investment insights, market trends, or advice...";
    } else if (userRole === 'mentor') {
      return "Share your mentorship insights, advice, or guidance...";
    }
    return "What's on your mind?";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div>
            <Label htmlFor="image">Image URL (optional)</Label>
            <div className="flex gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400 mt-3" />
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
