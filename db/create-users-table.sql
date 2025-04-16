-- Create a custom users table for username/password authentication
CREATE TABLE IF NOT EXISTS custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Update profiles table to reference custom_users
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD COLUMN IF NOT EXISTS custom_user_id UUID REFERENCES custom_users(id);

-- Update RLS policies for the new authentication system
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (custom_user_id = (SELECT id FROM custom_users WHERE username = current_setting('app.current_user', true)));
