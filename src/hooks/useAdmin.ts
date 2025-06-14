
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminStats {
  totalUsers: number;
  totalStartups: number;
  totalInvestors: number;
  totalEvents: number;
  totalResources: number;
}

export const useAdmin = (currentUserId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStartups: 0,
    totalInvestors: 0,
    totalEvents: 0,
    totalResources: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchStats = async () => {
    if (!isAdmin) return;

    try {
      const [usersResult, startupsResult, investorsResult, eventsResult, resourcesResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('startup_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('investor_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalStartups: startupsResult.count || 0,
        totalInvestors: investorsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalResources: resourcesResult.count || 0
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error",
        description: "Failed to load admin statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description: string;
    event_date: string;
    location: string;
    event_type: string;
    max_attendees?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organizer_id: currentUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully!"
      });
      return true;
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
      return false;
    }
  };

  const createResource = async (resourceData: {
    title: string;
    description: string;
    resource_type: string;
    content_url?: string;
    tags?: string[];
  }) => {
    try {
      const { error } = await supabase
        .from('resources')
        .insert({
          ...resourceData,
          author_id: currentUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource created successfully!"
      });
      return true;
    } catch (error: any) {
      console.error('Error creating resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create resource",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (currentUserId) {
      checkAdminStatus();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  return {
    isAdmin,
    stats,
    loading,
    createEvent,
    createResource,
    fetchStats
  };
};
