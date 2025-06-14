
import React from 'react';

interface TypingIndicatorProps {
  typingUsers: Array<{
    userId: string;
    userName: string;
    isTyping: boolean;
  }>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const typingUserNames = typingUsers.map(user => user.userName);
  const displayText = typingUserNames.length === 1 
    ? `${typingUserNames[0]} is typing...`
    : `${typingUserNames.join(', ')} are typing...`;

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-gray-500 text-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{displayText}</span>
    </div>
  );
};

export default TypingIndicator;
