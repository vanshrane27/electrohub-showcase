# Production Deployment Checklist

Use this checklist before deploying to production on Vercel.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production code (console.warn/error are OK for error handling)
- [ ] All environment variables are in `.env.example` (without actual values)
- [ ] `.env` is in `.gitignore`
- [ ] No hardcoded API keys or secrets
- [ ] All dependencies are in `package.json`

### Build Verification
- [ ] `npm run build` completes successfully locally
- [ ] Build output is in `dist/` directory
- [ ] No build warnings or errors
- [ ] All assets are properly bundled

### Configuration Files
- [ ] `vercel.json` is configured correctly
- [ ] `package.json` has correct build scripts
- [ ] `vite.config.ts` is production-ready
- [ ] `.env.example` exists with all required variables

## Environment Variables

### Required Variables (Set in Vercel Dashboard)
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_N8N_WEBHOOK_URL`

### Verification
- [ ] All variables are set in Vercel dashboard
- [ ] Variables are scoped correctly (Production/Preview/Development)
- [ ] No variables are exposed in client-side code (except VITE_ prefixed ones)

## Database & Backend

### Supabase
- [ ] All migrations have been run
- [ ] RLS policies are configured correctly
- [ ] Tables exist: `warranties`, `contact_forms`
- [ ] Retell AI tracking columns exist
- [ ] Test data can be inserted/read

### N8N Workflow
- [ ] Workflow is active and tested
- [ ] Webhook URL is correct
- [ ] Retell AI credentials are configured in n8n

## Functionality Testing

### Contact Form
- [ ] Form submission works
- [ ] Data is saved to Supabase
- [ ] N8N webhook is triggered
- [ ] Error handling works correctly
- [ ] User sees success/error messages

### Warranty Registration
- [ ] Warranty registration works
- [ ] Data is saved to Supabase
- [ ] No webhook is triggered (as intended)

### Warranty Check
- [ ] Warranty lookup works
- [ ] Valid warranties show correct status
- [ ] Invalid serial numbers show error

### Support Dashboard
- [ ] Dashboard loads correctly
- [ ] Data is fetched from Supabase
- [ ] All tabs work (Warranties, Contact Forms, Dealers)

## Security

- [ ] Environment variables are not exposed in client bundle
- [ ] API keys are secure
- [ ] CORS is configured correctly (if needed)
- [ ] RLS policies prevent unauthorized access
- [ ] No sensitive data in console logs

## Performance

- [ ] Build size is reasonable
- [ ] Assets are optimized
- [ ] Images are compressed (if any)
- [ ] Code splitting is working
- [ ] Lazy loading is implemented (if applicable)

## Post-Deployment

### Immediate Checks
- [ ] Site loads correctly
- [ ] No console errors in browser
- [ ] All routes work (no 404s)
- [ ] Forms submit successfully
- [ ] Database connections work

### Integration Testing
- [ ] Contact form → Supabase → N8N webhook flow works
- [ ] Retell AI calls are initiated (if configured)
- [ ] Support Dashboard shows data correctly

### Monitoring
- [ ] Vercel analytics enabled (optional)
- [ ] Error tracking set up (optional)
- [ ] Performance monitoring (optional)

## Rollback Plan

- [ ] Know how to rollback in Vercel dashboard
- [ ] Previous working deployment is identified
- [ ] Database migrations can be rolled back if needed

## Documentation

- [ ] `VERCEL_DEPLOYMENT.md` is up to date
- [ ] Environment variables are documented
- [ ] API endpoints are documented
- [ ] Deployment process is documented

## Final Steps

1. Deploy to Vercel
2. Test all functionality on production URL
3. Monitor for errors for 24-48 hours
4. Set up alerts/notifications (optional)

---

**Note**: Keep this checklist updated as the project evolves.
