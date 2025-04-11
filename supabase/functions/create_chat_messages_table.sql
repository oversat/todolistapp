CREATE OR REPLACE FUNCTION create_chat_messages_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chibi_id UUID NOT NULL REFERENCES chibis(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid()
  );

  -- Add indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_chat_messages_chibi_id ON chat_messages(chibi_id);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

  -- Enable Row Level Security
  ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

  -- Create policies
  -- Allow users to read their own messages
  DROP POLICY IF EXISTS "Users can read their own messages" ON chat_messages;
  CREATE POLICY "Users can read their own messages" ON chat_messages
    FOR SELECT
    USING (auth.uid() = user_id);

  -- Allow users to insert their own messages
  DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
  CREATE POLICY "Users can insert their own messages" ON chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  -- Allow users to delete their own messages
  DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;
  CREATE POLICY "Users can delete their own messages" ON chat_messages
    FOR DELETE
    USING (auth.uid() = user_id);
END;
$$; 