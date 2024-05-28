create or replace function AutoService.check_existing_email()
returns trigger
as
$$
begin
	if		exists(select * from AutoService.client where email = new.email and id != new.id) then
		raise exception 'user: %', new.id
      		using hint = 'existing client with same email';
    elsif	exists(select * from AutoService.mechanic where email = new.email and id != new.id) then
    	raise exception 'user: %', new.id
      		using hint = 'existing mechanic with same email';
    elsif	exists(select * from AutoService.admin where email = new.email and id != new.id) then
    	raise exception 'user: %', new.id
      		using hint = 'existing admin with same email';
    end if;
   return new;
end;
$$
language plpgsql;
create or replace trigger check_email_existing_client_c
before insert on AutoService.Client
for each row
execute function AutoService.check_existing_email();
create or replace trigger check_email_existing_client_u
before update of email on AutoService.Client
for each row
execute function AutoService.check_existing_email();
create or replace trigger check_email_existing_admin_c
before insert on AutoService.Admin
for each row
execute function AutoService.check_existing_email();
create or replace trigger check_email_existing_admin_u
before update of email on AutoService.Admin
for each row
execute function AutoService.check_existing_email();
create or replace trigger check_email_existing_mechanic_c
