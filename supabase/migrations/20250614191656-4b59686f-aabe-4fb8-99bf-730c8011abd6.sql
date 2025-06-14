
-- Delete the user and all related data
-- This will cascade delete all related profile data due to foreign key constraints
DELETE FROM auth.users WHERE email = 'chandunaidugaru123@gmail.com';
