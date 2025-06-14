
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  content_url: string | null;
  author_id: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
  };
}

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          author:profiles!resources_author_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    fetchResources
  };
};
