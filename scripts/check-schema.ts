import { supabase } from '@/lib/supabase';

async function checkSchema() {
  try {
    // Check if chibis table exists
    const { data: chibisTable, error: chibisError } = await supabase
      .from('chibis')
      .select('*')
      .limit(1);

    if (chibisError) {
      console.error('Error checking chibis table:', chibisError);
      console.log('Chibis table might not exist or have incorrect permissions');
    } else {
      console.log('Chibis table exists and is accessible');
    }

    // Check if tasks table exists
    const { data: tasksTable, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);

    if (tasksError) {
      console.error('Error checking tasks table:', tasksError);
      console.log('Tasks table might not exist or have incorrect permissions');
    } else {
      console.log('Tasks table exists and is accessible');
    }

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');

    if (policiesError) {
      console.error('Error checking RLS policies:', policiesError);
    } else {
      console.log('Current RLS policies:', policies);
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema(); 