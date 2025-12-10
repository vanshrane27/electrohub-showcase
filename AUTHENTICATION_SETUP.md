# Supabase Authentication Setup Guide

This guide explains how authentication is integrated with Supabase in the ElectroHub Showcase application.

## What Was Implemented

### 1. **Supabase Authentication Integration**
   - Replaced mock authentication with real Supabase auth
   - User registration with email/password
   - User login with email/password
   - Password reset functionality
   - Session persistence
   - Automatic profile creation on signup

### 2. **User Profiles Table**
   - Created `user_profiles` table to store additional user information
   - Automatically creates profile when user signs up (via database trigger)
   - Stores: full_name, phone, is_admin flag
   - Linked to Supabase auth.users via foreign key

### 3. **Updated Components**
   - `AuthContext.tsx` - Now uses Supabase auth
   - `Login.tsx` - Updated to work with Supabase
   - `Navbar.tsx` - Already compatible (no changes needed)

## Database Setup

### Step 1: Run Migration

Run the migration file in your Supabase SQL Editor:

```sql
-- File: supabase/migrations/20240101000006_create_user_profiles.sql
```

This will:
- Create `user_profiles` table
- Set up RLS policies
- Create trigger to auto-create profiles on signup
- Create indexes for performance

### Step 2: Configure Supabase Auth Settings

1. Go to Supabase Dashboard → Authentication → Settings

2. **Email Auth Settings:**
   - Enable "Enable email confirmations" (optional, recommended for production)
   - Set "Site URL" to your production URL (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs for password reset:
     - `https://your-app.vercel.app/reset-password`
     - `http://localhost:8080/reset-password` (for development)

3. **Email Templates:**
   - Customize email templates if needed
   - Default templates work fine

## Features

### Registration
- Users can register with email and password
- Full name is stored in user profile
- Profile is automatically created via database trigger
- Email confirmation can be enabled (optional)

### Login
- Users can login with email and password
- Session is persisted automatically
- User profile is loaded on login

### Password Reset
- Users can request password reset
- Email is sent with reset link
- Link redirects to `/reset-password` (you may want to create this page)

### User Profile
- Stored in `user_profiles` table
- Automatically synced with auth state
- Can be updated via `updateProfile()` function

### Admin Access
- Set `is_admin = true` in `user_profiles` table to grant admin access
- Admin users see "Admin" button in navbar
- Admin users are redirected to `/admin` after login

## Usage in Code

### Check Authentication Status
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Login
```typescript
const { login } = useAuth();
const result = await login(email, password);
if (result.success) {
  // User is logged in
} else {
  // Show error: result.error
}
```

### Register
```typescript
const { register } = useAuth();
const result = await register(name, email, password);
if (result.success) {
  // User is registered and logged in
} else {
  // Show error: result.error
}
```

### Logout
```typescript
const { logout } = useAuth();
await logout(); // Clears session
```

### Update Profile
```typescript
const { updateProfile } = useAuth();
await updateProfile({ name: 'New Name', phone: '+1234567890' });
```

### Reset Password
```typescript
const { resetPassword } = useAuth();
const result = await resetPassword(email);
if (result.success) {
  // Email sent
}
```

## Security Notes

1. **RLS Policies**: User profiles are protected by Row Level Security
   - Users can only view/update their own profile
   - Admins can be granted additional access if needed

2. **Password Requirements**: 
   - Minimum 6 characters (enforced in frontend)
   - Supabase handles password hashing automatically

3. **Session Management**:
   - Sessions are stored in localStorage
   - Automatically refreshed by Supabase
   - Sessions persist across page refreshes

## Default Admin User

A default admin user is created via migration:

**Credentials:**
- Email: `admin@admin.com`
- Password: `admin`

**To set up:**
1. Run the migration: `supabase/migrations/20240101000007_create_admin_user.sql`
2. Or manually create user in Supabase Dashboard and set `is_admin = true`

**⚠️ IMPORTANT:** Change the admin password after first login in production!

## Making a User Admin

To grant admin access to a user:

1. Go to Supabase Dashboard → Table Editor → `user_profiles`
2. Find the user by their `id` (matches auth.users id)
3. Set `is_admin` to `true`
4. User will have admin access on next login

Or via SQL:
```sql
UPDATE user_profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';
```

## Testing

1. **Register a new user:**
   - Go to `/login`
   - Click "Sign Up"
   - Enter name, email, and password
   - Submit form

2. **Login:**
   - Enter email and password
   - Should redirect to `/dashboard`

3. **Check profile:**
   - Profile should be created automatically
   - Check `user_profiles` table in Supabase

4. **Password reset:**
   - Click "Forgot password?" on login page
   - Enter email
   - Check email for reset link

## Troubleshooting

### "User profile not found" error
- Check if migration was run
- Verify trigger is created
- Check if profile was created in `user_profiles` table

### "Email already registered"
- User already exists in auth.users
- They should login instead of registering

### Password reset email not received
- Check Supabase email settings
- Verify redirect URL is configured
- Check spam folder
- Ensure email service is configured in Supabase

### Session not persisting
- Check browser localStorage
- Verify Supabase client configuration
- Check if cookies are enabled

## Next Steps (Optional)

1. **Create Reset Password Page**: Create `/reset-password` route to handle password reset
2. **Email Verification**: Enable email confirmation for new registrations
3. **Social Auth**: Add Google/GitHub login (Supabase supports this)
4. **Profile Page**: Create user profile page to update information
5. **Admin Management**: Create admin panel to manage users
