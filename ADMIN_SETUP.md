# Admin User Setup Guide

This guide explains how to set up the default admin user for accessing the admin dashboard.

## Default Admin Credentials

- **Email**: `admin@admin.com`
- **Password**: `admin`

⚠️ **IMPORTANT**: Change this password immediately after first login in production!

## Setup Instructions

### Method 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **Users**

2. **Create New User**
   - Click **"Add User"** or **"Invite User"**
   - Enter the following:
     - **Email**: `admin@admin.com`
     - **Password**: `admin`
     - **Auto Confirm User**: ✅ Yes (check this box)
   - Click **"Create User"**

3. **Set User as Admin**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this SQL:
   ```sql
   UPDATE public.user_profiles 
   SET is_admin = TRUE,
       updated_at = NOW()
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@admin.com');
   ```

4. **Verify Admin Status**
   - Go to **Table Editor** → `user_profiles`
   - Find the user with email `admin@admin.com`
   - Verify `is_admin` is set to `true`

### Method 2: Via SQL Migration

1. **Create the user first** (via Dashboard as in Method 1, step 2)

2. **Run the migration**:
   - Go to **SQL Editor**
   - Run: `supabase/migrations/20240101000007_create_admin_user.sql`

## Login

1. Go to `/login` page
2. Enter:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Click **"Sign In"**
4. You should be redirected to `/admin` dashboard

## Changing Admin Password

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Find `admin@admin.com`
3. Click on the user
4. Click **"Reset Password"** or **"Update Password"**
5. Set new password

### Via Application (After Login):
1. Login as admin
2. Go to profile/settings page (if available)
3. Change password

## Creating Additional Admin Users

To make any existing user an admin:

```sql
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

Or via Dashboard:
1. Go to **Table Editor** → `user_profiles`
2. Find the user
3. Set `is_admin` to `true`
4. Save

## Troubleshooting

### "User not found" error
- Make sure user was created in Supabase Authentication
- Check email is correct: `admin@admin.com`

### "Not an admin" after login
- Verify `is_admin = true` in `user_profiles` table
- User ID in `user_profiles` must match `auth.users.id`
- Try logging out and logging back in

### Can't create user via Dashboard
- Check if email is already registered
- Try using a different email format
- Check Supabase project settings

### Profile not created automatically
- Check if trigger `on_auth_user_created` exists
- Run migration `20240101000006_create_user_profiles.sql` again
- Manually create profile:
  ```sql
  INSERT INTO public.user_profiles (id, full_name, is_admin)
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@admin.com'),
    'Admin User',
    TRUE
  );
  ```

## Security Best Practices

1. **Change Default Password**: Immediately change `admin` password after setup
2. **Use Strong Password**: Minimum 12 characters, mix of letters, numbers, symbols
3. **Enable 2FA**: Consider enabling two-factor authentication for admin accounts
4. **Limit Admin Access**: Only grant admin to trusted users
5. **Monitor Admin Activity**: Regularly check admin user activity
6. **Use Environment-Specific Accounts**: Different admin accounts for dev/staging/prod

## Production Checklist

- [ ] Admin user created
- [ ] Admin password changed from default
- [ ] Admin access verified
- [ ] Default admin credentials removed from documentation
- [ ] Additional admin users created (if needed)
- [ ] Admin activity monitoring set up
