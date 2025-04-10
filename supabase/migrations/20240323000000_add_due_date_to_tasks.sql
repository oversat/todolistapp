-- Add due_date column to tasks table
ALTER TABLE public.tasks
ADD COLUMN due_date TIMESTAMPTZ;

-- Update existing tasks to have null due_date
UPDATE public.tasks
SET due_date = NULL
WHERE due_date IS NULL; 