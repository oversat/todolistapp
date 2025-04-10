/*
  # Initial Schema for Chibi Todo App

  1. New Tables
    - `chibis`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `type` (text)
      - `happiness` (integer)
      - `energy` (integer)
      - `last_fed` (timestamptz)
      - `created_at` (timestamptz)

    - `tasks`
      - `id` (uuid, primary key)
      - `chibi_id` (uuid, references chibis)
      - `text` (text)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create chibis table
CREATE TABLE IF NOT EXISTS chibis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  happiness integer DEFAULT 50,
  energy integer DEFAULT 60,
  last_fed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chibi_id uuid REFERENCES chibis ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chibis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies for chibis table
CREATE POLICY "Users can view their own chibis"
  ON chibis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chibis"
  ON chibis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chibis"
  ON chibis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chibis"
  ON chibis
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for tasks table
CREATE POLICY "Users can view tasks of their chibis"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chibis
      WHERE chibis.id = tasks.chibi_id
      AND chibis.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks for their chibis"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chibis
      WHERE chibis.id = tasks.chibi_id
      AND chibis.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks of their chibis"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chibis
      WHERE chibis.id = tasks.chibi_id
      AND chibis.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks of their chibis"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chibis
      WHERE chibis.id = tasks.chibi_id
      AND chibis.user_id = auth.uid()
    )
  );