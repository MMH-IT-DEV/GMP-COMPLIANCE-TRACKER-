-- Migration: Create gmp_messages table for item-specific discussions
CREATE TABLE IF NOT EXISTS public.gmp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gmp_messages ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (simulating public access as requested)
CREATE POLICY "Allow all access to gmp_messages" 
ON public.gmp_messages 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_gmp_messages_item_id ON public.gmp_messages(item_id);
