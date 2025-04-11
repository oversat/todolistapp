'use client';

import { useState } from 'react';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Label } from '@/components/elements/label';
import { Card } from '@/components/layout/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Textarea } from '@/components/elements/textarea';
import { Calendar } from '@/components/data/calendar';
import { format } from 'date-fns';

interface TaskFormProps {
  chibiId: string;
  onTaskCreated?: () => void;
  onImmediateUpdate?: (update: {
    deadlineHearts?: number;
    noteHearts?: number;
  }) => void;
}

export function TaskForm({ chibiId, onTaskCreated, onImmediateUpdate }: TaskFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            chibi_id: chibiId,
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            due_date: formData.dueDate,
            notes: formData.notes,
          },
        ]);

      if (error) throw error;

      // Notify parent of immediate update if needed
      if (onImmediateUpdate) {
        onImmediateUpdate({
          deadlineHearts: formData.dueDate ? 1 : undefined,
          noteHearts: formData.notes ? 1 : undefined
        });
      }

      toast({
        title: 'Success!',
        description: 'Task created successfully!',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: new Date(),
        notes: '',
      });

      // Notify parent
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 relative z-[15]">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Add any additional notes here..."
          />
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Calendar
            mode="single"
            selected={formData.dueDate}
            onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
            className="rounded-md border"
          />
        </div>
        <Button type="submit" disabled={loading || !formData.title}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Card>
  );
} 