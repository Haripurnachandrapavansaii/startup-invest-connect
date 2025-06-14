
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  fromName: string;
  fromRole: 'startup' | 'investor';
  message: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: 'startup' | 'investor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface MessageInboxScreenProps {
  onBack: () => void;
}

const MessageInboxScreen: React.FC<MessageInboxScreenProps> = ({ onBack }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participantName: 'TechVentures Capital',
      participantRole: 'investor',
      lastMessage: 'We would like to schedule a meeting to discuss your startup.',
      timestamp: '2 hours ago',
      unreadCount: 2
    },
    {
      id: '2',
      participantName: 'Growth Partners',
      participantRole: 'investor',
      lastMessage: 'Thank you for sharing your pitch deck.',
      timestamp: '1 day ago',
      unreadCount: 0
    }
  ];

  // Mock messages for selected conversation
  const mockMessages: Message[] = [
    {
      id: '1',
      fromName: 'TechVentures Capital',
      fromRole: 'investor',
      message: 'Hi, we reviewed your startup profile and are interested in learning more.',
      timestamp: '2 hours ago',
      isFromCurrentUser: false
    },
    {
      id: '2',
      fromName: 'You',
      fromRole: 'startup',
      message: 'Thank you for your interest! I would be happy to share more details.',
      timestamp: '1 hour ago',
      isFromCurrentUser: true
    },
    {
      id: '3',
      fromName: 'TechVentures Capital',
      fromRole: 'investor',
      message: 'We would like to schedule a meeting to discuss your startup.',
      timestamp: '30 minutes ago',
      isFromCurrentUser: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

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
              {mockConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start connecting with investors!</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {mockConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
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
                  <CardTitle>
                    {mockConversations.find(c => c.id === selectedConversation)?.participantName}
                  </CardTitle>
                  <CardDescription>
                    {mockConversations.find(c => c.id === selectedConversation)?.participantRole}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromCurrentUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
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
