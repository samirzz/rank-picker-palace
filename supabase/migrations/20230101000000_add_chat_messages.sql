
-- Add chat_messages table for user-admin communication
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_id UUID NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add policies for chat_messages table
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select their own messages
CREATE POLICY "Users can view their own messages"
ON public.chat_messages
FOR SELECT
USING (
  sender_id = auth.uid() OR 
  recipient_id = auth.uid() OR
  is_admin = TRUE
);

-- Allow authenticated users to insert their own messages
CREATE POLICY "Users can insert their own messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() OR
  is_admin = TRUE
);

-- Add real-time capabilities for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
