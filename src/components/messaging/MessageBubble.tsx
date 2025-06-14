
import React from 'react';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isFromCurrentUser
}) => {
  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isFromCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-sm">{message}</p>
        <p className={`text-xs mt-1 ${
          isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
