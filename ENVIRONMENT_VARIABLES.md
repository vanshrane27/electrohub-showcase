# Environment Variables Reference

This document lists all environment variables required for the application.

## Required Variables

### Supabase Configuration

```bash
VITE_SUPABASE_PROJECT_ID=geodnjfvhzumbevtezvl
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=https://geodnjfvhzumbevtezvl.supabase.co
```

**Where to find:**
- Supabase Dashboard → Project Settings → API
- `VITE_SUPABASE_PUBLISHABLE_KEY` is the "anon" or "public" key (NOT the service role key)

### N8N Webhook

```bash
VITE_N8N_WEBHOOK_URL=https://vansh555.app.n8n.cloud/webhook/contact-form-submission
```

**Where to find:**
- Your n8n workflow webhook URL
- Should be the production webhook URL

## Setting Up in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select "Production", "Preview", and "Development"
4. Click **Save**
5. **Redeploy** your application for changes to take effect

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in the values from your Supabase and n8n dashboards
3. Restart your dev server

## Important Notes

- All variables must start with `VITE_` to be accessible in the frontend
- Never commit `.env` file to version control
- Use `.env.example` as a template (without actual values)
- Environment variables are injected at build time
- Changes to environment variables require a new deployment

## Security

- `VITE_SUPABASE_PUBLISHABLE_KEY` is safe to expose (it's designed for client-side use)
- Never use service role keys in frontend code
- Keep webhook URLs private to prevent abuse
