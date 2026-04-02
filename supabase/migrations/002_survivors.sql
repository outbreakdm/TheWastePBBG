-- Survivors table: individual characters owned by a profile
CREATE TABLE survivors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('scavenger', 'bruiser', 'runner', 'tinkerer', 'warden')),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  -- Base stats
  str INTEGER NOT NULL DEFAULT 5,
  def INTEGER NOT NULL DEFAULT 5,
  agi INTEGER NOT NULL DEFAULT 5,
  per INTEGER NOT NULL DEFAULT 5,
  vit INTEGER NOT NULL DEFAULT 5,
  wil INTEGER NOT NULL DEFAULT 5,
  -- Resource state
  stamina INTEGER NOT NULL DEFAULT 60,
  stamina_max INTEGER NOT NULL DEFAULT 60,
  hunger INTEGER NOT NULL DEFAULT 0,       -- 0 = full, 100 = starving
  hp INTEGER NOT NULL DEFAULT 160,
  hp_max INTEGER NOT NULL DEFAULT 160,
  -- Progression
  skill_slots JSONB NOT NULL DEFAULT '[]',
  trait_ids JSONB NOT NULL DEFAULT '[]',
  stat_points INTEGER NOT NULL DEFAULT 0,
  is_alive BOOLEAN NOT NULL DEFAULT TRUE,
  -- Timestamps
  stamina_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  hunger_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from profiles to survivors
ALTER TABLE profiles
  ADD CONSTRAINT fk_active_survivor
  FOREIGN KEY (active_survivor_id) REFERENCES survivors(id) ON DELETE SET NULL;

CREATE INDEX idx_survivors_profile ON survivors(profile_id);

-- RLS
ALTER TABLE survivors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own survivors"
  ON survivors FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own survivors"
  ON survivors FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own survivors"
  ON survivors FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own survivors"
  ON survivors FOR DELETE
  USING (auth.uid() = profile_id);
