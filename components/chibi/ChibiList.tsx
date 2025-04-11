import { useEffect, useState } from 'react';
import { Card } from '@/components/layout/card';
import { supabase } from '@/lib/supabase';
import { Chibi } from './Chibi';
import { CreateChibiForm } from './CreateChibiForm';
import { DeleteChibiDialog } from './DeleteChibiDialog';
import { CHIBI_IMAGES } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChibiData {
  id: string;
  name: string;
  type: string;
  happiness: number;
  energy: number;
  last_fed: string;
}

export function ChibiList() {
  const [chibis, setChibis] = useState<ChibiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [chibiToDelete, setChibiToDelete] = useState<ChibiData | null>(null);
  const { toast } = useToast();

  async function fetchChibis() {
    try {
      console.log('Fetching chibis...');
      const { data, error } = await supabase
        .from('chibis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error in fetchChibis:', error);
        throw error;
      }
      console.log('Fetched chibis:', data);
      setChibis(data || []);
    } catch (error) {
      console.error('Error fetching chibis:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch chibis',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteChibi(chibiId: string) {
    console.log('Attempting to delete chibi with ID:', chibiId);
    console.log('Current chibis before deletion:', chibis);
    
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error('Not authenticated');
      }
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }
      console.log('Authenticated user:', user.id);

      // First delete from the database
      const { error: deleteError } = await supabase
        .from('chibis')
        .delete()
        .eq('id', chibiId)
        .eq('user_id', user.id); // Add user_id check for extra security

      if (deleteError) {
        console.error('Error in deleteChibi:', deleteError);
        throw deleteError;
      }

      console.log('Successfully deleted chibi from database');
      
      // Update local state
      const updatedChibis = chibis.filter(chibi => chibi.id !== chibiId);
      console.log('Updated chibis after deletion:', updatedChibis);
      setChibis(updatedChibis);

      toast({
        title: 'Success',
        description: 'Chibi deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting chibi:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete chibi',
        variant: 'destructive',
      });
    }
  }

  useEffect(() => {
    console.log('ChibiList mounted, fetching initial data');
    fetchChibis();
  }, []);

  useEffect(() => {
    console.log('Chibis state updated:', chibis);
  }, [chibis]);

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
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-2xl">Your Chibis</h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#00a8ff] text-white px-4 py-2 rounded hover:bg-[#0097e6] transition-colors font-mono"
          >
            + New Chibi
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chibis.map((chibi) => (
          <div key={chibi.id} className="bg-[#c3c3c3] p-4 rounded-lg">
            <Chibi
              id={chibi.id}
              name={chibi.name}
              image={CHIBI_IMAGES[chibi.type as keyof typeof CHIBI_IMAGES]}
              happiness={chibi.happiness}
              energy={chibi.energy}
              onDelete={() => setChibiToDelete(chibi)}
            />
          </div>
        ))}
      </div>

      {chibiToDelete && (
        <DeleteChibiDialog
          isOpen={true}
          onClose={() => {
            console.log('Delete dialog closed');
            setChibiToDelete(null);
          }}
          onConfirm={() => {
            console.log('Delete confirmed for chibi:', chibiToDelete);
            if (chibiToDelete) {
              deleteChibi(chibiToDelete.id);
              setChibiToDelete(null);
            }
          }}
          chibiName={chibiToDelete.name}
        />
      )}
    </div>
  );
} 