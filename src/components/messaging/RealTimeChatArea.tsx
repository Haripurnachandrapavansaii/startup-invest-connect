
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Paperclip } from 'lucide-react';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import EnhancedMessageBubble from './EnhancedMessageBubble';
import TypingIndicator from './TypingIndicator';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'startup' | 'investor' | 'mentor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface RealTimeChatAreaProps {
  selectedConversation: string | null;
  selectedUserId?: string;
  conversations: Conversation[];
  currentUserId?: string;
  currentUserName?: string;
}

const RealTimeChatArea: React.FC<RealTimeChatAreaProps> = ({
  selectedConversation,
  selectedUserId,
  conversations,
  currentUserId,
  currentUserName = 'You'
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    typingUsers,
    loading,
    sendMessage,
    markAsRead,
    sendTypingIndicator
  } = useRealTimeMessages(currentUserId, selectedConversation);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const unreadMessages = messages.filter(
        msg => !msg.read && msg.to_user_id === currentUserId
      );
      unreadMessages.forEach(msg => markAsRead(msg.id));
    }
  }, [selectedConversation, messages, currentUserId, markAsRead]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const success = await sendMessage(selectedConversation, newMessage);
      if (success) {
        setNewMessage('');
        setIsTyping(false);
        sendTypingIndicator(false, currentUserName);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Handle typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true, currentUserName);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      sendTypingIndicator(false, currentUserName);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      <Card className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 flex flex-col h-[600px]">
      {selectedConversation ? (
        <>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span>{getSelectedConversationName()}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <CardDescription className="mt-1">
                  {getSelectedConversationRole()}
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 p-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Start your conversation by sending a message below!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isFromCurrentUser = message.from_user_id === currentUserId;
                  return (
                    <EnhancedMessageBubble
                      key={message.id}
                      message={message.message}
                      timestamp={message.created_at}
                      isFromCurrentUser={isFromCurrentUser}
                      isRead={message.read}
                      isDelivered={true}
                      senderName={!isFromCurrentUser ? message.from_profile?.full_name : undefined}
                    />
                  );
                })
              )}
              
              {/* Typing Indicator */}
              <TypingIndicator typingUsers={typingUsers} />
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="resize-none"
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  disabled
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RealTimeChatArea;
