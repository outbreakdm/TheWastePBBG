-- Materials: crafting resources per profile
CREATE TABLE materials (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  scrap INTEGER NOT NULL DEFAULT 0,
  parts INTEGER NOT NULL DEFAULT 0,
  cloth INTEGER NOT NULL DEFAULT 0,
  alloy INTEGER NOT NULL DEFAULT 0,
  relic_fragments INTEGER NOT NULL DEFAULT 0
);

-- RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own materials"
  ON materials FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own materials"
  ON materials FOR UPDATE
  USING (auth.uid() = profile_id);

-- Auto-create materials row when a profile is created
CREATE OR REPLACE FUNCTION handle_new_profile_materials()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO materials (profile_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_materials
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile_materials();
