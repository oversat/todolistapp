-- Drop existing table and policies
DROP TABLE IF EXISTS public.chat_messages CASCADE;

-- Recreate the table with the correct structure
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chibi_id UUID NOT NULL REFERENCES public.chibis(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Enable read access for users with matching chibi_id" ON public.chat_messages
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.chibis
        WHERE chibis.id = chat_messages.chibi_id
        AND chibis.user_id = auth.uid()
    ));

CREATE POLICY "Enable insert access for users with matching chibi_id" ON public.chat_messages
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.chibis
        WHERE chibis.id = chat_messages.chibi_id
        AND chibis.user_id = auth.uid()
    )); 