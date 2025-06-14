import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Building, DollarSign, Users } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'startup' | 'investor' | 'mentor';
  created_at: string;
}

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onMessage: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUserId, onMessage }) => {
  const isCurrentUser = user.id === currentUserId;

  const getRoleIcon = () => {
    switch (user.role) {
      case 'startup':
        return <Building className="w-4 h-4" />;
      case 'investor':
        return <DollarSign className="w-4 h-4" />;
      case 'mentor':
        return <Users className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            {user.full_name.charAt(0)}
          </div>
          
          <h3 className="font-semibold text-lg mb-1">{user.full_name}</h3>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            {getRoleIcon()}
            <span className="capitalize">{user.role}</span>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">{formatJoinDate(user.created_at)}</p>
          
          <div className="flex gap-2">
            {!isCurrentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage(user.id)}
                className="flex items-center gap-2 flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            )}
            
            {isCurrentUser && (
              <div className="text-sm text-gray-500 italic">This is you</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
