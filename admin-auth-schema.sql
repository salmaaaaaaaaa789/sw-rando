-- Complete Admin Authentication System for Supabase Backend
-- This system integrates with Supabase Auth and enforces role-based access control

-- Create the custom users table that extends Supabase Auth
-- Note: Supabase Auth already creates auth.users, so we create a profile table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Update the existing handle_new_user function to work with the new structure
-- This function ensures when a user signs up via Supabase Auth, 
-- a profile is automatically created with default role 'client'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown'),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON user_profiles
  FOR SELECT TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admin can update profiles" ON user_profiles
  FOR UPDATE TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    )
    WITH CHECK (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admin can delete profiles" ON user_profiles
  FOR DELETE TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply RLS to other tables to enforce admin-only access where needed
-- Apply to voyages table (from your existing schema)
ALTER TABLE voyages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active voyages" ON voyages
  FOR SELECT TO authenticated, anon
    USING (status = 'active');

CREATE POLICY "Admin can manage voyages" ON voyages
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply to bookings table (from your existing schema)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE TO authenticated
    USING (auth.uid() = user_id OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can manage all bookings" ON bookings
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply to contact_requests table (from your existing schema)
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert contact requests" ON contact_requests
  FOR INSERT TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can select own contact requests" ON contact_requests
  FOR SELECT TO authenticated
    USING (
      auth.uid() = user_id OR 
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admin can manage all contact requests" ON contact_requests
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply to testimonials table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view testimonials" ON testimonials
  FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create testimonials" ON testimonials
  FOR INSERT TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can update own testimonials" ON testimonials
  FOR UPDATE TO authenticated
    USING (
      auth.uid() = user_id OR 
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admin can manage all testimonials" ON testimonials
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply to blog_posts table
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view published blog posts" ON blog_posts
  FOR SELECT TO authenticated, anon
    USING (published = true);

CREATE POLICY "Admin can manage blog posts" ON blog_posts
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Apply to voyage_reviews table
ALTER TABLE voyage_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view voyage reviews" ON voyage_reviews
  FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Users can create own reviews" ON voyage_reviews
  FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON voyage_reviews
  FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON voyage_reviews
  FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all reviews" ON voyage_reviews
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create a function to upgrade a user to admin role (admin only)
CREATE OR REPLACE FUNCTION public.set_user_role(p_user_id UUID, p_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  -- Validate role
  IF p_role NOT IN ('admin', 'client') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;
  
  -- Update the role
  UPDATE user_profiles 
  SET role = p_role 
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to verify admin access that can be used in stored procedures
CREATE OR REPLACE FUNCTION public.require_admin()
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function for admin authentication check
-- This can be used in application code to verify admin status
CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS TABLE(is_admin BOOLEAN, user_id UUID, email TEXT, full_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT role = 'admin' FROM user_profiles WHERE id = auth.uid()) as is_admin,
    auth.uid() as user_id,
    (SELECT email FROM user_profiles WHERE id = auth.uid()) as email,
    (SELECT full_name FROM user_profiles WHERE id = auth.uid()) as full_name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create a function to create a new admin (only callable by existing admin)
CREATE OR REPLACE FUNCTION public.create_admin_user(
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_auth_user_id UUID;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can create new admin users';
  END IF;
  
  -- Check if user already exists
  SELECT id INTO v_auth_user_id FROM auth.users WHERE email = p_email;
  
  -- If user doesn't exist in auth, we can't create an admin for them
  -- This function assumes the user already exists in auth
  IF v_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'User does not exist in auth system';
  END IF;
  
  -- Update the user's profile to be an admin
  UPDATE user_profiles 
  SET role = 'admin'
  WHERE id = v_auth_user_id;
  
  RETURN v_auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Insert an initial admin user (uncomment and customize for your first admin)
-- This would typically be done via Supabase dashboard or a one-time script
/*
INSERT INTO user_profiles (id, email, full_name, role)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'),
  'your-admin-email@example.com',
  'Admin User',
  'admin'
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'your-admin-email@example.com')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- Add comments to document the functions
COMMENT ON FUNCTION public.is_admin() IS 'Check if the current user is an admin';
COMMENT ON FUNCTION public.set_user_role(UUID, TEXT) IS 'Set user role - admin only';
COMMENT ON FUNCTION public.require_admin() IS 'Require admin access - throws exception if not admin';
COMMENT ON FUNCTION public.check_admin_access() IS 'Check admin status and return user info';
COMMENT ON FUNCTION public.create_admin_user(TEXT, TEXT) IS 'Create new admin user - admin only';