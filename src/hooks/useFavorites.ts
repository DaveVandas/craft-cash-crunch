import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Celebrity } from '@/lib/types';
import { toast } from 'sonner';

export interface ProfileFavorite {
  type: 'profile';
  celebrity: Celebrity;
}

export interface ComparisonFavorite {
  type: 'comparison';
  person1: Celebrity;
  person2: Celebrity;
}

export type FavoriteContent = ProfileFavorite | ComparisonFavorite;

export interface Favorite {
  id: string;
  favorite_type: 'profile' | 'comparison';
  content: FavoriteContent;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFavorites(data?.map(f => ({
        id: f.id,
        favorite_type: f.favorite_type as 'profile' | 'comparison',
        content: f.content as unknown as FavoriteContent,
        created_at: f.created_at
      })) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (content: FavoriteContent) => {
    if (!user) {
      toast.error('Sign in to save favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          favorite_type: content.type,
          content: JSON.parse(JSON.stringify(content))
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.info('Already in favorites');
          return false;
        }
        throw error;
      }

      toast.success('Added to favorites ❤️');
      fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeFavorite = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Removed from favorites');
      setFavorites(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isFavorited = useCallback((content: FavoriteContent): string | null => {
    const match = favorites.find(f => {
      if (f.favorite_type !== content.type) return false;
      
      if (content.type === 'profile') {
        const fContent = f.content as ProfileFavorite;
        return fContent.celebrity.name === content.celebrity.name;
      }
      
      if (content.type === 'comparison') {
        const fContent = f.content as ComparisonFavorite;
        const cContent = content as ComparisonFavorite;
        // Check both orderings
        return (
          (fContent.person1.name === cContent.person1.name && fContent.person2.name === cContent.person2.name) ||
          (fContent.person1.name === cContent.person2.name && fContent.person2.name === cContent.person1.name)
        );
      }
      
      return false;
    });
    
    return match?.id || null;
  }, [favorites]);

  const toggleFavorite = async (content: FavoriteContent) => {
    const existingId = isFavorited(content);
    if (existingId) {
      return removeFavorite(existingId);
    } else {
      return addFavorite(content);
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,
    refetch: fetchFavorites
  };
};
