
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X, Check, Mail, Archive } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

interface NotificationButtonProps {
  notifications?: Notification[];
}

const NotificationButton = ({ notifications = [] }: NotificationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications);
  const [activeTab, setActiveTab] = useState('unread');

  const unreadNotifications = notificationList.filter(n => !n.read);
  const readNotifications = notificationList.filter(n => n.read);
  const unreadCount = unreadNotifications.length;

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAsUnread = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const clearAllRead = () => {
    setNotificationList(prev => prev.filter(n => !n.read));
  };

  const renderNotifications = (notifications: Notification[]) => (
    notifications.length === 0 ? (
      <div className="p-4 text-center text-gray-500">
        {activeTab === 'unread' ? 'No new notifications' : 'No read notifications'}
      </div>
    ) : (
      notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${
            !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notification.id)}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
              <p className="text-xs text-gray-400">{notification.timestamp}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                className="h-6 w-6 p-0"
                title={notification.read ? 'Mark as unread' : 'Mark as read'}
              >
                {notification.read ? (
                  <Mail className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearNotification(notification.id)}
                className="h-6 w-6 p-0"
                title="Remove notification"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))
    )
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-6"
                  >
                    Mark all read
                  </Button>
                )}
                {readNotifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllRead}
                    className="text-xs h-6 text-red-600 hover:text-red-700"
                    title="Clear all read notifications"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mx-3 mb-2">
                <TabsTrigger value="unread" className="text-xs">
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="read" className="text-xs">
                  Read ({readNotifications.length})
                </TabsTrigger>
              </TabsList>
              <div className="max-h-80 overflow-y-auto">
                <TabsContent value="unread" className="m-0">
                  {renderNotifications(unreadNotifications)}
                </TabsContent>
                <TabsContent value="read" className="m-0">
                  {renderNotifications(readNotifications)}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
