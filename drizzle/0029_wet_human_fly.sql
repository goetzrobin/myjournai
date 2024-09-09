-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "updated_at", "slug", "image_url") values
('Embracing the unknown', 'First session to go over how they feel about life after athletics',
 3, '5', now(), null, 'getting-started-v0', 'getting-started-v0.jpg');
