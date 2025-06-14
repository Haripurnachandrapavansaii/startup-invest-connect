
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: string;
  organizer_id: string | null;
  max_attendees: number | null;
  registration_required: boolean | null;
  created_at: string;
  updated_at: string;
  organizer?: {
    full_name: string;
  };
  registered_count?: number;
  is_registered?: boolean;
}

export const useEvents = (currentUserId: string | undefined) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Get registration counts and user registration status
      const eventsWithDetails = await Promise.all(
        (eventsData || []).map(async (event) => {
          // Get registration count
          const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          // Check if current user is registered
          let isRegistered = false;
          if (currentUserId) {
            const { data: registration } = await supabase
              .from('event_registrations')
              .select('id')
              .eq('event_id', event.id)
              .eq('user_id', currentUserId)
              .maybeSingle();
            
            isRegistered = !!registration;
          }

          return {
            ...event,
            registered_count: count || 0,
            is_registered: isRegistered
          };
        })
      );

      setEvents(eventsWithDetails);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!currentUserId) return false;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: currentUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully registered for event!"
      });

      await fetchEvents(); // Refresh events
      return true;
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive"
      });
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!currentUserId) return false;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully unregistered from event"
      });

      await fetchEvents(); // Refresh events
      return true;
    } catch (error: any) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unregister from event",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUserId]);

  return {
    events,
    loading,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent
  };
};
