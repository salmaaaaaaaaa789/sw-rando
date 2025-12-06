# Randopedia Travel - Complete Database Schema

## Overview
This repository contains the complete database schema for the Randopedia Travel web application. The schema includes all necessary tables with proper relationships, constraints, and Row-Level Security (RLS) policies for Supabase.

## Database Schema

### Tables Included

1. **user_profiles** - Extends Supabase's auth.users table with additional profile information and roles
2. **destinations** - Travel destinations available in the platform
3. **voyages** - Travel packages with detailed information
4. **contact_requests** - Contact form submissions from users
5. **bookings** - Trip bookings made by users
6. **testimonials** - User reviews and testimonials
7. **blog_posts** - Blog content for the platform
8. **voyage_reviews** - Detailed reviews for specific voyages
9. **voyage_images** - Multiple images per voyage
10. **booking_items** - Individual items within a booking (optional)

### User Roles
- `admin` - Full access to manage voyages, bookings, users, and content
- `client` - Standard user role for booking and reviewing travel packages

## Setting Up the Database

### Prerequisites
- A Supabase account and project
- Access to the SQL editor in your Supabase dashboard

### Installation Steps

1. Log in to your [Supabase dashboard](https://app.supabase.com)
2. Navigate to your project
3. Go to the SQL editor
4. Copy and paste the contents of `complete-database-schema.sql`
5. Execute the script to create all tables, indexes, and RLS policies

### Enabling Row Level Security

The schema includes comprehensive RLS policies that control access based on user roles. Make sure to enable RLS for all tables as defined in the schema.

## Features Implemented

### For Admins
- Full CRUD operations on voyages
- Management of bookings
- User management
- Content management (blog posts, testimonials)
- Review moderation

### For Clients
- View travel packages
- Submit contact requests
- Make bookings
- Leave reviews and testimonials
- View blog content

## API Usage Examples

### For React + Supabase Frontend

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all active voyages
const { data: voyages, error } = await supabase
  .from('voyages')
  .select('*')
  .eq('status', 'active');

// Create a new booking
const { data, error } = await supabase
  .from('bookings')
  .insert([{
    user_id: userId,
    voyage_id: voyageId,
    full_name: 'John Doe',
    email: 'john@example.com',
    // ... other fields
  }]);

// Submit a contact request
const { data, error } = await supabase
  .from('contact_requests')
  .insert([{
    name: 'John Doe',
    email: 'john@example.com',
    message: 'I''m interested in your travel packages',
    // ... other fields
  }]);

// Get testimonials
const { data: testimonials, error } = await supabase
  .from('testimonials')
  .select('*')
  .eq('verified', true);
```

## Triggers and Functions

The schema includes several triggers and functions to maintain data integrity:

1. **update_voyage_rating** - Automatically updates a voyage's average rating when reviews are added/modified
2. **generate_booking_reference** - Creates unique booking references for tracking
3. **update_available_seats** - Automatically manages seat availability based on bookings
4. **handle_new_user** - Creates user profiles when new users sign up

## Security Policies

The RLS policies ensure that:
- Users can only view and update their own profiles and bookings
- Admins can manage all content and data
- All users can view active voyages, published blog posts, and testimonials
- Contact requests can be submitted by anyone but viewed/managed by authorized users only

## Sample Data

The `sample-data.sql` file provides examples of how to populate the database with initial data for testing purposes.

## Additional Notes

- The schema uses UUIDs for all primary keys for better security and scalability
- Array columns are used for features like image galleries and tags
- JSONB is used for complex data structures like itineraries
- Proper indexing is implemented for optimized queries
- Foreign key constraints ensure data integrity between related tables

## Updating the Schema

If you make changes to the schema, be sure to update the RLS policies accordingly and test all functionality to ensure the security policies still work as intended.