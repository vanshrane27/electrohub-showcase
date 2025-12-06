-- Complete RLS fix - Drop ALL existing policies and recreate them correctly
-- This ensures no conflicts or incorrect policies remain

-- Drop all existing policies for warranties
DROP POLICY IF EXISTS "Allow public insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow public read by serial number on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated read on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon read on warranties" ON public.warranties;

-- Drop all existing policies for contact_forms
DROP POLICY IF EXISTS "Allow public insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow anon insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated read on contact_forms" ON public.contact_forms;

-- Recreate policies for warranties table
-- Allow anonymous users to insert (for warranty registration)
CREATE POLICY "warranties_anon_insert"
  ON public.warranties
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (for warranty registration)
CREATE POLICY "warranties_authenticated_insert"
  ON public.warranties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all warranties (for dashboard)
CREATE POLICY "warranties_authenticated_select"
  ON public.warranties
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to read warranties (for warranty check)
CREATE POLICY "warranties_anon_select"
  ON public.warranties
  FOR SELECT
  TO anon
  USING (true);

-- Recreate policies for contact_forms table
-- Allow anonymous users to insert (for contact form submission)
CREATE POLICY "contact_forms_anon_insert"
  ON public.contact_forms
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (for contact form submission)
CREATE POLICY "contact_forms_authenticated_insert"
  ON public.contact_forms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all contact forms (for dashboard)
CREATE POLICY "contact_forms_authenticated_select"
  ON public.contact_forms
  FOR SELECT
  TO authenticated
  USING (true);
