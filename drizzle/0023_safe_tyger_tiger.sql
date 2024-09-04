-- Custom SQL migration file, put you code below! --
update sessions set image_url = 'alignment-v0.png' where name = 'Alignment';
update sessions set image_url = 'onboarding-v0.jpg' where name = 'Onboarding';
