import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChibiStats {
  id: string;
  discipline: number;
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
  text: string;
}

interface UpdateTaskParams {
  notes?: string;
  due_date?: string;
  completed?: boolean;
  text?: string;
}

interface ChibiStatsHookReturn {
  stats: ChibiStats | null;
  updateTask: (taskId: string, updates: UpdateTaskParams) => Promise<void>;
  loading: boolean;
}

export function useChibiStats(chibiId: string, tasks: Task[] = []): ChibiStatsHookReturn {
  const [stats, setStats] = useState<ChibiStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate energy based on number of tasks
  const calculateEnergy = (taskCount: number): number => {
    if (taskCount === 0) return 0;
    if (taskCount === 1) return 25;
    if (taskCount === 2) return 50;
    if (taskCount === 3) return 75;
    return 100; // 4 or more tasks
  };

  // Simplified heart calculation - just check for non-empty content
  const calculateHearts = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const discipline = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const tasksWithNotes = tasks.filter(task => 
      task.notes && 
      task.notes.trim() !== '' && 
      !task.completed
    ).length;
    
    return {
      discipline,
      noteHearts: Math.min(tasksWithNotes, 4)
    };
  };

  // Update task in database
  const updateTask = async (taskId: string, updates: UpdateTaskParams): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Update stats whenever tasks change
  useEffect(() => {
    setLoading(true);
    const uncompletedTaskCount = tasks.filter(task => !task.completed).length;
    const { discipline, noteHearts } = calculateHearts(tasks);
    const energy = calculateEnergy(uncompletedTaskCount);
    const hunger = 100 - energy;

    setStats({
      id: chibiId,
      discipline,
      noteHearts,
      last_fed: new Date(),
      health: 100,
      energy,
      hunger
    });
    setLoading(false);
  }, [chibiId, tasks]);

  return { stats, updateTask, loading };
} 