
import React from 'react';

interface ConversationItemProps {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'startup' | 'investor' | 'mentor';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  participantName,
  participantRole,
  lastMessage,
  timestamp,
  unreadCount,
  isSelected,
  onClick
}) => {
  return (
    <div
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium text-sm">{participantName}</h4>
        {unreadCount > 0 && (
          <span className="bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
            {unreadCount}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-1">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          {participantRole}
        </span>
      </p>
      <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
    </div>
  );
};

export default ConversationItem;
