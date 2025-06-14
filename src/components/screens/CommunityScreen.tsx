
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, MessageCircle, Heart, Share2, Send, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/hooks/useCommunity';
import { useProfile } from '@/hooks/useProfile';
import PostCard from '@/components/community/PostCard';
import UserCard from '@/components/community/UserCard';
import CreatePostDialog from '@/components/community/CreatePostDialog';

interface CommunityScreenProps {
  onBack: () => void;
  onMessage: (userId: string) => void;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onBack, onMessage }) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { posts, users, loading, createPost, likePost, addComment } = useCommunity();
  const [activeTab, setActiveTab] = useState<'feed' | 'people'>('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'startup' | 'investor'>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (user?.id) {
      await createPost(content, imageUrl);
      setShowCreatePost(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div>Loading community...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'feed' ? 'default' : 'outline'}
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Feed
            </Button>
            <Button
              variant={activeTab === 'people' ? 'default' : 'outline'}
              onClick={() => setActiveTab('people')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              People
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - User Profile */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <h3 className="font-semibold">{profile?.full_name}</h3>
                <p className="text-sm text-gray-600 capitalize">{profile?.role}</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p>Posts: {posts.filter(p => p.author_id === user?.id).length}</p>
                    <p>Connections: {users.length - 1}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </div>
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-gray-500"
                        onClick={() => setShowCreatePost(true)}
                      >
                        What's on your mind?
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={user?.id}
                      onLike={(postId) => likePost(postId)}
                      onComment={(postId, comment) => addComment(postId, comment)}
                      onMessage={(userId) => onMessage(userId)}
                    />
                  ))}
                  
                  {posts.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                        <p className="text-gray-500">Be the first to share something with the community!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'people' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          placeholder="Search people..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as 'all' | 'startup' | 'investor')}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">All Roles</option>
                        <option value="startup">Startups</option>
                        <option value="investor">Investors</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* People Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map((person) => (
                    <UserCard
                      key={person.id}
                      user={person}
                      currentUserId={user?.id}
                      onMessage={(userId) => onMessage(userId)}
                    />
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <Card className="md:col-span-2">
                      <CardContent className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No people found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Post Dialog */}
        <CreatePostDialog
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
          onCreatePost={handleCreatePost}
          userRole={profile?.role}
        />
      </div>
    </div>
  );
};

export default CommunityScreen;
