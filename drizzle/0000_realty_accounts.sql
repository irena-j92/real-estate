CREATE TABLE realty_profiles (
  user_id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  alerts INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE realty_saved (
  user_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, property_id)
);
