'use client';

import { useState } from 'react';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Label } from '@/components/elements/label';
import { Card } from '@/components/layout/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { PostgrestError } from '@supabase/supabase-js';

const CHIBI_TYPES = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bunny', label: 'Bunny' },
  { value: 'fox', label: 'Fox' },
  { value: 'panda', label: 'Panda' },
];

export function CreateChibiForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('chibis')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            type: formData.type,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your new chibi has been created!',
      });

      // Reset form
      setFormData({ name: '', type: '' });
    } catch (error: PostgrestError | Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Create a New Chibi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            minLength={2}
            maxLength={20}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {CHIBI_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading || !formData.name || !formData.type}>
          {loading ? 'Creating...' : 'Create Chibi'}
        </Button>
      </form>
    </Card>
  );
} 