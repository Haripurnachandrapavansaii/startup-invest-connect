
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  author_id: string;
  created_at: string;
  author?: {
    full_name: string;
    role: string;
  };
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onMessage: (userId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onMessage
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.author?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="font-semibold">{post.author?.full_name || 'Unknown User'}</h4>
              <p className="text-sm text-gray-600 capitalize">
                {post.author?.role} • {formatDate(post.created_at)}
              </p>
            </div>
          </div>
          {post.author_id !== currentUserId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(post.author_id)}
            >
              Message
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
        
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full max-h-96 object-cover rounded-lg mb-4"
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 ${post.user_liked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`w-4 h-4 ${post.user_liked ? 'fill-current' : ''}`} />
            {post.likes_count}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600"
          >
            <MessageCircle className="w-4 h-4" />
            {post.comments_count}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button size="sm" onClick={handleComment} disabled={!newComment.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
