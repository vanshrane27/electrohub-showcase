import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Phone validation regex (supports international formats)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Sanitize text input
const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'&]/g, '') // Remove special chars
    .trim()
    .slice(0, 5000); // Limit length
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { first_name, last_name, phone, message } = await req.json();

    // Validation
    if (!first_name || !last_name || !phone) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: first_name, last_name, phone' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedFirstName = sanitizeText(first_name);
    const sanitizedLastName = sanitizeText(last_name);
    const sanitizedMessage = sanitizeText(message);

    console.log('Processing customer:', { phone: cleanPhone, first_name: sanitizedFirstName });

    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error while fetching customer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let customerId: string;

    if (existingCustomer) {
      // Update existing customer
      const currentHistory = existingCustomer.history || [];
      const newHistoryEntry = {
        timestamp: new Date().toISOString(),
        message: sanitizedMessage || 'No message',
        type: 'contact'
      };

      const { data: updatedCustomer, error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
          latest_message: sanitizedMessage || existingCustomer.latest_message,
          history: [...currentHistory, newHistoryEntry]
        })
        .eq('id', existingCustomer.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating customer:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update customer' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      customerId = updatedCustomer.id;
      console.log('Customer updated:', customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
          phone: cleanPhone,
          latest_message: sanitizedMessage,
          history: sanitizedMessage ? [{
            timestamp: new Date().toISOString(),
            message: sanitizedMessage,
            type: 'initial_contact'
          }] : []
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating customer:', insertError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create customer' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      customerId = newCustomer.id;
      console.log('Customer created:', customerId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer_id: customerId,
        is_new: !existingCustomer 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
