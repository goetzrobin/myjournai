-- Custom SQL migration file, put you code below! --
-- First, insert the categories
INSERT INTO user_interests_categories (id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'At home', NOW(), null),
  (gen_random_uuid(), 'Food & Drinks', NOW(), null),
  (gen_random_uuid(), 'Geek', NOW(), null),
  (gen_random_uuid(), 'Unspoken habits', NOW(), null),
  (gen_random_uuid(), 'Movies & TV Shows', NOW(), null),
  (gen_random_uuid(), 'Sport', NOW(), null),
  (gen_random_uuid(), 'Travel', NOW(), null),
  (gen_random_uuid(), 'In the city', NOW(), NOW());

-- Now, insert the interests with references to their categories
-- For "At home" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'At home')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Creativity', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Making music', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Spying on my neighbors', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Netflix & Chill', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Plant parent', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Gardening', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cozy', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cooking', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Board games', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Sleeping in', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Staying in a bathrobe', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Ikea hacks', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Ceramics', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Petting my cat', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Fashion', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Dyson addict', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Afternoon nap', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Singing in the shower', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Marie Kondo', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Meditation', NOW(), NOW());

-- For "Food & Drinks" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Food & Drinks')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Pizza lover', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Snack break', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'The more cheese the better', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Chocolate addict', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Alcohol-free', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'BBQ sauce', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Chicken addict', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cocktails', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Hummus is the new caviar', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Brunch', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'BBQ', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Street food', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Pasta or nothing', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Wine and more wine', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Craft beer', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Spicy food', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'French fries', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Ramen', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cheese', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Healthy', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Caffeine', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Foodie', NOW(), NOW());

-- For "Geek" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Geek')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Gaming', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Puzzle', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Harry Potter', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Retro Gaming', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Manga & Anime', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Heroic Fantasy', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Chess mastermind', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'YouTube', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Twitch', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Escape games', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Tamagotchi', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Comics lover', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Board games', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cosplay', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Japanese Culture', NOW(), NOW());

-- For "Unspoken habits" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Unspoken habits')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Losing things', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Astral projecting', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Avoiding the news', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Road rage', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Small talk with strangers', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Reading one-star reviews', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Enjoying the smell of gas', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Wikipedia random articles', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Starting books I''ll never finish', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'TikTok trends specialist', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Forgetting peoples'' names', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Overthinking', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Making lists', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Me, a hypochondriac?', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Opening too many tabs', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Looking at houses I can''t afford', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Panic fear of spiders', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Sleeping on my stomach', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Uncontrollable cravings', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Internet rabbit holes', NOW(), NOW());

-- For "Movies & TV Shows" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Movies & TV Shows')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Re-runs of Friends', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Going to the movies solo', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cinema outdoor', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Cooking shows', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Guessing the plot in 3s', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Reality shows', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Talking during the film', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Watching a series to fall asleep', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Documentaries fanatic', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Tell spoilers by accident', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'HBO series', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Peer-to-peer', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Salty popcorn', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'No trailers policy', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'True crime', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Sweet popcorn', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Quoting movies', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Indie movies', NOW(), NOW());

-- For "Sport" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Sport')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Bike rides', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Quidditch', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Skateboard', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Running', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Football', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Surf', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Swimming', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Climbing', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Yoga', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Formula 1', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Boxing', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Tennis', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Basketball', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Rugby', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Horse riding', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Gym clothes, no sport', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Dance', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Padel', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Hitting the gym', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Ski', NOW(), NOW());

-- For "Travel" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'Travel')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Ecotourism', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Lost luggage', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), '1st in the boarding queue', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Hiking', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Hardcore vacation planner', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Backpacking', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Naturism', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'City trip', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Van life', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Airport sprinter', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), '5-star-hotel', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Camping', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Viva Italia', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'All-inclusive', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Road trip', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Staycation', NOW(), NOW());

-- For "In the city" category
WITH category AS (SELECT id FROM user_interests_categories WHERE name = 'In the city')
INSERT INTO user_interests (id, user_interests_category_id, name, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM category), 'Architecture', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Always late', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Hosting dinner parties', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Movie theater', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Gigs', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Karaoke', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Funfair', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Costume parties', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Thrift stores', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Casino', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Photo', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Theater', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Rooftop', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Speakeasy', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Nightclub', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Sunday market', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Rave party', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Music festivals', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Museum', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Flea market', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Street art', NOW(), null),
  (gen_random_uuid(), (SELECT id FROM category), 'Exhibitions', NOW(), null);
