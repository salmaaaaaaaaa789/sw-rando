# Database Schema Comparison: Randopedia Travel Application

## Overview
This document compares your existing database schema with the new comprehensive schema for the Randopedia Travel application.

## Existing Schema (database-schema.sql)
Your current schema includes:
- `contact_requests` table
- `bookings` table
- Basic indexes

## New Complete Schema (complete-database-schema.sql)
The new schema adds:

### 1. Complete User Management
- **user_profiles** table (extends Supabase auth.users)
- Role-based access (admin/client)
- Profile management with triggers

### 2. Destination Management
- **destinations** table for travel locations
- Support for country, region, and description
- Featured destinations functionality

### 3. Enhanced Voyage System
- **voyages** table with complete travel package information
- Pricing with optional discount
- Duration, capacity, and availability tracking
- Gallery support with multiple images
- Category and feature flags
- Status management (active, inactive, sold_out)

### 4. Improved Contact and Booking System
- Enhanced **contact_requests** with user references
- Enhanced **bookings** with payment status, references, and seat management
- **booking_items** for complex bookings

### 5. Content Management
- **testimonials** table for user reviews
- **blog_posts** table for content marketing
- **voyage_reviews** for detailed ratings

### 6. Media Management
- **voyage_images** for multiple images per voyage
- Gallery support with primary images and sorting

## Key Improvements

### 1. Relationships and Foreign Keys
- Proper foreign key constraints between tables
- Referential integrity
- Cascade operations where appropriate

### 2. Row Level Security (RLS)
- Comprehensive RLS policies for all tables
- Role-based access control
- Secure user data isolation

### 3. Data Integrity
- Check constraints (rating values, status values)
- Unique constraints (booking references)
- Triggers for maintaining consistency
  - Voyage rating updates based on reviews
  - Available seat management based on bookings
  - Automatic booking reference generation

### 4. Performance Optimization
- Strategic indexes on frequently queried columns
- Optimized queries through proper schema design

### 5. Enhanced Functionality
- Voyage availability and seat management
- Automated rating calculations
- Complex data structures (itineraries as JSONB)
- Array support for tags, highlights, and galleries

## Migration Steps

If migrating from the existing schema:

1. **Backup your current data** before making any changes
2. **Run the complete-database-schema.sql** script
3. **Update your application code** to use the new table structures
4. **Test all functionality** to ensure compatibility
5. **Consider data migration** from old tables if you have existing records

## API Integration

The new schema supports the complete feature set you requested:

- Admin functions: Full CRUD on voyages, bookings, and users
- User functions: View packages, submit contact requests, make bookings
- Homepage: Destinations, testimonials, and blog posts
- Security: Proper RLS ensuring users only access authorized data

## Example Queries

### Get featured voyages with destination info:
```sql
SELECT v.*, d.name as destination_name, d.country
FROM voyages v
JOIN destinations d ON v.destination_id = d.id
WHERE v.featured = true AND v.status = 'active';
```

### Get voyage with reviews and average rating:
```sql
SELECT v.*, v.rating as average_rating, v.reviews_count,
       json_agg(r) as reviews
FROM voyages v
LEFT JOIN voyage_reviews r ON v.id = r.voyage_id
WHERE v.id = $1
GROUP BY v.id;
```

### Check voyage availability:
```sql
SELECT id, title, available_seats, 
       CASE WHEN available_seats <= 0 THEN 'sold_out' 
            ELSE status END as status
FROM voyages 
WHERE id = $1;
```

## Conclusion

The new complete schema significantly expands the functionality of your travel application while maintaining tight security through Supabase RLS policies. It provides a solid foundation for all the features you described, with proper relationships and data integrity constraints.