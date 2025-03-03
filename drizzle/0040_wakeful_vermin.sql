-- Custom SQL migration file, put you code below! --
insert into "sessions" ("name", "description", "index", "estimated_completion_time", "created_at", "slug", "image_url", "type") values
  ('Open Check-In', 'Chat with Sam about whatever is on your mind',
   1, '5', now(), 'unguided-open-v0', 'unguided-open-v0.jpg', 'UNGUIDED');
