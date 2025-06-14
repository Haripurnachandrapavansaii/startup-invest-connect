
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import ConversationsList from '@/components/messaging/ConversationsList';
import ChatArea from '@/components/messaging/ChatArea';

interface MessageInboxScreenProps {
  onBack: () => void;
  selectedUserId?: string;
}

const MessageInboxScreen: React.FC<MessageInboxScreenProps> = ({ onBack, selectedUserId }) => {
  const { user } = useAuth();
  const { conversations, messages, loading, fetchMessages, sendMessage } = useMessages(user?.id);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedUserId || null);

  useEffect(() => {
    if (selectedUserId && selectedConversation !== selectedUserId) {
      setSelectedConversation(selectedUserId);
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, selectedConversation, fetchMessages]);

  const handleConversationSelect = (userId: string) => {
    setSelectedConversation(userId);
    fetchMessages(userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <div>Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <ConversationsList
            conversations={conversations}
            selectedUserId={selectedUserId}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />

          <ChatArea
            selectedConversation={selectedConversation}
            selectedUserId={selectedUserId}
            conversations={conversations}
            messages={messages}
            currentUserId={user?.id}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInboxScreen;
