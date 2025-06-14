
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PitchDeck {
  id: string;
  startup_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  is_active: boolean;
  download_count: number;
  last_accessed: string | null;
}

export const usePitchDecks = (startupId?: string) => {
  const [pitchDecks, setPitchDecks] = useState<PitchDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (startupId) {
      fetchPitchDecks();
    }
  }, [startupId]);

  const fetchPitchDecks = async () => {
    if (!startupId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('startup_id', startupId)
        .eq('is_active', true)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setPitchDecks(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPitchDeck = async (file: File, userId: string) => {
    if (!startupId) {
      toast({
        title: "Error",
        description: "No startup profile found",
        variant: "destructive"
      });
      return false;
    }

    setUploading(true);
    try {
      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('pitch-decks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save pitch deck record to database
      const { error: dbError } = await supabase
        .from('pitch_decks')
        .insert({
          startup_id: startupId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        });

      if (dbError) throw dbError;

      // Update startup profile with pitch deck URL
      const { data: signedUrl } = await supabase.storage
        .from('pitch-decks')
        .createSignedUrl(filePath, 86400); // 24 hours

      if (signedUrl?.signedUrl) {
        await supabase
          .from('startup_profiles')
          .update({ pitch_deck_url: signedUrl.signedUrl })
          .eq('id', startupId);
      }

      toast({
        title: "Success",
        description: "Pitch deck uploaded successfully!",
      });

      fetchPitchDecks();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const downloadPitchDeck = async (pitchDeck: PitchDeck) => {
    try {
      // Increment download count
      await supabase
        .from('pitch_decks')
        .update({ 
          download_count: pitchDeck.download_count + 1,
          last_accessed: new Date().toISOString()
        })
        .eq('id', pitchDeck.id);

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('pitch-decks')
        .createSignedUrl(pitchDeck.file_path, 3600); // 1 hour

      if (error) throw error;

      // Download file
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = pitchDeck.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      fetchPitchDecks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deletePitchDeck = async (pitchDeck: PitchDeck) => {
    try {
      // Mark as inactive instead of deleting
      const { error } = await supabase
        .from('pitch_decks')
        .update({ is_active: false })
        .eq('id', pitchDeck.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pitch deck deleted successfully",
      });

      fetchPitchDecks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const viewPitchDeck = async (pitchDeck: PitchDeck) => {
    try {
      // Update last accessed
      await supabase
        .from('pitch_decks')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', pitchDeck.id);

      // Get signed URL for viewing
      const { data, error } = await supabase.storage
        .from('pitch-decks')
        .createSignedUrl(pitchDeck.file_path, 3600); // 1 hour

      if (error) throw error;

      // Open in new tab
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    pitchDecks,
    loading,
    uploading,
    uploadPitchDeck,
    downloadPitchDeck,
    deletePitchDeck,
    viewPitchDeck,
    refetch: fetchPitchDecks
  };
};
