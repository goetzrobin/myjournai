-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "slug", "image_url") values
('Things that get in the way', 'We talk about three common obstacles that get in the way of finding a fulfilling career.',
 6, '5', now(), 'common-obstacles-v0', 'common-obstacles-v0.jpg');

 insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "slug", "image_url") values
 ('Knowing your true potential', 'Another challenge of finding the right career is learning how to know your true potential',
  7, '5', now(), 'true-potential-v0', 'true-potential-v0.jpg');
