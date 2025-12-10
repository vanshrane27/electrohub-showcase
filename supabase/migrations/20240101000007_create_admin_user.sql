-- Create default admin user
-- This script helps you set up an admin user
-- 
-- IMPORTANT: Supabase requires email format for authentication
-- We'll use: admin@admin.com (you can change this)
-- Password: admin
--
-- Option 1: Create user via Supabase Dashboard (RECOMMENDED)
-- 1. Go to Authentication → Users → Add User
-- 2. Email: admin@admin.com
-- 3. Password: admin
-- 4. Auto Confirm User: Yes
-- 5. Then run the SQL below to set as admin

-- Option 2: After creating user via dashboard, set as admin:
UPDATE public.user_profiles 
SET is_admin = TRUE,
    updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@admin.com');

-- If user profile doesn't exist yet, create it:
INSERT INTO public.user_profiles (id, full_name, is_admin, created_at, updated_at)
SELECT id, 'Admin User', TRUE, NOW(), NOW()
FROM auth.users
WHERE email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = TRUE,
    updated_at = NOW();
