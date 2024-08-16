ALTER TABLE "sessions" ADD COLUMN "slug" varchar;

insert into
  sessions (
    slug,
    name,
    description,
    index,
    estimated_completion_time
  )
values
  (
    'onboarding-v0', 'Onboarding',
    'Onboarding session talking to the user about their survey results and the letter they have shared with Sam',
    0,
    5
  )

