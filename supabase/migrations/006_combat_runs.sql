-- Combat runs: records of each exploration/combat attempt
CREATE TABLE combat_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  survivor_id UUID NOT NULL REFERENCES survivors(id),
  region TEXT NOT NULL,
  sector INTEGER NOT NULL,
  node_index INTEGER NOT NULL,
  seed BIGINT NOT NULL,
  result TEXT CHECK (result IN ('victory', 'defeat', 'fled')),
  loot_json JSONB,
  stamina_spent INTEGER,
  hp_lost INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_runs_profile ON combat_runs(profile_id);
CREATE INDEX idx_runs_survivor ON combat_runs(survivor_id);

-- RLS
ALTER TABLE combat_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own runs"
  ON combat_runs FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own runs"
  ON combat_runs FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own runs"
  ON combat_runs FOR UPDATE
  USING (auth.uid() = profile_id);
