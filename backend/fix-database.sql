-- Drop the old unique constraint on role_name
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS uk_40fvvy071dnqy9tywk6ei7f5r;

-- Add a new composite unique constraint on (user_id, role_name)
ALTER TABLE user_roles ADD CONSTRAINT uk_user_role UNIQUE (user_id, role_name);

-- Verify the change
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'user_roles';
