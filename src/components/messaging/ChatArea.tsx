
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';

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
  participantRole: 'startup' | 'investor' | 'mentor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ChatAreaProps {
  selectedConversation: string | null;
  selectedUserId?: string;
  conversations: Conversation[];
  messages: Message[];
  currentUserId?: string;
  onSendMessage: (toUserId: string, message: string) => Promise<boolean>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  selectedUserId,
  conversations,
  messages,
  currentUserId,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const success = await onSendMessage(selectedConversation, newMessage);
      if (success) {
        setNewMessage('');
      }
    }
  };

  const getSelectedConversationName = () => {
    if (selectedConversation === selectedUserId) {
      return 'New Conversation';
    }
    const conversation = conversations.find(c => c.participantId === selectedConversation);
    return conversation?.participantName || 'Unknown User';
  };

  const getSelectedConversationRole = () => {
    if (selectedConversation === selectedUserId) {
      return `User ID: ${selectedUserId}`;
    }
    const conversation = conversations.find(c => c.participantId === selectedConversation);
    return conversation?.participantRole || 'unknown';
  };

  return (
    <Card className="lg:col-span-2">
      {selectedConversation ? (
        <>
          <CardHeader>
            <CardTitle>{getSelectedConversationName()}</CardTitle>
            <CardDescription>{getSelectedConversationRole()}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Start your conversation by sending a message below!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isFromCurrentUser = message.from_user_id === currentUserId;
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message.message}
                      timestamp={new Date(message.created_at).toLocaleString()}
                      isFromCurrentUser={isFromCurrentUser}
                    />
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select a conversation to start messaging</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ChatArea;
