-- Sample data for Randopedia Travel Application
-- This script demonstrates how to populate the database with initial test data

-- Insert sample destinations
INSERT INTO destinations (name, country, region, description, featured, image_url) VALUES
('Bali', 'Indonesia', 'Southeast Asia', 'Tropical paradise with stunning beaches and rich culture', true, 'https://example.com/bali.jpg'),
('Santorini', 'Greece', 'Europe', 'Beautiful Greek island with white buildings and blue domes', true, 'https://example.com/santorini.jpg'),
('Kyoto', 'Japan', 'Asia', 'Historic city with temples, gardens, and traditional culture', false, 'https://example.com/kyoto.jpg'),
('Machu Picchu', 'Peru', 'South America', 'Ancient Incan city in the Andes mountains', true, 'https://example.com/machupicchu.jpg'),
('Safari Kenya', 'Kenya', 'Africa', 'Wildlife adventure in the heart of Africa', false, 'https://example.com/kenya.jpg');

-- Insert sample voyages
INSERT INTO voyages (title, description, destination_id, duration_days, price, discount_price, image_url, highlights, category, featured, status, created_at) VALUES
('Bali Tropical Escape', 'Experience the beauty of Bali with beach relaxation, cultural tours, and spa treatments', 
 (SELECT id FROM destinations WHERE name = 'Bali'), 7, 1200.00, 999.00, 
 'https://example.com/bali-voyage.jpg', 
 ARRAY['Beach relaxation', 'Cultural tours', 'Spa treatments', 'Local cuisine'],
 'Adventure', true, 'active', NOW()),
 
('Greek Island Hopping', 'Visit multiple Greek islands with guided tours and traditional experiences', 
 (SELECT id FROM destinations WHERE name = 'Santorini'), 10, 1800.00, 1500.00, 
 'https://example.com/greek-voyage.jpg', 
 ARRAY['Island hopping', 'Historical sites', 'Traditional cuisine', 'Sunset views'],
 'Cultural', true, 'active', NOW()),
 
('Japan Cultural Journey', 'Explore ancient temples, gardens, and modern cities of Japan', 
 (SELECT id FROM destinations WHERE name = 'Kyoto'), 14, 2500.00, 2200.00, 
 'https://example.com/japan-voyage.jpg', 
 ARRAY['Temple visits', 'Garden tours', 'Traditional tea ceremony', 'Modern city exploration'],
 'Cultural', true, 'active', NOW());

-- Insert sample testimonials
INSERT INTO testimonials (name, email, content, rating, verified, featured) VALUES
('John Smith', 'john@example.com', 'Amazing experience in Bali! The tour guides were knowledgeable and the accommodations were perfect.', 5, true, true),
('Sarah Johnson', 'sarah@example.com', 'Greek Island Hopping was everything I dreamed of. The sunset views were breathtaking!', 5, true, true),
('Michael Brown', 'michael@example.com', 'The Japan Cultural Journey opened my eyes to a completely different world. Highly recommended!', 4, true, false);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, published, published_at, featured, tags, read_time_minutes) VALUES
('Top 10 Beaches in Bali', 'top-10-beaches-in-bali', 'Discover the most beautiful beaches in Bali that you shouldn''t miss on your visit',
 'Bali is known for its stunning beaches, each offering unique experiences. From the popular Kuta Beach to the serene Padang Padang, here are the top 10 beaches you must visit during your stay in Bali...',
 'Travel Expert', true, NOW(), true, ARRAY['Bali', 'Beaches', 'Travel Tips'], 8),
 
('Essential Travel Guide to Greece', 'essential-travel-guide-to-greece', 'Everything you need to know before visiting the beautiful Greek islands',
 'Greece is a dream destination for many travelers. From its ancient ruins to stunning islands, here''s our complete guide to make the most of your Greek adventure...',
 'Travel Expert', true, NOW(), false, ARRAY['Greece', 'Travel Guide', 'Islands'], 10),
 
('Cultural Etiquette in Japan', 'cultural-etiquette-in-japan', 'Important customs and etiquette to follow when visiting Japan',
 'Japan has rich cultural traditions that visitors should be aware of. Understanding proper etiquette will enhance your travel experience and help you connect with locals...',
 'Travel Expert', true, NOW(), true, ARRAY['Japan', 'Culture', 'Etiquette'], 6);

-- Insert sample voyage reviews
-- Note: In a real scenario, these would be linked to actual user IDs and voyage IDs
-- For this example, we'll use the voyage IDs we just created
INSERT INTO voyage_reviews (voyage_id, user_id, rating, review_title, review_text, verified_booking) VALUES
((SELECT id FROM voyages WHERE title = 'Bali Tropical Escape'), 
 (SELECT id FROM auth.users LIMIT 1), 
 5, 'Perfect tropical getaway!', 
 'This trip exceeded all my expectations. The beaches were beautiful and the cultural experiences were eye-opening. Highly recommended!', 
 true),
 
((SELECT id FROM voyages WHERE title = 'Greek Island Hopping'), 
 (SELECT id FROM auth.users LIMIT 1 OFFSET 1), 
 4, 'Beautiful islands, great tour!', 
 'The tour was well-organized and the guides were professional. The only issue was the weather on one day, but overall a fantastic experience.', 
 true),
 
((SELECT id FROM voyages WHERE title = 'Japan Cultural Journey'), 
 (SELECT id FROM auth.users LIMIT 1 OFFSET 2), 
 5, 'Life-changing experience', 
 'Japan was unlike any place I''ve ever been. The combination of ancient traditions and modern technology is fascinating. This tour showed me the best of both worlds.', 
 true);

-- Insert sample contact request
INSERT INTO contact_requests (name, email, phone, travel_type, destination, message) VALUES
('Jane Doe', 'jane@example.com', '+1234567890', 'Luxury', 'Bali', 'I am interested in your Bali Tropical Escape package for my family of 4.');

-- Insert sample booking
INSERT INTO bookings (user_id, voyage_id, full_name, email, phone, participants, travel_date, special_requests, payment_method, total_amount, status, payment_status) VALUES
((SELECT id FROM auth.users LIMIT 1), 
 (SELECT id FROM voyages WHERE title = 'Bali Tropical Escape'), 
 'John Doe', 'john@example.com', '+1234567890', 2, '2024-06-15', 'Prefer twin beds', 'Credit Card', 2400.00, 'confirmed', 'completed');

-- Insert voyage images
INSERT INTO voyage_images (voyage_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM voyages WHERE title = 'Bali Tropical Escape'), 'https://example.com/bali1.jpg', 'Bali beach view', true, 0),
((SELECT id FROM voyages WHERE title = 'Bali Tropical Escape'), 'https://example.com/bali2.jpg', 'Traditional Balinese temple', false, 1),
((SELECT id FROM voyages WHERE title = 'Greek Island Hopping'), 'https://example.com/santorini1.jpg', 'Santorini sunset', true, 0),
((SELECT id FROM voyages WHERE title = 'Japan Cultural Journey'), 'https://example.com/kyoto1.jpg', 'Japanese temple', true, 0);