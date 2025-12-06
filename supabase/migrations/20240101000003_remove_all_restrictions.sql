-- Remove all restrictions - Allow full read/write access for all users
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow public read by serial number on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated read on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon read on warranties" ON public.warranties;
DROP POLICY IF EXISTS "warranties_anon_insert" ON public.warranties;
DROP POLICY IF EXISTS "warranties_authenticated_insert" ON public.warranties;
DROP POLICY IF EXISTS "warranties_authenticated_select" ON public.warranties;
DROP POLICY IF EXISTS "warranties_anon_select" ON public.warranties;
DROP POLICY IF EXISTS "warranties_anon_all" ON public.warranties;
DROP POLICY IF EXISTS "warranties_authenticated_all" ON public.warranties;

DROP POLICY IF EXISTS "Allow public insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow anon insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated read on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "contact_forms_anon_insert" ON public.contact_forms;
DROP POLICY IF EXISTS "contact_forms_authenticated_insert" ON public.contact_forms;
DROP POLICY IF EXISTS "contact_forms_authenticated_select" ON public.contact_forms;
DROP POLICY IF EXISTS "contact_forms_anon_all" ON public.contact_forms;
DROP POLICY IF EXISTS "contact_forms_authenticated_all" ON public.contact_forms;

-- Create unrestricted policies for warranties table
-- Allow all operations (SELECT, INSERT, UPDATE, DELETE) for anonymous users
CREATE POLICY "warranties_anon_all"
  ON public.warranties
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow all operations (SELECT, INSERT, UPDATE, DELETE) for authenticated users
CREATE POLICY "warranties_authenticated_all"
  ON public.warranties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create unrestricted policies for contact_forms table
-- Allow all operations (SELECT, INSERT, UPDATE, DELETE) for anonymous users
CREATE POLICY "contact_forms_anon_all"
  ON public.contact_forms
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow all operations (SELECT, INSERT, UPDATE, DELETE) for authenticated users
CREATE POLICY "contact_forms_authenticated_all"
  ON public.contact_forms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
