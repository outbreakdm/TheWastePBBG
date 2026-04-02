-- World progress: tracks which nodes have been cleared
CREATE TABLE world_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  region TEXT NOT NULL CHECK (region IN ('dust_flats', 'dead_blocks', 'ash_marsh', 'the_spine')),
  sector INTEGER NOT NULL CHECK (sector BETWEEN 1 AND 10),
  node_index INTEGER NOT NULL,
  is_cleared BOOLEAN NOT NULL DEFAULT FALSE,
  best_time_ms INTEGER,
  UNIQUE(profile_id, region, sector, node_index)
);

CREATE INDEX idx_progress_profile ON world_progress(profile_id);

-- RLS
ALTER TABLE world_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON world_progress FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own progress"
  ON world_progress FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own progress"
  ON world_progress FOR UPDATE
  USING (auth.uid() = profile_id);
