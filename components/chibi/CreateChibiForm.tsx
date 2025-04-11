'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { Label } from '@/components/elements/label';
import { Card } from '@/components/layout/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { PostgrestError } from '@supabase/supabase-js';
import { CHIBI_IMAGES } from '@/lib/utils';

const CHIBI_TYPES = [
  { value: 'fox', label: 'Fox' },
  { value: 'panda', label: 'Panda' },
  { value: 'purplebunny', label: 'Purple Bunny' },
  { value: 'redcat', label: 'Red Cat' },
  { value: 'yellowdog', label: 'Yellow Dog' }
];

export function CreateChibiForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
  });

  const selectedType = CHIBI_TYPES.find(type => type.value === formData.type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let finalName = formData.name;
      let counter = 1;

      // Keep checking and incrementing the number until we find an available name
      while (true) {
        const { data: existingChibis, error: checkError } = await supabase
          .from('chibis')
          .select('name')
          .eq('user_id', user.id)
          .eq('name', finalName);

        if (checkError) throw checkError;
        if (!existingChibis || existingChibis.length === 0) break;

        // If name exists, append the next number
        finalName = `${formData.name}${counter.toString().padStart(2, '0')}`;
        counter++;
      }

      const { error } = await supabase
        .from('chibis')
        .insert([
          {
            user_id: user.id,
            name: finalName,
            type: formData.type,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: `Your new chibi "${finalName}" has been created!`,
      });

      // Reset form
      setFormData({ name: '', type: '' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
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
              <SelectValue placeholder="Select a type">
                {selectedType && (
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      {selectedType.value === 'yellowdog' ? (
                        <>
                          <Image
                            src={selectedType.imageLayer1}
                            alt={selectedType.label}
                            width={32}
                            height={32}
                            className="absolute inset-0 object-contain"
                            unoptimized
                          />
                          <Image
                            src={selectedType.imageLayer2}
                            alt={`${selectedType.label} head`}
                            width={32}
                            height={32}
                            className="absolute inset-0 object-contain"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={CHIBI_IMAGES[selectedType.value as keyof typeof CHIBI_IMAGES]}
                          alt={selectedType.label}
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                    {selectedType.label}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CHIBI_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      {type.value === 'yellowdog' ? (
                        <>
                          <Image
                            src={type.imageLayer1}
                            alt={type.label}
                            width={32}
                            height={32}
                            className="absolute inset-0 object-contain"
                            unoptimized
                          />
                          <Image
                            src={type.imageLayer2}
                            alt={`${type.label} head`}
                            width={32}
                            height={32}
                            className="absolute inset-0 object-contain"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={CHIBI_IMAGES[type.value as keyof typeof CHIBI_IMAGES]}
                          alt={type.label}
                          width={32}
                          height={32}
                          className="object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                    {type.label}
                  </div>
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