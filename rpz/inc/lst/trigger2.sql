before insert on AutoService.Mechanic
for each row
execute function AutoService.check_existing_email();
create or replace trigger check_email_existing_mechanic_u
before update on AutoService.Mechanic
for each row
execute function AutoService.check_existing_email();
