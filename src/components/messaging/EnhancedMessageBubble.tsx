
import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface EnhancedMessageBubbleProps {
  message: string;
  timestamp: string;
  isFromCurrentUser: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
  senderName?: string;
}

const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({
  message,
  timestamp,
  isFromCurrentUser,
  isRead = false,
  isDelivered = true,
  senderName
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (!isFromCurrentUser) return null;
    
    if (isRead) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    } else if (isDelivered) {
      return <Check className="w-3 h-3 text-gray-400" />;
    } else {
      return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
          isFromCurrentUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        {!isFromCurrentUser && senderName && (
          <p className="text-xs font-medium text-gray-600 mb-1">{senderName}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">{formatTime(timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;
