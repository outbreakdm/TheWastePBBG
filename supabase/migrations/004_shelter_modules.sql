-- Shelter modules: 6 upgradeable modules per profile
CREATE TABLE shelter_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL CHECK (module_type IN ('bedroll', 'cookfire', 'workbench', 'locker', 'barricade', 'radio')),
  tier INTEGER NOT NULL DEFAULT 1 CHECK (tier BETWEEN 1 AND 5),
  task_started_at TIMESTAMPTZ,
  task_recipe_id TEXT,
  UNIQUE(profile_id, module_type)
);

CREATE INDEX idx_shelter_profile ON shelter_modules(profile_id);

-- RLS
ALTER TABLE shelter_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own shelter"
  ON shelter_modules FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own shelter"
  ON shelter_modules FOR UPDATE
  USING (auth.uid() = profile_id);

-- Auto-create 6 modules when a profile is created
CREATE OR REPLACE FUNCTION handle_new_profile_shelter()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO shelter_modules (profile_id, module_type) VALUES
    (NEW.id, 'bedroll'),
    (NEW.id, 'cookfire'),
    (NEW.id, 'workbench'),
    (NEW.id, 'locker'),
    (NEW.id, 'barricade'),
    (NEW.id, 'radio');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_shelter
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile_shelter();
