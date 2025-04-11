-- Add hunger column to chibis table
ALTER TABLE public.chibis
ADD COLUMN hunger integer DEFAULT 0;

-- Update existing chibis to have hunger set to 0
UPDATE public.chibis
SET hunger = 0
WHERE hunger IS NULL; 