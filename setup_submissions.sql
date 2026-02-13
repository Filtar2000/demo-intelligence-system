-- 1. Create 'analyses' table (referenced by submissions) if it doesn't exist
CREATE TABLE IF NOT EXISTS analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamp DEFAULT now(),
  filename text NOT NULL,
  score integer,
  bpm numeric,
  energy numeric,
  lufs numeric,
  contrast numeric
);

-- Enable RLS for analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON analyses 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. Drop 'submissions' table to ensure clean state for Module 5
DROP TABLE IF EXISTS submissions;

-- 3. Create 'submissions' table for Mini CRM
CREATE TABLE submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamp DEFAULT now(),
  label_name text NOT NULL,
  track_name text,
  sent_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'sent' CHECK (status IN ('sent','opened','replied','rejected','signed')),
  notes text,
  follow_up_date date,
  analysis_id uuid REFERENCES analyses(id) -- Linked to analyses table
);

-- Enable RLS for submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policies for submissions
CREATE POLICY "Users see own submissions" ON submissions 
  FOR ALL USING (auth.uid() = user_id);
