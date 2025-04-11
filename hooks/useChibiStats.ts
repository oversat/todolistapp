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
}

export function useChibiStats(chibiId: string, tasks: Task[] = []): ChibiStatsHookReturn {
  const [stats, setStats] = useState<ChibiStats | null>(null);

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
    const uncompletedTaskCount = tasks.filter(task => !task.completed).length;
    const { deadlineHearts, noteHearts } = calculateHearts(tasks);
    const energy = calculateEnergy(uncompletedTaskCount);
    const hunger = 100 - energy;

    setStats({
      id: chibiId,
      energy,
      hunger,
      deadlineHearts,
      noteHearts,
      last_fed: new Date(),
      health: 100
    });
  }, [tasks, chibiId]);

  return { stats, updateTask };
} 