import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChibiStats {
  id: string;
  happiness: number;
  energy: number;
  last_fed: Date;
  tasks_completed: number;
}

export function useChibiStats(chibiId: string) {
  const [stats, setStats] = useState<ChibiStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('chibis')
          .select('happiness, energy, last_fed')
          .eq('id', chibiId)
          .single();

        if (error) throw error;

        setStats({
          id: chibiId,
          happiness: data.happiness,
          energy: data.energy,
          last_fed: new Date(data.last_fed),
          tasks_completed: 0 // We'll calculate this separately
        });
      } catch (error) {
        console.error('Error fetching chibi stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [chibiId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel(`chibi_stats_${chibiId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chibis',
          filter: `id=eq.${chibiId}`
        },
        (payload) => {
          setStats(prev => ({
            ...prev!,
            happiness: payload.new.happiness,
            energy: payload.new.energy,
            last_fed: new Date(payload.new.last_fed)
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chibiId]);

  return { stats, loading };
} 