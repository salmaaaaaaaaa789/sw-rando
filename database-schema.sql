-- contact_requests table schema
-- This table stores contact form submissions from users

CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  travel_type VARCHAR(50) NOT NULL,
  destination VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Optional: Add constraint to prevent spam (limit submissions per email per day)
  -- CONSTRAINT unique_email_daily UNIQUE (email, DATE(created_at))
);

-- bookings table schema
-- This table stores trip bookings from users

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voyage_id UUID NOT NULL,  -- Reference to voyages table (if you have one)
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  participants INTEGER NOT NULL,
  travel_date DATE NOT NULL,
  special_requests TEXT,
  payment_method VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create indexes for better query performance
CREATE INDEX idx_contact_requests_created_at ON contact_requests (created_at);
CREATE INDEX idx_contact_requests_email ON contact_requests (email);
CREATE INDEX idx_bookings_email ON bookings (email);
CREATE INDEX idx_bookings_travel_date ON bookings (travel_date);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_created_at ON bookings (created_at);