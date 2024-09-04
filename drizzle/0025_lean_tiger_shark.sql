-- Custom SQL migration file, put you code below! --
update sessions set index = 1 where name = 'Alignment';
update sessions set index = 0 where name = 'Onboarding';
