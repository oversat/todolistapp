-- Remove hunger column from chibis table since it will be calculated from energy
ALTER TABLE public.chibis
DROP COLUMN hunger; 