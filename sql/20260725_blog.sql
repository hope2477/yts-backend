-- =============================================================================
-- YTS Blog: table + permissions + seed (run on hosted MySQL)
-- =============================================================================
-- Example:
--   mysql -u USER -p DATABASE < sql/20260725_blog.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(180) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `author` varchar(100) NOT NULL,
  `publishedAt` date NOT NULL,
  `readingMinutes` int(11) NOT NULL DEFAULT 5,
  `coverImage` varchar(500) DEFAULT NULL,
  `coverAlt` varchar(255) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `body` json NOT NULL,
  `isFeatured` bit(1) NOT NULL DEFAULT b'0',
  `isPublished` bit(1) NOT NULL DEFAULT b'1',
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdBy` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_slug` (`slug`),
  KEY `idx_blog_published` (`isActive`, `isPublished`, `publishedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Permissions
INSERT INTO permissions (code, name, description, module, createdBy) VALUES
('blog.view', 'View Blogs', 'View blog posts', 'blog', 1),
('blog.create', 'Create Blog', 'Create blog posts', 'blog', 1),
('blog.update', 'Update Blog', 'Update blog posts', 'blog', 1),
('blog.delete', 'Delete Blog', 'Delete blog posts', 'blog', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  module = VALUES(module);

-- SUPER_ADMIN: all blog permissions
INSERT INTO role_permissions (role_id, permission_id, createdBy)
SELECT
  (SELECT id FROM roles WHERE name = 'SUPER_ADMIN'),
  p.id,
  1
FROM permissions p
WHERE p.code IN ('blog.view', 'blog.create', 'blog.update', 'blog.delete')
AND NOT EXISTS (
  SELECT 1 FROM role_permissions rp
  WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'SUPER_ADMIN')
    AND rp.permission_id = p.id
);

-- ADMIN: full blog CRUD
INSERT INTO role_permissions (role_id, permission_id, createdBy)
SELECT
  (SELECT id FROM roles WHERE name = 'ADMIN'),
  p.id,
  1
FROM permissions p
WHERE p.code IN ('blog.view', 'blog.create', 'blog.update', 'blog.delete')
AND NOT EXISTS (
  SELECT 1 FROM role_permissions rp
  WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
    AND rp.permission_id = p.id
);

-- Seed existing customer posts (skip if slug already exists)
INSERT INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
)
SELECT * FROM (
  SELECT
    'self-drive-car-rental-sri-lanka-guide' AS slug,
    'Self-drive car rental in Sri Lanka: what to know before you book' AS title,
    'Licences, insurance, fuel, and road tips — a practical guide to hiring a car in Colombo for island travel.' AS excerpt,
    'Car rentals' AS category,
    'YTS Team' AS author,
    '2026-06-12' AS publishedAt,
    6 AS readingMinutes,
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80' AS coverImage,
    'Car ready for a self-drive trip in Sri Lanka' AS coverAlt,
    CAST('["self-drive","Colombo","car hire"]' AS JSON) AS tags,
    CAST('[{"type":"p","text":"Self-drive is one of the freest ways to see Sri Lanka — beach towns one day, hill country the next. A clear booking and a well-maintained car matter more than a flashy brochure."},{"type":"h2","text":"Documents you will need"},{"type":"ul","items":["A valid driving licence from your home country","An International Driving Permit if your licence is not in English","Passport for identity checks at pickup","Confirmed dates, pickup location, and a reachable WhatsApp number"]},{"type":"h2","text":"Choosing the right class"},{"type":"p","text":"Economy hatchbacks suit Colombo and short coastal hops. Compact cars and wagons give luggage room for families. For longer hill-country runs, ask about transmission preference and fuel type before you confirm."},{"type":"quote","text":"Share your itinerary when you inquire — we can suggest a model that fits the roads you will actually drive."},{"type":"h2","text":"Pickup and return tips"},{"type":"p","text":"Airport and Colombo city pickups are both common. Check fuel policy, mileage expectations, and after-hours return options in writing (WhatsApp works well). Photograph the car at handover — a quick habit that saves time later."},{"type":"p","text":"Ready to compare options? Browse the YTS fleet and message us with your dates — we confirm availability quickly."}]' AS JSON) AS body,
    b'1' AS isFeatured,
    b'1' AS isPublished,
    b'1' AS isActive,
    1 AS createdBy,
    NOW() AS createdDate
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM blog b WHERE b.slug = 'self-drive-car-rental-sri-lanka-guide');

INSERT INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
)
SELECT * FROM (
  SELECT
    'colombo-day-trips-by-car' AS slug,
    'Easy day trips from Colombo by car' AS title,
    'Galle, Negombo, and hill escapes — realistic drive times and why a flexible rental beats a fixed tour.' AS excerpt,
    'Travel tips' AS category,
    'YTS Team' AS author,
    '2026-05-28' AS publishedAt,
    5 AS readingMinutes,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' AS coverImage,
    'Coastal scenery on a day trip from Colombo' AS coverAlt,
    CAST('["day trips","Colombo","road trip"]' AS JSON) AS tags,
    CAST('[{"type":"p","text":"Colombo is a strong base if you want variety without packing every night. With a rental car you set the pace — coffee stops included."},{"type":"h2","text":"South coast towards Galle"},{"type":"p","text":"The coastal highway is scenic and busy on weekends. Leave early, plan one main stop (fort, beach, or lunch), and avoid rushing back after dark if you are new to local traffic."},{"type":"h2","text":"Negombo and the lagoon side"},{"type":"p","text":"Closer to Bandaranaike International Airport, Negombo works for short stays and beach time when flights are awkward. A compact car is usually enough for this corridor."},{"type":"ul","items":["Check parking near popular beaches before you go","Carry cash for small tolls and snacks","Use offline maps as a backup in patchy signal areas"]},{"type":"p","text":"Tell us your preferred day-trip loop when you inquire — we will match a vehicle and pickup window that fits."}]' AS JSON) AS body,
    b'0' AS isFeatured,
    b'1' AS isPublished,
    b'1' AS isActive,
    1 AS createdBy,
    NOW() AS createdDate
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM blog b WHERE b.slug = 'colombo-day-trips-by-car');

INSERT INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
)
SELECT * FROM (
  SELECT
    'newlands-bungalow-galle-weekend' AS slug,
    'A weekend at Newlands Bungalow near Galle' AS title,
    'Why a colonial-character bungalow in Baddegama works for families and groups — and how to plan the drive from Colombo.' AS excerpt,
    'Holiday stays' AS category,
    'YTS Team' AS author,
    '2026-05-10' AS publishedAt,
    4 AS readingMinutes,
    'https://ytsenterprise.com/images/holiday-home1.png' AS coverImage,
    'Newlands Bungalow Galle exterior and lawn' AS coverAlt,
    CAST('["Galle","holiday home","Newlands"]' AS JSON) AS tags,
    CAST('[{"type":"p","text":"Newlands Bungalow sits in Baddegama, about 1.5 hours from Colombo and roughly 18 km from Galle Fort. Five rooms and generous parking make it a natural fit for gatherings."},{"type":"h2","text":"Who it suits"},{"type":"ul","items":["Family weekends and multi-generation trips","Friends getaways who want shared outdoor space","Guests who prefer a house over a hotel wing"]},{"type":"h2","text":"Planning the stay"},{"type":"p","text":"Pair the bungalow with a coastal day in Galle or a quieter garden pace. Confirm breakfast preferences and arrival time when you inquire so handover is smooth."},{"type":"quote","text":"Space to gather matters as much as the room count — ask about parking and outdoor areas when you book."},{"type":"p","text":"Explore Newlands details on our holiday homes page, then message us with dates to check availability."}]' AS JSON) AS body,
    b'1' AS isFeatured,
    b'1' AS isPublished,
    b'1' AS isActive,
    1 AS createdBy,
    NOW() AS createdDate
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM blog b WHERE b.slug = 'newlands-bungalow-galle-weekend');

INSERT INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
)
SELECT * FROM (
  SELECT
    'renting-an-apartment-in-colombo' AS slug,
    'Renting an apartment in Colombo: short-term vs longer stays' AS title,
    'How to decide between a short let and a monthly apartment — locations, furnished expectations, and what to ask upfront.' AS excerpt,
    'Properties' AS category,
    'YTS Team' AS author,
    '2026-04-22' AS publishedAt,
    5 AS readingMinutes,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' AS coverImage,
    'Modern apartment exterior in Colombo' AS coverAlt,
    CAST('["Colombo apartments","furnished rental"]' AS JSON) AS tags,
    CAST('[{"type":"p","text":"Colombo rentals range from weekend city bases to longer furnished apartments. Clear expectations on duration, furnishing, and deposits keep the process calm."},{"type":"h2","text":"Short stays"},{"type":"p","text":"Ideal for project visits and flexible travel. Ask about utilities, Wi-Fi, and cleaning so the nightly or weekly rate is truly comparable."},{"type":"h2","text":"Monthly and longer"},{"type":"ul","items":["Confirm what is included in the monthly charge","Check parking if you also need a rental car","Clarify notice periods and inventory lists"]},{"type":"p","text":"Browse current YTS property listings, then inquire with your preferred corridor (for example Colombo 3, 6, or Dehiwala) and move-in window."}]' AS JSON) AS body,
    b'0' AS isFeatured,
    b'1' AS isPublished,
    b'1' AS isActive,
    1 AS createdBy,
    NOW() AS createdDate
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM blog b WHERE b.slug = 'renting-an-apartment-in-colombo');
