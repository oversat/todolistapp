import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChibiStats {
  id: string;
  deadlineHearts: number;
  noteHearts: number;
  last_fed: Date;
  health: number;
  energy: number;
  hunger: number;
}

interface Task {
  id: string;
  notes?: string;
  due_date?: string;
  completed: boolean;
  energy?: number;
  hunger?: number;
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
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      // If task is completed, update chibi stats
      if (updates.completed) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const newEnergy = Math.min(100, (stats?.energy || 0) + (task.energy || 0));
          const newHunger = Math.min(100, (stats?.hunger || 0) + (task.hunger || 0));
          
          await updateChibiStats({
            energy: newEnergy,
            hunger: newHunger
          });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
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

      // Fetch chibi stats including hunger
      const { data: chibiData, error: chibiError } = await supabase
        .from('chibis')
        .select('energy, hunger')
        .eq('id', chibiId)
        .single();

      if (chibiError) throw chibiError;

      setStats({
        id: chibiId,
        deadlineHearts,
        noteHearts,
        last_fed: new Date(),
        health: 50, // Default health value
        energy: chibiData?.energy || 100, // Use stored energy or default to 100
        hunger: chibiData?.hunger || 0    // Use stored hunger or default to 0
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

    const taskChannel = supabase
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

    // Subscribe to chibi stats changes
    const chibiChannel = supabase
      .channel(`chibis_${chibiId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chibis',
          filter: `id=eq.${chibiId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setStats(prev => prev ? {
              ...prev,
              energy: payload.new.energy,
              hunger: payload.new.hunger
            } : null);
          }
        }
      )
      .subscribe();

    return () => {
      taskChannel.unsubscribe();
      chibiChannel.unsubscribe();
    };
  }, [chibiId, tasks]);

  const updateChibiStats = async (updates: Partial<ChibiStats>) => {
    try {
      const { error } = await supabase
        .from('chibis')
        .update({
          energy: updates.energy,
          hunger: updates.hunger
        })
        .eq('id', chibiId);

      if (error) throw error;

      setStats(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating chibi stats:', error);
    }
  };

  return { stats, loading, updateTask, updateChibiStats };
} 