import { useState, useEffect } from 'react';
import { CHIBI_IMAGES } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export interface ChibiData {
  id: string;
  name: string;
  type: keyof typeof CHIBI_IMAGES;
  image: string;
  happiness: number;
  energy: number;
  tasks: TaskData[];
  last_fed: string;
  created_at: string;
}

export interface TaskData {
  id: string;
  text: string;
  notes?: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export function useChibi() {
  const [chibis, setChibis] = useState<ChibiData[]>([]);
  const [currentChibiIndex, setCurrentChibiIndex] = useState<number>(-1);

  // Load data from Supabase
  const fetchChibis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chibis')
        .select(`
          *,
          tasks (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedChibis = data?.map(chibi => ({
        ...chibi,
        image: CHIBI_IMAGES[chibi.type as keyof typeof CHIBI_IMAGES],
        tasks: chibi.tasks || []
      })) || [];

      setChibis(formattedChibis);
    } catch (error) {
      console.error('Error fetching chibis:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchChibis();

    // Subscribe to changes
    const chibisSubscription = supabase
      .channel('chibis_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chibis' }, fetchChibis)
      .subscribe();

    return () => {
      chibisSubscription.unsubscribe();
    };
  }, []);

  // Create a new Chibi
  const createChibi = async (name: string, type: keyof typeof CHIBI_IMAGES) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chibis')
        .insert([{
          user_id: user.id,
          name,
          type,
          happiness: 50,
          energy: 60,
          last_fed: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchChibis();
      return data;
    } catch (error) {
      console.error('Error creating chibi:', error);
      throw error;
    }
  };

  // Add a task to current Chibi
  const addTask = async (text: string, notes: string = '', due_date?: string) => {
    if (currentChibiIndex === -1) return;
    const chibi = chibis[currentChibiIndex];

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          chibi_id: chibi.id,
          text,
          notes,
          due_date,
          completed: false
        }]);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  // Complete a task
  const completeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  // Feed the Chibi
  const feedChibi = async () => {
    if (currentChibiIndex === -1) return;
    const chibi = chibis[currentChibiIndex];

    try {
      const { error } = await supabase
        .from('chibis')
        .update({
          happiness: Math.min(100, chibi.happiness + 10),
          last_fed: new Date().toISOString()
        })
        .eq('id', chibi.id);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error feeding chibi:', error);
      throw error;
    }
  };

  // Clean completed tasks
  const cleanCompletedTasks = async () => {
    if (currentChibiIndex === -1) return;
    const chibi = chibis[currentChibiIndex];

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('chibi_id', chibi.id)
        .eq('completed', true);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error cleaning tasks:', error);
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  // Edit a task
  const editTask = async (taskId: string, newText: string, newNotes?: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          text: newText,
          notes: newNotes 
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchChibis();
    } catch (error) {
      console.error('Error editing task:', error);
      throw error;
    }
  };

  // Update task notes
  const updateTaskNotes = async (taskId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ notes })
        .eq('id', taskId);

      if (error) throw error;
      
      // Update local state
      setChibis(prevChibis => 
        prevChibis.map(chibi => ({
          ...chibi,
          tasks: chibi.tasks.map(task =>
            task.id === taskId ? { ...task, notes } : task
          )
        }))
      );
    } catch (error) {
      console.error('Error updating task notes:', error);
      throw error;
    }
  };

  // Reset all data
  const resetData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete all chibis (tasks will be deleted via cascade)
      const { error } = await supabase
        .from('chibis')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setChibis([]);
      setCurrentChibiIndex(-1);
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  };

  // Update task due date
  const updateTaskDueDate = async (taskId: string, dueDate: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ due_date: dueDate })
        .eq('id', taskId);

      if (error) throw error;
      
      // Update local state
      setChibis(prevChibis => 
        prevChibis.map(chibi => ({
          ...chibi,
          tasks: chibi.tasks.map(task =>
            task.id === taskId ? { ...task, due_date: dueDate } : task
          )
        }))
      );
    } catch (error) {
      console.error('Error updating task due date:', error);
      throw error;
    }
  };

  return {
    chibis,
    currentChibiIndex,
    currentChibi: currentChibiIndex >= 0 ? chibis[currentChibiIndex] : null,
    setCurrentChibiIndex,
    createChibi,
    addTask,
    completeTask,
    feedChibi,
    cleanCompletedTasks,
    deleteTask,
    editTask,
    updateTaskNotes,
    updateTaskDueDate,
    resetData,
    fetchChibis
  };
} 