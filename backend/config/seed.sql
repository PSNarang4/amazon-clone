-- Seed file for amazon_clone database
-- Run after schema.sql

USE amazon_clone;

-- Default user (no login required, but we need a user for cart/orders)
INSERT IGNORE INTO users (id, name, email, password, address, phone) VALUES
(1, 'Rahul Sharma', 'rahul@example.com', '$2a$10$placeholder_hash', 'B-42, Sector 15, Noida, UP', '9876543210');

-- Categories
INSERT IGNORE INTO categories (id, name, slug, image_url) VALUES
(1, 'Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300'),
(2, 'Books', 'books', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300'),
(3, 'Clothing', 'clothing', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300'),
(4, 'Home & Kitchen', 'home-kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'),
(5, 'Sports & Fitness', 'sports-fitness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300'),
(6, 'Beauty', 'beauty', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300'),
(7, 'Toys', 'toys', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=300'),
(8, 'Automotive', 'automotive', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300');

-- Electronics
INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, brand, stock, rating, review_count, is_prime) VALUES
(1, 'boAt Rockerz 450 Bluetooth Headphone', 'Enjoy superior music experience with boAt Rockerz 450. Up to 15 hours of continuous playtime with 40mm dynamic drivers.', 1299.00, 2990.00, 1, 'boAt', 150, 4.10, 52341, TRUE),
(2, 'Redmi Note 13 5G (128GB, Midnight Black)', '6.67 inch FHD+ AMOLED display, Snapdragon 685, 108MP camera, 5000mAh battery, fast charging.', 17499.00, 19999.00, 1, 'Redmi', 80, 4.30, 18923, TRUE),
(3, 'Sony WH-1000XM5 Wireless Headphones', 'Industry leading noise cancelling. 30 hr battery life. Multi-device pairing. Crystal clear hands-free calling.', 26990.00, 34990.00, 1, 'Sony', 45, 4.60, 9821, TRUE),
(4, 'Logitech MX Master 3S Wireless Mouse', '8000 DPI, ultra-fast scrolling, quiet clicks, USB-C charging, works on any surface.', 7495.00, 9499.00, 1, 'Logitech', 200, 4.70, 7654, TRUE),
(5, 'Amazon Echo Dot (5th Gen)', 'Compact smart speaker with Alexa. Improved audio, motion detection, and temperature sensor built in.', 4499.00, 5499.00, 1, 'Amazon', 500, 4.40, 31245, TRUE),
(6, 'Lenovo IdeaPad Slim 3 Laptop (Intel i5, 16GB RAM, 512GB SSD)', '15.6 inch FHD display, Intel Core i5 12th Gen, Windows 11, backlit keyboard, fast boot.', 52990.00, 64990.00, 1, 'Lenovo', 30, 4.20, 5432, TRUE),
(7, 'Samsung 32" Smart TV Full HD', 'Full HD resolution, PurColor technology, HDR, Tizen OS with 1000+ apps, 3 HDMI ports.', 18990.00, 24990.00, 1, 'Samsung', 60, 4.30, 12341, TRUE),
(8, 'JBL Flip 6 Portable Bluetooth Speaker', 'Bold JBL Pro sound, IP67 waterproof & dustproof, 12 hours playtime, PartyBoost.', 7999.00, 11999.00, 1, 'JBL', 120, 4.50, 8976, TRUE);

-- Books
INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, brand, stock, rating, review_count, is_prime) VALUES
(9, 'Atomic Habits by James Clear', 'A proven framework for improving every day. Learn how to build good habits and break bad ones.', 399.00, 699.00, 2, 'Penguin', 1000, 4.80, 98234, TRUE),
(10, 'The Psychology of Money by Morgan Housel', 'Timeless lessons on wealth, greed, and happiness. A must-read for anyone who wants to make better financial decisions.', 349.00, 599.00, 2, 'Jaico Publishing', 999, 4.70, 74563, TRUE),
(11, 'Rich Dad Poor Dad by Robert Kiyosaki', 'What the rich teach their kids about money that the poor and middle class do not.', 299.00, 450.00, 2, 'Plata Publishing', 850, 4.50, 112543, TRUE),
(12, 'Deep Work by Cal Newport', 'Rules for focused success in a distracted world. Develop the ability to focus without distraction.', 379.00, 599.00, 2, 'Piatkus', 600, 4.60, 43210, TRUE);

-- Clothing
INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, brand, stock, rating, review_count, is_prime) VALUES
(13, 'Roadster Men''s Slim Fit T-Shirt (Pack of 3)', 'Solid round neck t-shirts, 100% cotton, bio-washed for extra softness, available in multiple colours.', 649.00, 1499.00, 3, 'Roadster', 300, 4.10, 23451, TRUE),
(14, 'MANGO Women''s Floral Wrap Dress', 'Midi wrap dress with floral print, V-neckline, flutter sleeves, perfect for casual and semi-formal occasions.', 2499.00, 3999.00, 3, 'MANGO', 80, 4.30, 5432, TRUE),
(15, 'Levi''s Men''s 511 Slim Fit Jeans', 'Classic slim fit below the waist, sits lower on the waist, slim through seat and thigh, close cut from knee to ankle.', 2199.00, 3999.00, 3, "Levi's", 150, 4.40, 34512, TRUE),
(16, 'Adidas Men''s Running Shoes', 'Cloudfoam midsole for soft cushioning, breathable mesh upper, rubber outsole for superior grip.', 3499.00, 5999.00, 3, 'Adidas', 90, 4.20, 18920, TRUE);

-- Home & Kitchen
INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, brand, stock, rating, review_count, is_prime) VALUES
(17, 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (5.7L)', 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 13 built-in programs.', 7999.00, 10999.00, 4, 'Instant Pot', 70, 4.60, 45231, TRUE),
(18, 'Philips Air Fryer HD9252/90 (4.1L)', 'Rapid Air Technology, up to 90% less fat, 7 presets, dishwasher safe basket, timer with auto-off.', 8995.00, 12995.00, 4, 'Philips', 55, 4.40, 29871, TRUE),
(19, 'IKEA KALLAX Shelf Unit (White)', 'Modular shelving, 4 compartments, compatible with KALLAX inserts, durable particleboard.', 4999.00, 6499.00, 4, 'IKEA', 40, 4.30, 12340, FALSE),
(20, 'Milton Thermosteel Flip Lid Flask (1L)', 'Double wall insulation, keeps hot 24 hrs/cold 18 hrs, food-grade stainless steel, leak-proof.', 849.00, 1299.00, 4, 'Milton', 500, 4.50, 67892, TRUE);

-- Sports
INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, brand, stock, rating, review_count, is_prime) VALUES
(21, 'Boldfit Gym Gloves for Men & Women', 'Anti-slip grip, padded palm, breathable neoprene back, adjustable wrist wrap, unisex.', 349.00, 799.00, 5, 'Boldfit', 400, 4.10, 34512, TRUE),
(22, 'Strauss Yoga Mat (6mm, Anti-Slip)', 'Eco-friendly, anti-tear, extra thick 6mm, includes carrying strap, suitable for all surfaces.', 599.00, 999.00, 5, 'Strauss', 600, 4.30, 52341, TRUE),
(23, 'Cosco Champion Basketball (Size 7)', 'Official size and weight, nylon wound, butyl bladder, excellent grip, suitable for indoor & outdoor.', 999.00, 1499.00, 5, 'Cosco', 120, 4.20, 8765, TRUE);

