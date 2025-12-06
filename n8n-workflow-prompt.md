# N8N Workflow Prompt: Contact Form to Retell AI Integration

## Objective
Create an n8n workflow that automatically processes contact form submissions, stores them in Supabase, and triggers a Retell AI phone call to the user.

**Note**: This workflow only triggers for contact form submissions, NOT for warranty registrations.

## Workflow Architecture

```
Contact Form Submission → Supabase (Store Data - Frontend) → N8N Webhook → Retell AI API → Phone Call to User
```

**Note**: The frontend already stores data in Supabase. The n8n workflow only handles triggering Retell AI calls.

## Workflow Steps

### Step 1: Webhook Trigger
- **Node Type**: Webhook
- **Method**: POST
- **Path**: `/contact-form-submission`
- **Response Mode**: Respond to Webhook
- **Authentication**: None (or API Key if needed)
- **Expected Payload**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "phone": "string",
    "message": "string"
  }
  ```

### Step 2: Conditional Check (Phone Number Available)
- **Node Type**: IF
- **Condition**: Check if `phone` exists and is not empty
  - Expression: `{{ $json.phone && $json.phone.trim() !== '' }}`
- **True Path**: Continue to Retell AI
- **False Path**: End workflow (no phone call)

### Step 3: Prepare Retell AI Payload
- **Node Type**: Code/Function
- **Purpose**: Transform data for Retell AI API
- **Script**:
  ```javascript
  // Get data from webhook (original form data)
  const webhookData = $('Webhook').item.json;
  
  // Prepare Retell AI payload
  const retellPayload = {
    from: process.env.RETELL_AI_PHONE_NUMBER || "+1234567890", // Your Retell AI phone number
    to: webhookData.phone,
    override_agent_id: process.env.RETELL_AI_AGENT_ID || "your_agent_id", // Your Retell AI agent ID
    metadata: {
      form_type: "contact_form",
      customer_name: `${webhookData.first_name} ${webhookData.last_name}`,
      message: webhookData.message,
      timestamp: new Date().toISOString()
    }
  };
  
  return retellPayload;
  ```

### Step 4: Call Retell AI API
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `https://api.retellai.com/create-phone-call`
- **Authentication**: 
  - Type: Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_RETELL_AI_API_KEY`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_RETELL_AI_API_KEY
  ```
- **Body**: JSON payload from previous step
- **Expected Response**:
  ```json
  {
    "call_id": "string",
    "status": "queued"
  }
  ```

### Step 5: Webhook Response
- **Node Type**: Respond to Webhook
- **Response Code**: 200
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "Call initiated",
    "retell_call_id": "{{ $('Retell AI').item.json.call_id }}"
  }
  ```
- **Error Handling**: If Retell AI call fails, still return success (200) but log the error

## Database Schema Updates Needed

Add these columns to track Retell AI calls (already created in migration `20240101000005_add_retell_tracking.sql`):

```sql
-- Add Retell AI tracking columns to contact_forms
ALTER TABLE public.contact_forms 
ADD COLUMN IF NOT EXISTS retell_call_id TEXT,
ADD COLUMN IF NOT EXISTS retell_status TEXT,
ADD COLUMN IF NOT EXISTS retell_called_at TIMESTAMPTZ;
```

**Note**: Only contact_forms table needs Retell AI tracking. Warranty registrations do not trigger phone calls.

## Frontend Integration

Update the form submission in `Support.tsx` to also call the n8n webhook:

```typescript
const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmittingContact(true);

  try {
    // 1. Store in Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('contact_forms')
      .insert({
        first_name: contactForm.firstName,
        last_name: contactForm.lastName,
        phone: contactForm.phone,
        message: contactForm.message,
        status: 'New',
      })
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    // 2. Trigger n8n webhook for Retell AI call
    const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: contactForm.firstName,
            last_name: contactForm.lastName,
            phone: contactForm.phone,
            message: contactForm.message,
          }),
        });

        if (!n8nResponse.ok) {
          console.warn('N8N webhook failed, but data saved in Supabase');
        }
      } catch (webhookError) {
        // Don't fail the form submission if webhook fails
        console.warn('Failed to trigger n8n webhook:', webhookError);
      }
    }

    if (!n8nResponse.ok) {
      console.warn('N8N webhook failed, but data saved in Supabase');
    }

    toast({
      title: 'Message Sent!',
      description: 'Our support team will contact you within 24 hours.',
    });
    setContactForm({ firstName: '', lastName: '', phone: '', message: '' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    toast({
      title: 'Error',
      description: 'Failed to send message. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setSubmittingContact(false);
  }
};
```

## Retell AI Configuration

1. **Get API Key**: 
   - Sign up at https://retellai.com
   - Navigate to API settings
   - Generate API key

2. **Create Agent**:
   - Create a voice agent in Retell AI dashboard
   - Configure the agent to handle support calls
   - Note the Agent ID

3. **Phone Number**:
   - Get a phone number from Retell AI
   - This will be the "from" number in the API call

4. **Agent Script** (Example):
   ```
   Hello, this is [Company Name] support calling regarding your recent inquiry. 
   We received your message about [message topic]. 
   How can we assist you today?
   ```

## Environment Variables

### For Frontend (.env file)
The webhook URL is already configured in `.env`:
```
VITE_N8N_WEBHOOK_URL=https://vansh555.app.n8n.cloud/webhook/contact-form-submission
```

### For N8N Instance
Set these in your n8n instance:

```
RETELL_AI_API_KEY=your_retell_api_key
RETELL_AI_AGENT_ID=your_agent_id
RETELL_AI_PHONE_NUMBER=+1234567890
```

**Note**: Supabase credentials are not needed in n8n since the frontend handles data storage.

## Error Handling

- If phone number is missing → End workflow gracefully (no call)
- If Retell AI call fails → Log error, but still return success to webhook (200 status)
- The frontend handles Supabase storage, so n8n workflow failures won't affect data persistence

## Testing

1. Test webhook with sample payload
2. Verify Supabase insert
3. Verify Retell AI API call
4. Test actual phone call delivery
5. Verify call tracking in database

## Workflow JSON Export

After creating the workflow in n8n, export it as JSON for version control and easy deployment.
