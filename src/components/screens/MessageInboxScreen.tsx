
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';

interface MessageInboxScreenProps {
  onBack: () => void;
  selectedUserId?: string;
}

const MessageInboxScreen: React.FC<MessageInboxScreenProps> = ({ onBack, selectedUserId }) => {
  const { user } = useAuth();
  const { conversations, messages, loading, fetchMessages, sendMessage } = useMessages(user?.id);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedUserId || null);
  const [newMessage, setNewMessage] = useState('');

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

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const success = await sendMessage(selectedConversation, newMessage);
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
          {/* Conversations List */}
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
                  <p className="text-sm mt-1">Start connecting with {user?.id && conversations.length === 0 ? 'other users' : 'investors'}!</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {/* Show new conversation if selectedUserId is provided */}
                  {selectedUserId && !conversations.find(c => c.participantId === selectedUserId) && (
                    <div
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === selectedUserId ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleConversationSelect(selectedUserId)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">New Conversation</h4>
                        <span className="bg-green-600 text-white rounded-full px-2 py-1 text-xs">
                          New
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          User ID: {selectedUserId.slice(0, 8)}...
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 truncate">Start a new conversation</p>
                      <p className="text-xs text-gray-400 mt-1">Just now</p>
                    </div>
                  )}
                  
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.participantId ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleConversationSelect(conversation.participantId)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{conversation.participantName}</h4>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {conversation.participantRole}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
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
                        const isFromCurrentUser = message.from_user_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isFromCurrentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
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
        </div>
      </div>
    </div>
  );
};

export default MessageInboxScreen;
