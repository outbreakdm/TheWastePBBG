-- Gear items: equipment owned by a profile, optionally assigned to a survivor
CREATE TABLE gear_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  survivor_id UUID REFERENCES survivors(id) ON DELETE SET NULL,
  slot TEXT NOT NULL CHECK (slot IN ('weapon', 'head', 'chest', 'legs', 'boots', 'backpack', 'trinket')),
  is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
  base_item_id TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'relic')),
  level INTEGER NOT NULL DEFAULT 1,
  affixes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gear_profile ON gear_items(profile_id);
CREATE INDEX idx_gear_survivor ON gear_items(survivor_id) WHERE survivor_id IS NOT NULL;

-- RLS
ALTER TABLE gear_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own gear"
  ON gear_items FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own gear"
  ON gear_items FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own gear"
  ON gear_items FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own gear"
  ON gear_items FOR DELETE
  USING (auth.uid() = profile_id);
