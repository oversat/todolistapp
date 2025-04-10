-- Add notes column to tasks table
ALTER TABLE public.tasks
ADD COLUMN notes TEXT;

-- Update existing tasks to have empty notes
UPDATE public.tasks
SET notes = ''
WHERE notes IS NULL; 