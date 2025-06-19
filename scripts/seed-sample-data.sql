-- Insert sample products
INSERT INTO products (title, description, price, original_price, category, is_grwm, image_url, affiliate_url, tags) VALUES
('PINK PARADISE SET', 'Stunning pink two-piece set perfect for date nights and special occasions', 45.99, 65.99, 'glam', false, '/placeholder.svg?height=400&width=300', 'https://shein.com/example1', ARRAY['Date Night', 'Pink', 'Two Piece']),
('STREETWEAR SUNDAY', 'Casual streetwear look with urban vibes - includes GRWM tutorial', 0, 0, 'grwm', true, '/placeholder.svg?height=400&width=300', '/grwm/streetwear-sunday', ARRAY['GRWM', 'Streetwear', 'Casual']),
('NEON DREAMS CROP', 'Bright neon crop top set that makes a statement', 32.99, 48.99, 'casual', false, '/placeholder.svg?height=400&width=300', 'https://shein.com/example2', ARRAY['Neon', 'Summer', 'Crop Top']),
('DATE NIGHT GLAM', 'Complete glam transformation tutorial for the perfect date night', 0, 0, 'grwm', true, '/placeholder.svg?height=400&width=300', '/grwm/date-night-glam', ARRAY['GRWM', 'Date Night', 'Elegant']);

-- Insert sample tracks
INSERT INTO tracks (title, duration, image_url, spotify_url, apple_music_url, stream_count, is_featured) VALUES
('NEON DREAMS', '3:24', '/placeholder.svg?height=300&width=300', 'https://spotify.com/track/neon-dreams', 'https://music.apple.com/track/neon-dreams', 45000, true),
('MIDNIGHT VIBES', '2:58', '/placeholder.svg?height=300&width=300', 'https://spotify.com/track/midnight-vibes', 'https://music.apple.com/track/midnight-vibes', 32000, true),
('GOLDEN HOUR', '4:12', '/placeholder.svg?height=300&width=300', 'https://spotify.com/track/golden-hour', 'https://music.apple.com/track/golden-hour', 67000, true),
('ELECTRIC SOUL', '3:45', '/placeholder.svg?height=300&width=300', 'https://spotify.com/track/electric-soul', 'https://music.apple.com/track/electric-soul', 54000, false);

-- Insert sample admin user (Britney)
INSERT INTO users (email, username, full_name, avatar_url, bio, is_admin) VALUES
('britney@britneychierra.com', 'britneychierra', 'Britney Chierra', '/placeholder.svg?height=100&width=100', 'Digital creator, fashion curator, and music artist. Welcome to my world! ✨', true);

-- Insert sample community users
INSERT INTO users (email, username, full_name, avatar_url, bio) VALUES
('sarah@example.com', 'sarahm', 'Sarah M.', '/placeholder.svg?height=40&width=40', 'Fashion enthusiast and style recreator'),
('maya@example.com', 'mayak', 'Maya K.', '/placeholder.svg?height=40&width=40', 'Music lover and community supporter'),
('alex@example.com', 'alexr', 'Alex R.', '/placeholder.svg?height=40&width=40', 'Virtual styling session host and fashion mentor');

-- Insert sample community posts
INSERT INTO posts (user_id, content, image_url, likes_count, comments_count) VALUES
((SELECT id FROM users WHERE username = 'sarahm'), 'Just recreated Britney''s pink paradise look and I''m OBSESSED! The confidence boost is real!', '/placeholder.svg?height=300&width=400', 45, 12),
((SELECT id FROM users WHERE username = 'mayak'), 'Britney''s new track "Neon Dreams" has been on repeat all week! The vibes are immaculate.', null, 67, 23),
((SELECT id FROM users WHERE username = 'alexr'), 'Hosting a virtual styling session this weekend! Who wants to join and recreate some of our fave looks together?', '/placeholder.svg?height=300&width=400', 89, 34);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, action_url) VALUES
((SELECT id FROM users WHERE username = 'sarahm'), 'music', 'NEW TRACK ALERT', 'Britney just dropped "Electric Soul" - listen now!', '/music'),
((SELECT id FROM users WHERE username = 'mayak'), 'shop', 'GRWM VIDEO LIVE', 'New "Date Night Glam" tutorial is now available', '/marketplace'),
((SELECT id FROM users WHERE username = 'alexr'), 'community', 'COMMUNITY MILESTONE', 'We just hit 12.5K members! Thank you all!', '/community');
