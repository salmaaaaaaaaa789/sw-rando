-- Admin Authentication System Test Script
-- This script demonstrates how to test the admin authentication system

-- Test 1: Verify RLS policies are working
-- This test should be run with different user contexts

-- Test as an admin user:
/*
BEGIN;
SET LOCAL role service_role;

-- Insert a test admin user (in auth.users and user_profiles)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('testpassword', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Insert corresponding profile
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'admin@test.com' LIMIT 1
)
INSERT INTO user_profiles (id, email, full_name, role)
SELECT id, 'admin@test.com', 'Test Admin', 'admin' FROM user_data;

RESET role;
COMMIT;
*/

-- Test 2: Test is_admin() function
-- This should return true for admin users and false for client users
-- Example query to test:
/*
SELECT public.is_admin() as is_current_user_admin;
*/

-- Test 3: Test admin-only operations
-- Try to insert a voyage as a client user - this should fail
-- Try to insert a voyage as an admin user - this should succeed
/*
-- As client user:
INSERT INTO voyages (title, description, duration_days, price, status)
VALUES ('Test Voyage', 'Test Description', 7, 1000.00, 'active');

-- As admin user:
SET LOCAL role service_role;
INSERT INTO voyages (title, description, duration_days, price, status, created_by)
VALUES ('Test Voyage', 'Test Description', 7, 1000.00, 'active', 
  (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1));
RESET role;
*/

-- Test 4: Test client-only operations
-- Verify that clients can view active voyages but not inactive ones
/*
-- This should work for both admin and client users:
SELECT * FROM voyages WHERE status = 'active';

-- This should only work for admin users:
SELECT * FROM voyages WHERE status = 'inactive';
*/

-- Test 5: Test check_admin_access function
-- This function should return admin status and user info
/*
SELECT * FROM public.check_admin_access();
*/

-- Test 6: Test set_user_role function (admin only)
-- This should only work when called by an admin user
/*
SELECT public.set_user_role(
  (SELECT id FROM user_profiles WHERE email = 'user@test.com' LIMIT 1), 
  'admin'
);
*/

-- Test 7: Verify user creation trigger works
-- When a new user signs up via Supabase Auth, they should automatically get a profile with role 'client'
/*
-- This happens automatically when users sign up via Supabase Auth
-- No manual action needed, but this verifies the trigger is working:
-- After a user signs up, check if they appear in user_profiles with role 'client'
SELECT * FROM user_profiles WHERE email = 'newuser@example.com';
*/

-- Test 8: Test dashboard summary function
-- This should return various counts for the admin dashboard
/*
SELECT * FROM public.get_admin_dashboard_summary();
*/

-- Test 9: Test admin promotion function
-- This should only work for admin users
/*
SELECT * FROM public.promote_to_admin('user@test.com');
*/

-- Test 10: Test admin demotion function
-- This should only work for admin users and not allow self-demotion
/*
SELECT * FROM public.demote_admin('admin@test.com');
*/

-- Test 11: Verification queries to test the complete system
-- Verify all tables have RLS enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'voyages', 'bookings', 'contact_requests', 'testimonials', 'blog_posts', 'voyage_reviews');

-- Verify policies exist for user_profiles
SELECT policyname, permissive, roles, cmd, qual FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Verify policies exist for voyages
SELECT policyname, permissive, roles, cmd, qual FROM pg_policies 
WHERE tablename = 'voyages';

-- Verify policies exist for bookings
SELECT policyname, permissive, roles, cmd, qual FROM pg_policies 
WHERE tablename = 'bookings';

-- Test the trigger exists
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';