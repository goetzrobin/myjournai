-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "updated_at", "slug", "image_url") values
('Taking the Scenic Route', 'A reminder that life happens while you are making plans',
 5, '5', now(), null, 'scenic-route-v0', 'scenic-route-v0.jpg');
