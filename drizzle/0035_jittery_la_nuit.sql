-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "slug", "image_url") values
('The Good Enough Career', 'There is no perfect career, but there is one right for you',
 5, '5', now(), 'good-enough-career-v0', 'good-enough-career-v0.jpg');
