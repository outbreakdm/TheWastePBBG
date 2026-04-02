-- Radio events: feed of events, contracts, and notifications
CREATE TABLE radio_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_radio_profile ON radio_events(profile_id);
CREATE INDEX idx_radio_unread ON radio_events(profile_id) WHERE is_read = FALSE;

-- RLS
ALTER TABLE radio_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own events"
  ON radio_events FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own events"
  ON radio_events FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own events"
  ON radio_events FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
