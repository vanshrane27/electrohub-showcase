-- Fix RLS policies - Drop all existing policies first
DROP POLICY IF EXISTS "Allow public insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow public read by serial number on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow public insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow anon insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated insert on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow authenticated read on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon read on warranties" ON public.warranties;
DROP POLICY IF EXISTS "Allow anon insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_forms" ON public.contact_forms;
DROP POLICY IF EXISTS "Allow authenticated read on contact_forms" ON public.contact_forms;

-- Create correct policies for warranties table
-- Allow anonymous users to insert (for warranty registration)
CREATE POLICY "Allow anon insert on warranties"
  ON public.warranties
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (for warranty registration)
CREATE POLICY "Allow authenticated insert on warranties"
  ON public.warranties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all warranties (for dashboard)
CREATE POLICY "Allow authenticated read on warranties"
  ON public.warranties
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to read warranties (for warranty check)
CREATE POLICY "Allow anon read on warranties"
  ON public.warranties
  FOR SELECT
  TO anon
  USING (true);

-- Create correct policies for contact_forms table
-- Allow anonymous users to insert (for contact form submission)
CREATE POLICY "Allow anon insert on contact_forms"
  ON public.contact_forms
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (for contact form submission)
CREATE POLICY "Allow authenticated insert on contact_forms"
  ON public.contact_forms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all contact forms (for dashboard)
CREATE POLICY "Allow authenticated read on contact_forms"
  ON public.contact_forms
  FOR SELECT
  TO authenticated
  USING (true);
