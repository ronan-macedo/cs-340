-- Create new account for Tony Stark
insert into public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
values (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update Tony Stark account_type
update public.account
set account_type = 'Admin'
where account_id = 1;
-- Delete Tony Stark - "We won! You did, sir, you did. I'm sorry, Tony."
delete from public.account
where account_id = 1;
-- Update GM Hummer description
update public.inventory
set inv_description = replace(
        inv_description,
        'small interiors',
        'a huge interior'
    )
where inv_id = 10;
-- Select vehicles from `inventory` that belongs to 'Sport' category
select *
from public.inventory i
    inner join public.classification c on i.classification_id = c.classification_id
where c.classification_name = 'Sport';
-- Update `inventory` inv_image and inv_thumbnail
update public.inventory
set inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');