-- Product Images
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', FALSE, 2),
(1, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', FALSE, 3),
(2, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', FALSE, 2),
(4, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', FALSE, 2),
(7, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600', TRUE, 1),
(8, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', TRUE, 1),
(9, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', TRUE, 1),
(10, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', TRUE, 1),
(11, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', TRUE, 1),
(12, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', TRUE, 1),
(13, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', TRUE, 1),
(14, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', TRUE, 1),
(15, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', TRUE, 1),
(16, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', TRUE, 1),
(17, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', TRUE, 1),
(18, 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600', TRUE, 1),
(19, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', TRUE, 1),
(20, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', TRUE, 1),
(21, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', TRUE, 1),
(22, 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600', TRUE, 1),
(23, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', TRUE, 1);

-- Product specs (sample)
INSERT IGNORE INTO product_specs (product_id, spec_key, spec_value) VALUES
(1, 'Connectivity', 'Bluetooth 5.0'),
(1, 'Battery Life', 'Up to 15 hours'),
(1, 'Driver Size', '40mm'),
(1, 'Weight', '220g'),
(2, 'Display', '6.67 inch FHD+ AMOLED'),
(2, 'Processor', 'Qualcomm Snapdragon 685'),
(2, 'RAM', '6GB'),
(2, 'Storage', '128GB'),
(2, 'Battery', '5000mAh'),
(2, 'Camera', '108MP + 8MP + 2MP'),
(3, 'Noise Cancellation', 'Industry-leading ANC'),
(3, 'Battery Life', 'Up to 30 hours'),
(3, 'Connectivity', 'Bluetooth 5.2'),
(3, 'Weight', '250g'),
(6, 'Processor', 'Intel Core i5-1235U 12th Gen'),
(6, 'RAM', '16GB DDR4'),
(6, 'Storage', '512GB SSD'),
(6, 'Display', '15.6 inch FHD IPS'),
(6, 'OS', 'Windows 11 Home');
