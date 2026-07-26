-- Simple blog seeds for phpMyAdmin / hosted MySQL
-- Safe to re-run: INSERT IGNORE skips existing slugs (unique key on slug)

INSERT IGNORE INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
) VALUES (
  'self-drive-car-rental-sri-lanka-guide',
  'Self-drive car rental in Sri Lanka: what to know before you book',
  'Licences, insurance, fuel, and road tips - a practical guide to hiring a car in Colombo for island travel.',
  'Car rentals',
  'YTS Team',
  '2026-06-12',
  6,
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
  'Car ready for a self-drive trip in Sri Lanka',
  '["self-drive","Colombo","car hire"]',
  '[{"type":"p","text":"Self-drive is one of the freest ways to see Sri Lanka - beach towns one day, hill country the next. A clear booking and a well-maintained car matter more than a flashy brochure."},{"type":"h2","text":"Documents you will need"},{"type":"ul","items":["A valid driving licence from your home country","An International Driving Permit if your licence is not in English","Passport for identity checks at pickup","Confirmed dates, pickup location, and a reachable WhatsApp number"]},{"type":"h2","text":"Choosing the right class"},{"type":"p","text":"Economy hatchbacks suit Colombo and short coastal hops. Compact cars and wagons give luggage room for families. For longer hill-country runs, ask about transmission preference and fuel type before you confirm."},{"type":"quote","text":"Share your itinerary when you inquire - we can suggest a model that fits the roads you will actually drive."},{"type":"h2","text":"Pickup and return tips"},{"type":"p","text":"Airport and Colombo city pickups are both common. Check fuel policy, mileage expectations, and after-hours return options in writing (WhatsApp works well). Photograph the car at handover - a quick habit that saves time later."},{"type":"p","text":"Ready to compare options? Browse the YTS fleet and message us with your dates - we confirm availability quickly."}]',
  1,
  1,
  1,
  1,
  NOW()
);

INSERT IGNORE INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
) VALUES (
  'colombo-day-trips-by-car',
  'Easy day trips from Colombo by car',
  'Galle, Negombo, and hill escapes - realistic drive times and why a flexible rental beats a fixed tour.',
  'Travel tips',
  'YTS Team',
  '2026-05-28',
  5,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'Coastal scenery on a day trip from Colombo',
  '["day trips","Colombo","road trip"]',
  '[{"type":"p","text":"Colombo is a strong base if you want variety without packing every night. With a rental car you set the pace - coffee stops included."},{"type":"h2","text":"South coast towards Galle"},{"type":"p","text":"The coastal highway is scenic and busy on weekends. Leave early, plan one main stop (fort, beach, or lunch), and avoid rushing back after dark if you are new to local traffic."},{"type":"h2","text":"Negombo and the lagoon side"},{"type":"p","text":"Closer to Bandaranaike International Airport, Negombo works for short stays and beach time when flights are awkward. A compact car is usually enough for this corridor."},{"type":"ul","items":["Check parking near popular beaches before you go","Carry cash for small tolls and snacks","Use offline maps as a backup in patchy signal areas"]},{"type":"p","text":"Tell us your preferred day-trip loop when you inquire - we will match a vehicle and pickup window that fits."}]',
  0,
  1,
  1,
  1,
  NOW()
);

INSERT IGNORE INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
) VALUES (
  'newlands-bungalow-galle-weekend',
  'A weekend at Newlands Bungalow near Galle',
  'Why a colonial-character bungalow in Baddegama works for families and groups - and how to plan the drive from Colombo.',
  'Holiday stays',
  'YTS Team',
  '2026-05-10',
  4,
  'https://ytsenterprise.com/images/holiday-home1.png',
  'Newlands Bungalow Galle exterior and lawn',
  '["Galle","holiday home","Newlands"]',
  '[{"type":"p","text":"Newlands Bungalow sits in Baddegama, about 1.5 hours from Colombo and roughly 18 km from Galle Fort. Five rooms and generous parking make it a natural fit for gatherings."},{"type":"h2","text":"Who it suits"},{"type":"ul","items":["Family weekends and multi-generation trips","Friends getaways who want shared outdoor space","Guests who prefer a house over a hotel wing"]},{"type":"h2","text":"Planning the stay"},{"type":"p","text":"Pair the bungalow with a coastal day in Galle or a quieter garden pace. Confirm breakfast preferences and arrival time when you inquire so handover is smooth."},{"type":"quote","text":"Space to gather matters as much as the room count - ask about parking and outdoor areas when you book."},{"type":"p","text":"Explore Newlands details on our holiday homes page, then message us with dates to check availability."}]',
  1,
  1,
  1,
  1,
  NOW()
);

INSERT IGNORE INTO `blog` (
  `slug`, `title`, `excerpt`, `category`, `author`, `publishedAt`, `readingMinutes`,
  `coverImage`, `coverAlt`, `tags`, `body`, `isFeatured`, `isPublished`, `isActive`,
  `createdBy`, `createdDate`
) VALUES (
  'renting-an-apartment-in-colombo',
  'Renting an apartment in Colombo: short-term vs longer stays',
  'How to decide between a short let and a monthly apartment - locations, furnished expectations, and what to ask upfront.',
  'Properties',
  'YTS Team',
  '2026-04-22',
  5,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  'Modern apartment exterior in Colombo',
  '["Colombo apartments","furnished rental"]',
  '[{"type":"p","text":"Colombo rentals range from weekend city bases to longer furnished apartments. Clear expectations on duration, furnishing, and deposits keep the process calm."},{"type":"h2","text":"Short stays"},{"type":"p","text":"Ideal for project visits and flexible travel. Ask about utilities, Wi-Fi, and cleaning so the nightly or weekly rate is truly comparable."},{"type":"h2","text":"Monthly and longer"},{"type":"ul","items":["Confirm what is included in the monthly charge","Check parking if you also need a rental car","Clarify notice periods and inventory lists"]},{"type":"p","text":"Browse current YTS property listings, then inquire with your preferred corridor (for example Colombo 3, 6, or Dehiwala) and move-in window."}]',
  0,
  1,
  1,
  1,
  NOW()
);
