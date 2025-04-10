import { useEffect, useState } from 'react';
import { Card } from '@/components/layout/card';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/elements/avatar';
import { Progress } from '@/components/data/progress';
import { CreateChibiForm } from './CreateChibiForm';

interface Chibi {
  id: string;
  name: string;
  type: string;
  happiness: number;
  energy: number;
  last_fed: string;
}

export function ChibiList() {
  const [chibis, setChibis] = useState<Chibi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  async function fetchChibis() {
    try {
      const { data, error } = await supabase
        .from('chibis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChibis(data || []);
    } catch (error) {
      console.error('Error fetching chibis:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChibis();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading your chibis...</div>;
  }

  if (chibis.length === 0 && !showCreateForm) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to Chibi Todo!</h2>
        <p className="mb-4">You don't have any chibis yet. Create one to get started!</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Your First Chibi
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Add New Chibi
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateChibiForm />
          <button
            onClick={() => setShowCreateForm(false)}
            className="mt-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chibis.map((chibi) => (
          <Card key={chibi.id} className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/images/chibi-${chibi.type}.svg`} alt={chibi.name} />
                <AvatarFallback>{chibi.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-color)' }}>{chibi.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{chibi.type}</p>
                <div className="mt-2 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm" style={{ color: 'var(--text-color)' }}>
                      <span>Happiness</span>
                      <span>{chibi.happiness}%</span>
                    </div>
                    <Progress value={chibi.happiness} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm" style={{ color: 'var(--text-color)' }}>
                      <span>Energy</span>
                      <span>{chibi.energy}%</span>
                    </div>
                    <Progress value={chibi.energy} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 