-- Remove energy column from chibis table since it will be calculated from task count
ALTER TABLE public.chibis
DROP COLUMN energy; 