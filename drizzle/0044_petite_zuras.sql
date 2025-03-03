-- Custom SQL migration file, put you code below! --
-- Insert statements for mentor qualities
INSERT INTO user_mentor_traits (id, name, description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Courage', 'Faces life''s messiness with grace, showing us how to do the same', NOW(), NOW()),
  (gen_random_uuid(), 'Wisdom', 'Knows the difference between information and understanding', NOW(), NOW()),
  (gen_random_uuid(), 'Presence', 'Truly listens, without rushing to fix or judge', NOW(), NOW()),
  (gen_random_uuid(), 'Curiosity', 'Delights in questions more than answers', NOW(), NOW()),
  (gen_random_uuid(), 'Truth', 'Gentle with feelings, uncompromising with reality', NOW(), NOW()),
  (gen_random_uuid(), 'Depth', 'Comfortable sitting with life''s contradictions', NOW(), NOW()),
  (gen_random_uuid(), 'Challenge', 'Knows we grow most when we''re slightly uncomfortable', NOW(), NOW()),
  (gen_random_uuid(), 'Insight', 'Sees patterns we''ve missed in our own story', NOW(), NOW()),
  (gen_random_uuid(), 'Trust', 'Creates a space where doubts can be voiced', NOW(), NOW()),
  (gen_random_uuid(), 'Heart', 'Brings warmth to difficult conversations', NOW(), NOW()),
  (gen_random_uuid(), 'Spirit', 'Reminds us of life''s poetry, not just its prose', NOW(), NOW()),
  (gen_random_uuid(), 'Vision', 'Helps us imagine better versions of ourselves', NOW(), NOW()),
  (gen_random_uuid(), 'Faith', 'Holds hope for us when we''ve misplaced our own', NOW(), NOW()),
  (gen_random_uuid(), 'Purpose', 'Helps us find meaning in the everyday', NOW(), NOW());
