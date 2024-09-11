-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "updated_at", "slug", "image_url") values
('Early Signs', 'Trying to identify what makes you light up',
 4, '5', now(), null, 'career-confusion-v0', 'career-confusion-v0.jpg');
