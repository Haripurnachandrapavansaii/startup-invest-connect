
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ConversationsList from '@/components/messaging/ConversationsList';
import RealTimeChatArea from '@/components/messaging/RealTimeChatArea';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'startup' | 'investor' | 'mentor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface MessageInboxScreenProps {
  onBack: () => void;
  selectedUserId?: string;
}

const MessageInboxScreen: React.FC<MessageInboxScreenProps> = ({ onBack, selectedUserId }) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
      setupConversationsRealTime();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedUserId) {
      setSelectedConversation(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      // Get all messages where user is either sender or receiver
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(full_name, role),
          to_profile:profiles!messages_to_user_id_fkey(full_name, role)
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();

      messagesData?.forEach((message) => {
        const isFromCurrentUser = message.from_user_id === user.id;
        const partnerId = isFromCurrentUser ? message.to_user_id : message.from_user_id;
        const partnerProfile = isFromCurrentUser ? message.to_profile : message.from_profile;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: `${user.id}-${partnerId}`,
            participantId: partnerId,
            participantName: partnerProfile?.full_name || 'Unknown User',
            participantRole: partnerProfile?.role as 'startup' | 'investor' | 'mentor' || 'startup',
            lastMessage: message.message,
            timestamp: new Date(message.created_at).toLocaleString(),
            unreadCount: 0
          });
        } else {
          // Update with latest message if this is more recent
          const existing = conversationMap.get(partnerId)!;
          if (new Date(message.created_at) > new Date(existing.timestamp.replace(/,/g, ''))) {
            existing.lastMessage = message.message;
            existing.timestamp = new Date(message.created_at).toLocaleString();
          }
        }
      });

      // Count unread messages for each conversation
      for (const [partnerId, conversation] of conversationMap) {
        const { data: unreadData, error: unreadError } = await supabase
          .from('messages')
          .select('id')
          .eq('from_user_id', partnerId)
          .eq('to_user_id', user.id)
          .eq('read', false);

        if (!unreadError) {
          conversation.unreadCount = unreadData?.length || 0;
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupConversationsRealTime = () => {
    if (!user?.id) return;

    // Listen for new messages to update conversations list
    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only update if this user is involved in the message
          if (newMessage.from_user_id === user.id || newMessage.to_user_id === user.id) {
            // Refresh conversations to get updated list
            fetchConversations();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          
          // Only update if this user is involved in the message
          if (updatedMessage.from_user_id === user.id || updatedMessage.to_user_id === user.id) {
            // Refresh conversations to get updated unread counts
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <ConversationsList
            conversations={conversations}
            selectedUserId={selectedUserId}
            selectedConversation={selectedConversation}
            onConversationSelect={setSelectedConversation}
          />
          
          <RealTimeChatArea
            selectedConversation={selectedConversation}
            selectedUserId={selectedUserId}
            conversations={conversations}
            currentUserId={user?.id}
            currentUserName={profile?.full_name || 'You'}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInboxScreen;
