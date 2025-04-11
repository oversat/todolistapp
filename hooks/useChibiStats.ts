import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChibiStats {
  id: string;
  deadlineHearts: number;
  noteHearts: number;
  last_fed: Date;
  health: number;
  energy: number;
}

interface Task {
  id: string;
  notes?: string;
  due_date?: string;
  completed: boolean;
}

export function useChibiStats(chibiId: string) {
  const [stats, setStats] = useState<ChibiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Simplified heart calculation - just check for non-empty content
  const calculateHearts = (tasks: Task[]) => {
    const tasksWithDeadlines = tasks.filter(task => 
      task.due_date && 
      !task.completed && 
      new Date(task.due_date) > new Date()
    ).length;
    
    const tasksWithNotes = tasks.filter(task => 
      task.notes && 
      task.notes.trim() !== '' && 
      !task.completed
    ).length;
    
    return {
      deadlineHearts: Math.min(tasksWithDeadlines, 4),
      noteHearts: Math.min(tasksWithNotes, 4)
    };
  };

  // Update stats immediately based on task changes
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      const { deadlineHearts, noteHearts } = calculateHearts(newTasks);
      setStats(prev => prev ? {
        ...prev,
        deadlineHearts,
        noteHearts
      } : null);
      
      return newTasks;
    });
  };

  // Fetch stats function
  const fetchStats = async () => {
    try {
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('chibi_id', chibiId)
        .eq('completed', false);

      if (tasksError) throw tasksError;

      setTasks(tasks || []);
      const { deadlineHearts, noteHearts } = calculateHearts(tasks || []);

      setStats({
        id: chibiId,
        deadlineHearts,
        noteHearts,
        last_fed: new Date(),
        health: 50, // Default health value
        energy: 50  // Default energy value
      });
    } catch (error) {
      console.error('Error fetching chibi stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (chibiId) {
      fetchStats();
    }
  }, [chibiId]);

  // Subscribe to task changes
  useEffect(() => {
    if (!chibiId) return;

    const channel = supabase
      .channel(`tasks_${chibiId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `chibi_id=eq.${chibiId}`
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [...prev, payload.new as Task]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? { ...task, ...payload.new } : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }

          // Recalculate hearts after any change
          const { deadlineHearts, noteHearts } = calculateHearts(tasks);
          setStats(prev => prev ? {
            ...prev,
            deadlineHearts,
            noteHearts
          } : null);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chibiId, tasks]);

  return { stats, loading, updateTask };
} 