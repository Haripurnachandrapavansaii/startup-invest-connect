
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';

interface EventsScreenProps {
  onBack: () => void;
  currentUserId: string;
}

const EventsScreen = ({ onBack, currentUserId }: EventsScreenProps) => {
  const { events, loading, registerForEvent, unregisterFromEvent } = useEvents(currentUserId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'networking':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      case 'meetup':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  const handleEventAction = async (eventId: string, isRegistered: boolean) => {
    if (isRegistered) {
      await unregisterFromEvent(eventId);
    } else {
      await registerForEvent(eventId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600">Check back later for upcoming startup and business events.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getEventTypeColor(event.event_type)}>
                      {event.event_type}
                    </Badge>
                    {isEventPast(event.event_date) && (
                      <Badge variant="secondary">Past Event</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {formatDate(event.event_date)}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.registered_count || 0} registered
                    {event.max_attendees && ` / ${event.max_attendees} max`}
                  </div>
                  
                  {event.organizer && (
                    <div className="text-sm text-gray-600">
                      Organized by: {event.organizer.full_name}
                    </div>
                  )}

                  {!isEventPast(event.event_date) && event.registration_required && (
                    <Button 
                      onClick={() => handleEventAction(event.id, event.is_registered || false)}
                      variant={event.is_registered ? "outline" : "default"}
                      className="w-full"
                      disabled={event.max_attendees && (event.registered_count || 0) >= event.max_attendees && !event.is_registered}
                    >
                      {event.is_registered ? 'Unregister' : 'Register'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsScreen;
