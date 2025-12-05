import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize text input
const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'&]/g, '')
    .trim()
    .slice(0, 5000);
};

// Validate date format (YYYY-MM-DD)
const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

interface WarrantyPayload {
  customer_id: string;
  product_name: string;
  serial_number: string;
  warranty_start: string;
  warranty_end: string;
}

interface BookingPayload {
  customer_id: string;
  preferred_date: string;
  preferred_time: string;
}

interface OrderIssuePayload {
  customer_id: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, payload } = body;

    console.log('AI Callback received:', { action, payload });

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!payload) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: { success: boolean; data?: any; error?: string };

    switch (action) {
      case 'create_warranty_issue': {
        const p = payload as WarrantyPayload;
        
        if (!p.customer_id || !p.product_name || !p.serial_number || !p.warranty_start || !p.warranty_end) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing warranty fields: customer_id, product_name, serial_number, warranty_start, warranty_end' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!isValidDate(p.warranty_start) || !isValidDate(p.warranty_end)) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify customer exists
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('id', p.customer_id)
          .maybeSingle();

        if (!customer) {
          return new Response(
            JSON.stringify({ success: false, error: 'Customer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create warranty record
        const { data: warranty, error: warrantyError } = await supabase
          .from('warranty')
          .insert({
            customer_id: p.customer_id,
            product_name: sanitizeText(p.product_name),
            serial_number: sanitizeText(p.serial_number),
            warranty_start: p.warranty_start,
            warranty_end: p.warranty_end
          })
          .select('id')
          .single();

        if (warrantyError) {
          console.error('Error creating warranty:', warrantyError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create warranty record' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create associated issue
        const { data: issue } = await supabase
          .from('issues')
          .insert({
            customer_id: p.customer_id,
            category: 'warranty',
            description: `Warranty registration for ${p.product_name} (SN: ${p.serial_number})`,
            status: 'open'
          })
          .select('id')
          .single();

        result = { 
          success: true, 
          data: { 
            warranty_id: warranty.id,
            issue_id: issue?.id 
          } 
        };
        break;
      }

      case 'booking': {
        const p = payload as BookingPayload;
        
        if (!p.customer_id || !p.preferred_date || !p.preferred_time) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing booking fields: customer_id, preferred_date, preferred_time' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!isValidDate(p.preferred_date)) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify customer exists
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('id', p.customer_id)
          .maybeSingle();

        if (!customer) {
          return new Response(
            JSON.stringify({ success: false, error: 'Customer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create booking
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            customer_id: p.customer_id,
            preferred_date: p.preferred_date,
            preferred_time: sanitizeText(p.preferred_time),
            status: 'pending'
          })
          .select('id')
          .single();

        if (bookingError) {
          console.error('Error creating booking:', bookingError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create booking' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create associated issue
        const { data: issue } = await supabase
          .from('issues')
          .insert({
            customer_id: p.customer_id,
            category: 'booking',
            description: `Service booking for ${p.preferred_date} at ${p.preferred_time}`,
            status: 'open'
          })
          .select('id')
          .single();

        result = { 
          success: true, 
          data: { 
            booking_id: booking.id,
            issue_id: issue?.id 
          } 
        };
        break;
      }

      case 'order_issue': {
        const p = payload as OrderIssuePayload;
        
        if (!p.customer_id || !p.description) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing order issue fields: customer_id, description' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify customer exists
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('id', p.customer_id)
          .maybeSingle();

        if (!customer) {
          return new Response(
            JSON.stringify({ success: false, error: 'Customer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create order issue
        const { data: issue, error: issueError } = await supabase
          .from('issues')
          .insert({
            customer_id: p.customer_id,
            category: 'order',
            description: sanitizeText(p.description),
            status: 'open'
          })
          .select('id')
          .single();

        if (issueError) {
          console.error('Error creating order issue:', issueError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create order issue' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = { 
          success: true, 
          data: { issue_id: issue.id } 
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Unknown action: ${action}. Valid actions: create_warranty_issue, booking, order_issue` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log('AI Callback result:', result);

    return new Response(
      JSON.stringify(result),
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
