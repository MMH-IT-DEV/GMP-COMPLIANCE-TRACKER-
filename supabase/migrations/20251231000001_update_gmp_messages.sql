-- Migration: Add edit and delete capabilities to gmp_messages
ALTER TABLE public.gmp_messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE public.gmp_messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.gmp_messages ADD COLUMN IF NOT EXISTS user_id TEXT; -- Optional: for better ownership tracking if needed, otherwise we use user_name
