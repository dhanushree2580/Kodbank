
-- Create kodusers table
CREATE TABLE public.kodusers (
  uid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 100000,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Customer' CHECK (role IN ('Customer', 'Manager', 'Admin'))
);

-- Create usertokens table
CREATE TABLE public.usertokens (
  tid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  uid UUID NOT NULL REFERENCES public.kodusers(uid) ON DELETE CASCADE,
  expiry TIMESTAMPTZ NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.kodusers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usertokens ENABLE ROW LEVEL SECURITY;

-- Since we use custom JWT auth via edge functions (service role), 
-- we don't add permissive RLS policies. Edge functions use service role key
-- which bypasses RLS, ensuring all access is controlled server-side.
