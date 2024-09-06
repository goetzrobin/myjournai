-- Custom SQL migration file, put you code below! --
update sessions set step_count = 8 where name = 'Alignment';
update sessions set step_count = 5 where name = 'Onboarding';
