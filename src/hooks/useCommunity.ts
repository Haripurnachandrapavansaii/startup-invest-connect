
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    role: string;
  };
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  created_at: string;
  author?: {
    full_name: string;
    role: string;
  };
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'startup' | 'investor' | 'mentor';
  created_at: string;
}

export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:profiles!community_posts_author_id_fkey(full_name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to include counts and user interaction status
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post: any) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('community_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Check if current user liked the post
          const { data: userLike } = await supabase
            .from('community_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .single();

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_liked: !!userLike
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter and cast users to ensure they have valid roles
      const validUsers = (data || []).filter(user => 
        user.role === 'startup' || user.role === 'investor'
      ) as User[];
      
      setUsers(validUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_posts')
        .insert({
          content,
          image_url: imageUrl || null,
          author_id: user.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully"
      });

      await fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('community_likes')
          .insert({
            post_id: postId,
            user_id: user.user.id
          });

        if (error) throw error;
      }

      await fetchPosts();
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_comments')
        .insert({
          content,
          post_id: postId,
          author_id: user.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully"
      });

      await fetchPosts();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    posts,
    users,
    loading,
    createPost,
    likePost,
    addComment,
    fetchPosts,
    fetchUsers
  };
};
