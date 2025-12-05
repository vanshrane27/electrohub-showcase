import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Category detection keywords
const categoryKeywords = {
  warranty: ['warranty', 'guarantee', 'expired', 'coverage', 'repair warranty', 'product warranty'],
  booking: ['book', 'booking', 'slot', 'service', 'appointment', 'schedule', 'technician', 'visit'],
  order: ['order', 'delivery', 'shipping', 'track', 'purchase', 'bought', 'payment', 'refund']
};

// Detect issue category from message
const detectCategory = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return category;
    }
  }
  
  return 'general'; // Default category
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { customer_id, message, category: providedCategory } = await req.json();

    // Validation
    if (!customer_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: customer_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify customer exists
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', customer_id)
      .maybeSingle();

    if (customerError || !customer) {
      console.error('Customer not found:', customer_id);
      return new Response(
        JSON.stringify({ success: false, error: 'Customer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and detect category
    const sanitizedMessage = sanitizeText(message);
    const detectedCategory = providedCategory || detectCategory(sanitizedMessage);

    console.log('Creating issue:', { customer_id, category: detectedCategory });

    // Create issue
    const { data: issue, error: issueError } = await supabase
      .from('issues')
      .insert({
        customer_id,
        category: detectedCategory,
        description: sanitizedMessage,
        status: 'open'
      })
      .select('id, category')
      .single();

    if (issueError) {
      console.error('Error creating issue:', issueError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create issue' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update customer's latest message
    await supabase
      .from('customers')
      .update({ latest_message: sanitizedMessage })
      .eq('id', customer_id);

    console.log('Issue created:', issue.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        issue_id: issue.id,
        category: issue.category,
        detected_category: detectedCategory
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
