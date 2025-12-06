-- Add Retell AI tracking columns to contact_forms table
ALTER TABLE public.contact_forms 
ADD COLUMN IF NOT EXISTS retell_call_id TEXT,
ADD COLUMN IF NOT EXISTS retell_status TEXT,
ADD COLUMN IF NOT EXISTS retell_called_at TIMESTAMPTZ;

-- Add Retell AI tracking columns to warranties table
ALTER TABLE public.warranties 
ADD COLUMN IF NOT EXISTS retell_call_id TEXT,
ADD COLUMN IF NOT EXISTS retell_status TEXT,
ADD COLUMN IF NOT EXISTS retell_called_at TIMESTAMPTZ;

-- Create indexes for Retell AI tracking
CREATE INDEX IF NOT EXISTS idx_contact_forms_retell_call_id ON public.contact_forms(retell_call_id);
CREATE INDEX IF NOT EXISTS idx_warranties_retell_call_id ON public.warranties(retell_call_id);
