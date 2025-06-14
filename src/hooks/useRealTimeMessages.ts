
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  subject: string | null;
  read: boolean;
  created_at: string;
  from_profile?: {
    full_name: string;
    role: string;
  };
}

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export const useRealTimeMessages = (currentUserId?: string, selectedConversation?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<any>();

  useEffect(() => {
    if (!currentUserId || !selectedConversation) return;

    fetchMessages();
    setupRealTimeSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentUserId, selectedConversation]);

  const fetchMessages = async () => {
    if (!currentUserId || !selectedConversation) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(full_name, role)
        `)
        .or(`and(from_user_id.eq.${currentUserId},to_user_id.eq.${selectedConversation}),and(from_user_id.eq.${selectedConversation},to_user_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    if (!currentUserId || !selectedConversation) return;

    // Create a unique channel for this conversation
    const conversationId = [currentUserId, selectedConversation].sort().join('-');
    
    channelRef.current = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(from_user_id.eq.${currentUserId},to_user_id.eq.${selectedConversation}),and(from_user_id.eq.${selectedConversation},to_user_id.eq.${currentUserId}))`
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data: newMessage, error } = await supabase
            .from('messages')
            .select(`
              *,
              from_profile:profiles!messages_from_user_id_fkey(full_name, role)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newMessage) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channelRef.current.presenceState();
        const typing = Object.keys(state).map(userId => ({
          userId,
          userName: state[userId][0]?.userName || 'Unknown',
          isTyping: state[userId][0]?.isTyping || false
        })).filter(user => user.userId !== currentUserId && user.isTyping);
        
        setTypingUsers(typing);
      })
      .subscribe();
  };

  const sendMessage = async (toUserId: string, message: string): Promise<boolean> => {
    if (!currentUserId || !message.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          from_user_id: currentUserId,
          to_user_id: toUserId,
          message: message.trim(),
          read: false
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('to_user_id', currentUserId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendTypingIndicator = (isTyping: boolean, userName: string) => {
    if (!channelRef.current || !currentUserId) return;

    if (isTyping) {
      channelRef.current.track({
        userId: currentUserId,
        userName,
        isTyping: true
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current.track({
          userId: currentUserId,
          userName,
          isTyping: false
        });
      }, 3000);
    } else {
      channelRef.current.track({
        userId: currentUserId,
        userName,
        isTyping: false
      });
    }
  };

  return {
    messages,
    typingUsers,
    loading,
    sendMessage,
    markAsRead,
    sendTypingIndicator,
    refetch: fetchMessages
  };
};
