import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TaskAnalytics {
  completed: number;
  pending: number;
  completionRate: number;
  byDate: Record<string, number>;
}

export function useTaskAnalytics(chibiId: string) {
  const [analytics, setAnalytics] = useState<TaskAnalytics>({
    completed: 0,
    pending: 0,
    completionRate: 0,
    byDate: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('completed, completed_at, created_at')
          .eq('chibi_id', chibiId);

        if (error) throw error;

        const completed = data.filter(task => task.completed).length;
        const pending = data.filter(task => !task.completed).length;
        const completionRate = data.length ? (completed / data.length) * 100 : 0;

        // Group tasks by date
        const byDate = data.reduce((acc, task) => {
          const date = new Date(task.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setAnalytics({
          completed,
          pending,
          completionRate,
          byDate
        });
      } catch (error) {
        console.error('Error fetching task analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Subscribe to task changes
    const subscription = supabase
      .channel(`task_analytics_${chibiId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `chibi_id=eq.${chibiId}`
        },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chibiId]);

  return { analytics, loading };
} 