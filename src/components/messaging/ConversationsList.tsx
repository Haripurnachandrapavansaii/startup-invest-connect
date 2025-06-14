
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import ConversationItem from './ConversationItem';
import NewConversationItem from './NewConversationItem';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'startup' | 'investor' | 'mentor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedUserId?: string;
  selectedConversation: string | null;
  onConversationSelect: (userId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  selectedUserId,
  selectedConversation,
  onConversationSelect
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Conversations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {conversations.length === 0 && !selectedUserId ? (
          <div className="p-6 text-center text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start connecting with other users!</p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Show new conversation if selectedUserId is provided */}
            {selectedUserId && !conversations.find(c => c.participantId === selectedUserId) && (
              <NewConversationItem
                userId={selectedUserId}
                isSelected={selectedConversation === selectedUserId}
                onClick={() => onConversationSelect(selectedUserId)}
              />
            )}
            
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                participantId={conversation.participantId}
                participantName={conversation.participantName}
                participantRole={conversation.participantRole}
                lastMessage={conversation.lastMessage}
                timestamp={conversation.timestamp}
                unreadCount={conversation.unreadCount}
                isSelected={selectedConversation === conversation.participantId}
                onClick={() => onConversationSelect(conversation.participantId)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
