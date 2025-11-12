-- Enable UUID generator extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the readings table
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  level NUMERIC NOT NULL,
  unit TEXT DEFAULT 'mg/dL',
  context TEXT,
  label TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
