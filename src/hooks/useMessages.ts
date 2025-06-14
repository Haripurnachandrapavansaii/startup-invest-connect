
import { useState, useEffect } from 'react';
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

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'startup' | 'investor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export const useMessages = (currentUserId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!currentUserId) return;
    
    try {
      // Get all messages where user is sender or receiver
      const { data: allMessages, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(full_name, role),
          to_profile:profiles!messages_to_user_id_fkey(full_name, role)
        `)
        .or(`from_user_id.eq.${currentUserId},to_user_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      allMessages?.forEach((message: any) => {
        const isFromCurrentUser = message.from_user_id === currentUserId;
        const partnerId = isFromCurrentUser ? message.to_user_id : message.from_user_id;
        const partnerProfile = isFromCurrentUser ? message.to_profile : message.from_profile;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            participantId: partnerId,
            participantName: partnerProfile?.full_name || 'Unknown User',
            participantRole: partnerProfile?.role as 'startup' | 'investor' || 'startup',
            lastMessage: message.message,
            timestamp: new Date(message.created_at).toLocaleString(),
            unreadCount: 0
          });
        }
        
        // Count unread messages from partner
        if (!isFromCurrentUser && !message.read) {
          const conv = conversationMap.get(partnerId)!;
          conv.unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(full_name, role)
        `)
        .or(`and(from_user_id.eq.${currentUserId},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('from_user_id', otherUserId)
        .eq('to_user_id', currentUserId);
        
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error", 
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async (toUserId: string, messageText: string, subject?: string) => {
    if (!currentUserId || !messageText.trim()) return false;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: currentUserId,
          to_user_id: toUserId,
          message: messageText.trim(),
          subject: subject || null
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Message sent successfully"
      });
      
      // Refresh messages and conversations
      await fetchMessages(toUserId);
      await fetchConversations();
      
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  return {
    conversations,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};
