
import React from 'react';

interface NewConversationItemProps {
  userId: string;
  isSelected: boolean;
  onClick: () => void;
}

const NewConversationItem: React.FC<NewConversationItemProps> = ({
  userId,
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
        <h4 className="font-medium text-sm">New Conversation</h4>
        <span className="bg-green-600 text-white rounded-full px-2 py-1 text-xs">
          New
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-1">
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          User ID: {userId.slice(0, 8)}...
        </span>
      </p>
      <p className="text-sm text-gray-600 truncate">Start a new conversation</p>
      <p className="text-xs text-gray-400 mt-1">Just now</p>
    </div>
  );
};

export default NewConversationItem;
