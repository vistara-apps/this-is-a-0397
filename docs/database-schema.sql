-- RightsGuard Database Schema for Supabase
-- This file contains the SQL commands to create the necessary tables
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction logs table
CREATE TABLE IF NOT EXISTS interaction_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  notes TEXT,
  duration TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State guides cache table
CREATE TABLE IF NOT EXISTS state_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name TEXT NOT NULL UNIQUE,
  dos_and_donts TEXT[] NOT NULL,
  donts TEXT[] NOT NULL,
  legal_info TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Key phrases cache table (optional - for caching OpenAI responses)
CREATE TABLE IF NOT EXISTS key_phrases_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('en', 'es')),
  phrases JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language)
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferred_state TEXT,
  auto_location BOOLEAN DEFAULT TRUE,
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- State guides and key phrases cache are public (no RLS needed)

-- RLS Policies

-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see and modify their own interaction logs
CREATE POLICY "Users can view own logs" ON interaction_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON interaction_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" ON interaction_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs" ON interaction_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see and modify their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own subscription history
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription history" ON subscription_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- State guides are publicly readable (no authentication required)
CREATE POLICY "State guides are publicly readable" ON state_guides
  FOR SELECT TO anon, authenticated USING (true);

-- Key phrases cache is publicly readable
CREATE POLICY "Key phrases are publicly readable" ON key_phrases_cache
  FOR SELECT TO anon, authenticated USING (true);

-- Functions and Triggers

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interaction_logs_updated_at BEFORE UPDATE ON interaction_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_guides_updated_at BEFORE UPDATE ON state_guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_key_phrases_cache_updated_at BEFORE UPDATE ON key_phrases_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (user_id, email, subscription_status, preferred_language)
  VALUES (NEW.id, NEW.email, 'free', 'en');
  
  INSERT INTO user_preferences (user_id, auto_location)
  VALUES (NEW.id, true);
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interaction_logs_user_id ON interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_logs_timestamp ON interaction_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_state_guides_state_name ON state_guides(state_name);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);

-- Sample data for testing (optional)
INSERT INTO state_guides (state_name, dos_and_donts, donts, legal_info) VALUES
('California', 
 ARRAY['Remain calm and be polite', 'Keep your hands visible at all times', 'Provide your identification when legally required'],
 ARRAY['Don''t resist physically', 'Don''t consent to searches without a warrant', 'Don''t answer questions beyond basic identification'],
 ARRAY['Right to remain silent (Miranda Rights)', 'Right to refuse consent to vehicle or property searches', 'Right to ask if you''re being detained']
) ON CONFLICT (state_name) DO NOTHING;

INSERT INTO key_phrases_cache (language, phrases) VALUES
('en', '[
  {
    "scenario": "Vehicle Stop",
    "phrases": [
      {"context": "When pulled over", "text": "Officer, I am going to reach for my license and registration now."},
      {"context": "If asked about searches", "text": "I do not consent to any searches."}
    ]
  }
]'::jsonb),
('es', '[
  {
    "scenario": "Parada de Vehículo",
    "phrases": [
      {"context": "Cuando te detienen", "text": "Oficial, voy a alcanzar mi licencia y registro ahora."},
      {"context": "Si preguntan sobre registros", "text": "No consiento ningún registro."}
    ]
  }
]'::jsonb)
ON CONFLICT (language) DO NOTHING;
