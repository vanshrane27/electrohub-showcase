-- Create warranties table for support system
CREATE TABLE IF NOT EXISTS public.warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_forms table for support system
CREATE TABLE IF NOT EXISTS public.contact_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_warranties_serial_number ON public.warranties(serial_number);
CREATE INDEX IF NOT EXISTS idx_warranties_email ON public.warranties(email);
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON public.contact_forms(status);
CREATE INDEX IF NOT EXISTS idx_contact_forms_submitted_at ON public.contact_forms(submitted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for warranties table - No restrictions
-- Allow all operations for anonymous users
CREATE POLICY "warranties_anon_all"
  ON public.warranties
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow all operations for authenticated users
CREATE POLICY "warranties_authenticated_all"
  ON public.warranties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for contact_forms table - No restrictions
-- Allow all operations for anonymous users
CREATE POLICY "contact_forms_anon_all"
  ON public.contact_forms
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow all operations for authenticated users
CREATE POLICY "contact_forms_authenticated_all"
  ON public.contact_forms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
