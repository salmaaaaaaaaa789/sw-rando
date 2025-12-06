-- Complete Database Schema for Randopedia Travel Web Application
-- This schema includes all necessary tables with proper relationships and Supabase RLS policies

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (extends Supabase auth.users)
-- Note: Supabase automatically creates auth.users, we'll create a profile table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on role for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Update user_profiles when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Destinations Table
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Voyages Table (Travel Packages)
CREATE TABLE voyages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2), -- Optional discounted price
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs for gallery
  highlights TEXT[], -- Array of highlights/features
  itinerary JSONB, -- Detailed itinerary as JSON
  availability_dates DATE[], -- Array of available travel dates
  max_participants INTEGER DEFAULT 100,
  available_seats INTEGER DEFAULT 100,
  rating DECIMAL(3, 2) DEFAULT 0.00, -- Average rating (0.00 to 5.00)
  reviews_count INTEGER DEFAULT 0,
  category VARCHAR(100), -- Adventure, Cultural, Luxury, etc.
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, sold_out
  created_by UUID REFERENCES auth.users(id), -- Admin who created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contact Requests Table (from existing schema)
-- Modified to include user reference
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  travel_type VARCHAR(50) NOT NULL,
  destination VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id), -- Optional: link to logged in user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bookings Table (from existing schema)
-- Modified to link to user_profiles
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Link to user who made booking
  voyage_id UUID NOT NULL REFERENCES voyages(id),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  participants INTEGER NOT NULL,
  travel_date DATE NOT NULL,
  special_requests TEXT,
  payment_method VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, refunded, failed
  booking_reference VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- User who provided testimonial
  voyage_id UUID REFERENCES voyages(id), -- Optional: linked to specific voyage
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255), -- Optional: if testimonial is from non-logged user
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  verified BOOLEAN DEFAULT FALSE, -- Whether booking was verified
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Blog Posts Table (optional)
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE, -- URL-friendly version of title
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id), -- User who wrote the post
  author_name VARCHAR(255), -- Name to display if author is not a registered user
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- Array of tags
  read_time_minutes INTEGER, -- Estimated reading time
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Voyage Reviews Table (for managing voyage ratings)
CREATE TABLE voyage_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voyage_id UUID NOT NULL REFERENCES voyages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  verified_booking BOOLEAN DEFAULT FALSE, -- Whether user actually booked this voyage
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate reviews from same user for same voyage
  UNIQUE(voyage_id, user_id)
);

-- 9. Booking Items Table (for multiple items in a single booking - optional)
CREATE TABLE booking_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  voyage_id UUID NOT NULL REFERENCES voyages(id),
  participants_count INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Voyage Images (for multiple images per voyage - optional)
CREATE TABLE voyage_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voyage_id UUID NOT NULL REFERENCES voyages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_voyages_destination ON voyages(destination_id);
CREATE INDEX idx_voyages_category ON voyages(category);
CREATE INDEX idx_voyages_featured ON voyages(featured);
CREATE INDEX idx_voyages_status ON voyages(status);
CREATE INDEX idx_voyages_price ON voyages(price);
CREATE INDEX idx_voyages_created_by ON voyages(created_by);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_voyage_id ON bookings(voyage_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX idx_testimonials_voyage_id ON testimonials(voyage_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_voyage_reviews_voyage_id ON voyage_reviews(voyage_id);
CREATE INDEX idx_voyage_reviews_user_id ON voyage_reviews(user_id);
CREATE INDEX idx_voyage_images_voyage_id ON voyage_images(voyage_id);

-- Create Row Level Security (RLS) Policies
-- User Profiles RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Admin can manage all profiles" ON user_profiles
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Destinations RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view destinations" ON destinations
  FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Admin can manage destinations" ON destinations
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Voyages RLS
ALTER TABLE voyages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view active voyages" ON voyages
  FOR SELECT TO authenticated, anon
    USING (status = 'active');

CREATE POLICY "Admin can manage voyages" ON voyages
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Contact Requests RLS
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

-- Bookings RLS
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

-- Testimonials RLS
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

-- Blog Posts RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view published blog posts" ON blog_posts
  FOR SELECT TO authenticated, anon
    USING (published = true);

CREATE POLICY "Admin can manage blog posts" ON blog_posts
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Voyage Reviews RLS
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

-- Voyage Images RLS
ALTER TABLE voyage_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view voyage images" ON voyage_images
  FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Admin can manage voyage images" ON voyage_images
  FOR ALL TO authenticated
    USING (
      (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
    );

-- Create function to update voyage rating when reviews are added/deleted
CREATE OR REPLACE FUNCTION update_voyage_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- Update voyage's average rating and review count
    UPDATE voyages 
    SET 
      rating = (
        SELECT AVG(rating)::DECIMAL(3,2) 
        FROM voyage_reviews 
        WHERE voyage_id = NEW.voyage_id
      ),
      reviews_count = (
        SELECT COUNT(*) 
        FROM voyage_reviews 
        WHERE voyage_id = NEW.voyage_id
      )
    WHERE id = NEW.voyage_id;
    
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    -- Update voyage's average rating and review count after deletion
    UPDATE voyages 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating), 0.00)::DECIMAL(3,2) 
        FROM voyage_reviews 
        WHERE voyage_id = OLD.voyage_id
      ),
      reviews_count = (
        SELECT COUNT(*) 
        FROM voyage_reviews 
        WHERE voyage_id = OLD.voyage_id
      )
    WHERE id = OLD.voyage_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for voyage rating updates
CREATE TRIGGER update_voyage_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON voyage_reviews
  FOR EACH ROW EXECUTE FUNCTION update_voyage_rating();

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  reference VARCHAR(50);
BEGIN
  -- Generate a unique booking reference
  LOOP
    reference := UPPER('BKG' || EXTRACT(EPOCH FROM NOW())::TEXT || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'));
    IF NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = reference) THEN
      EXIT;
    END IF;
  END LOOP;
  
  NEW.booking_reference := reference;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking reference generation
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

-- Create function to update available seats when bookings change
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Decrease available seats when a booking is made
    UPDATE voyages 
    SET available_seats = available_seats - NEW.participants
    WHERE id = NEW.voyage_id AND status != 'sold_out';
    
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Adjust available seats if participants count changes
    IF OLD.participants != NEW.participants THEN
      UPDATE voyages 
      SET available_seats = available_seats + OLD.participants - NEW.participants
      WHERE id = NEW.voyage_id;
    END IF;
    
  ELSIF (TG_OP = 'DELETE') THEN
    -- Increase available seats when a booking is cancelled
    UPDATE voyages 
    SET available_seats = available_seats + OLD.participants
    WHERE id = OLD.voyage_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating available seats
CREATE TRIGGER update_available_seats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_available_seats();

-- Insert an admin user example (you would typically do this through Supabase UI)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
-- VALUES (
--   gen_random_uuid(), 
--   'admin@randopedia.com', 
--   crypt('your_secure_password', gen_salt('bf')), 
--   NOW()
-- );
-- 
-- INSERT INTO user_profiles (id, email, full_name, role)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@randopedia.com'),
--   'admin@randopedia.com',
--   'Admin User',
--   'admin'
-- );