-- Create chibis table
CREATE TABLE IF NOT EXISTS public.chibis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    happiness INTEGER DEFAULT 50,
    energy INTEGER DEFAULT 60,
    last_fed TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chibi_id UUID REFERENCES public.chibis(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chibis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for chibis
CREATE POLICY "Users can view their own chibis"
    ON public.chibis FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chibis"
    ON public.chibis FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chibis"
    ON public.chibis FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chibis"
    ON public.chibis FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can view tasks for their chibis"
    ON public.tasks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chibis
            WHERE chibis.id = tasks.chibi_id
            AND chibis.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tasks for their chibis"
    ON public.tasks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chibis
            WHERE chibis.id = tasks.chibi_id
            AND chibis.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks for their chibis"
    ON public.tasks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.chibis
            WHERE chibis.id = tasks.chibi_id
            AND chibis.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks for their chibis"
    ON public.tasks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.chibis
            WHERE chibis.id = tasks.chibi_id
            AND chibis.user_id = auth.uid()
        )
    ); 