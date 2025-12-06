# Vercel Deployment Guide

This guide will help you deploy the ElectroHub Showcase application to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket repository with your code
- Supabase project configured
- N8N workflow set up

## Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to your repository
2. Verify `.env` is in `.gitignore` (it should be)
3. Make sure `vercel.json` is in the root directory

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite configuration
5. Configure environment variables (see Step 3)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Environment Variables

```
VITE_SUPABASE_PROJECT_ID=geodnjfvhzumbevtezvl
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=https://geodnjfvhzumbevtezvl.supabase.co
VITE_N8N_WEBHOOK_URL=https://vansh555.app.n8n.cloud/webhook/contact-form-submission
```

### Environment Variable Settings

- **Environment**: Select "Production", "Preview", and "Development" (or just Production)
- **Apply to**: All environments

## Step 4: Verify Build Settings

Vercel should auto-detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, verify `vercel.json` is correct.

## Step 5: Post-Deployment Checklist

### ✅ Database Setup
- [ ] Run all Supabase migrations
- [ ] Verify RLS policies are configured
- [ ] Test database connections

### ✅ Functionality Testing
- [ ] Test contact form submission
- [ ] Verify Supabase data storage
- [ ] Test n8n webhook trigger
- [ ] Verify Retell AI integration (if configured)
- [ ] Test warranty registration
- [ ] Test warranty check functionality

### ✅ Performance
- [ ] Check build output size
- [ ] Verify asset caching headers
- [ ] Test page load times

### ✅ Security
- [ ] Verify environment variables are set (not exposed in code)
- [ ] Check CORS settings if needed
- [ ] Verify API keys are secure

## Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version is compatible (Vercel uses Node 18+ by default)
4. Check for TypeScript errors: `npm run build` locally

### Environment Variables Not Working

1. Verify variables are set in Vercel dashboard
2. Ensure variable names start with `VITE_` for Vite
3. Redeploy after adding new variables
4. Check variable scope (Production/Preview/Development)

### 404 Errors on Routes

- This is normal for SPAs - Vercel should handle this with the `rewrites` in `vercel.json`
- If issues persist, verify `vercel.json` configuration

### API/Webhook Issues

1. Verify webhook URL is correct
2. Check CORS settings if making cross-origin requests
3. Verify Supabase RLS policies allow public access
4. Check browser console for errors

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider adding Sentry or similar
- **Performance**: Use Vercel Speed Insights

## Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch → Production
- Push to other branches → Preview deployment
- Pull requests → Preview deployment

## Rollback

If something goes wrong:
1. Go to Deployments tab
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
