-- 000001_create_segments_table.up.sql
CREATE TABLE IF NOT EXISTS segments (
    name VARCHAR(50) PRIMARY KEY,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);