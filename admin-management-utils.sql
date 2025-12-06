-- Admin User Management Utilities for Randopedia Travel

-- 1. Function to list all admins
CREATE OR REPLACE FUNCTION public.get_all_admins()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id as user_id,
    up.email,
    up.full_name,
    up.created_at
  FROM user_profiles up
  WHERE up.role = 'admin'
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to list all users (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    up.id as user_id,
    up.email,
    up.full_name,
    up.role,
    up.created_at
  FROM user_profiles up
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function to promote a user to admin (admin only)
CREATE OR REPLACE FUNCTION public.promote_to_admin(p_user_email TEXT)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  user_id UUID
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RETURN QUERY
    SELECT false, 'Admin access required', NULL::UUID;
    RETURN;
  END IF;
  
  -- Get user ID
  SELECT id INTO v_user_id FROM user_profiles WHERE email = p_user_email;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY
    SELECT false, 'User not found', NULL::UUID;
    RETURN;
  END IF;
  
  -- Update role to admin
  UPDATE user_profiles 
  SET role = 'admin'
  WHERE id = v_user_id;
  
  RETURN QUERY
  SELECT true, 'User promoted to admin successfully', v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Function to demote an admin to client (admin only, but not self-demotion)
CREATE OR REPLACE FUNCTION public.demote_admin(p_user_email TEXT)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  user_id UUID
) AS $$
DECLARE
  v_user_id UUID;
  v_current_user_id UUID;
BEGIN
  -- Check if the current user is an admin
  v_current_user_id := auth.uid();
  IF NOT is_admin() THEN
    RETURN QUERY
    SELECT false, 'Admin access required', NULL::UUID;
    RETURN;
  END IF;
  
  -- Prevent self demotion
  SELECT id INTO v_user_id FROM user_profiles WHERE email = p_user_email;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY
    SELECT false, 'User not found', NULL::UUID;
    RETURN;
  END IF;
  
  IF v_user_id = v_current_user_id THEN
    RETURN QUERY
    SELECT false, 'Cannot demote yourself', NULL::UUID;
    RETURN;
  END IF;
  
  -- Update role to client
  UPDATE user_profiles 
  SET role = 'client'
  WHERE id = v_user_email;
  
  RETURN QUERY
  SELECT true, 'Admin demoted to client successfully', v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function to check if email already exists
CREATE OR REPLACE FUNCTION public.email_exists(p_email TEXT)
RETURNS TABLE(exists BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = p_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to create a new user account and assign role (admin only)
-- Note: For security, it's better to have users sign up normally and then set their role
CREATE OR REPLACE FUNCTION public.invite_user(p_email TEXT, p_role TEXT DEFAULT 'client')
RETURNS TABLE(
  success BOOLEAN,
  message TEXT
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RETURN QUERY
    SELECT false, 'Admin access required';
    RETURN;
  END IF;
  
  -- Validate role
  IF p_role NOT IN ('admin', 'client') THEN
    RETURN QUERY
    SELECT false, 'Invalid role. Use "admin" or "client"';
    RETURN;
  END IF;
  
  -- Check if user already exists
  IF (SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = p_email)) THEN
    RETURN QUERY
    SELECT false, 'User already exists';
    RETURN;
  END IF;
  
  -- In a real implementation, you would send an invitation email
  -- For now, we'll just validate that the admin has the right to invite
  -- The actual user creation happens through Supabase Auth
  
  RETURN QUERY
  SELECT true, 'User can be invited. Have them sign up with the provided email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function to get admin dashboard summary
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_summary()
RETURNS TABLE(
  total_users BIGINT,
  total_admins BIGINT,
  total_voyages BIGINT,
  total_bookings BIGINT,
  pending_bookings BIGINT,
  total_contact_requests BIGINT,
  new_contact_requests BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM user_profiles) AS total_users,
    (SELECT COUNT(*) FROM user_profiles WHERE role = 'admin') AS total_admins,
    (SELECT COUNT(*) FROM voyages) AS total_voyages,
    (SELECT COUNT(*) FROM bookings) AS total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'pending') AS pending_bookings,
    (SELECT COUNT(*) FROM contact_requests) AS total_contact_requests,
    (SELECT COUNT(*) FROM contact_requests WHERE created_at > NOW() - INTERVAL '7 days') AS new_contact_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant necessary permissions to the new functions
GRANT EXECUTE ON FUNCTION public.get_all_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.demote_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.email_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.invite_user(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_summary() TO authenticated;

-- 9. Example: Create an initial admin user (uncomment and customize for your first admin)
-- This should be run once after the schema is in place:
/*
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find the user in auth table
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'admin@randopedia.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Update their profile to be an admin
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (v_user_id, 'admin@randopedia.com', 'Admin User', 'admin')
    ON CONFLICT (id) 
    DO UPDATE SET role = 'admin', updated_at = NOW();
  END IF;
END $$;
*/

-- 10. Create an index to speed up role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_active 
ON user_profiles(role) 
WHERE role = 'admin';

-- 11. Create a function to authenticate admin with additional verification
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  user_id UUID,
  email TEXT,
  full_name TEXT
) AS $$
DECLARE
  v_user_id UUID;
  v_full_name TEXT;
  v_role TEXT;
BEGIN
  -- This function demonstrates how you might authenticate an admin
  -- In practice, you'd use Supabase's built-in auth (signInWithPassword)
  -- and then verify the role after authentication
  
  -- Find user in profiles
  SELECT up.id, up.full_name, up.role 
  INTO v_user_id, v_full_name, v_role
  FROM user_profiles up
  WHERE up.email = p_email;
  
  -- Note: Password verification should happen through Supabase Auth
  -- This is just for demonstration of the role check after auth
  IF v_user_id IS NULL THEN
    RETURN QUERY
    SELECT false, 'Invalid credentials', NULL::UUID, NULL::TEXT, NULL::TEXT;
    RETURN;
  END IF;
  
  IF v_role != 'admin' THEN
    RETURN QUERY
    SELECT false, 'Admin access required', NULL::UUID, NULL::TEXT, NULL::TEXT;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT true, 'Admin authenticated', v_user_id, p_email, v_full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.authenticate_admin(TEXT, TEXT) TO authenticated;