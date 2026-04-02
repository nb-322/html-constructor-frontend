-- 000004_create_users_table.up.sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100),
    password_hash VARCHAR(255),
    role VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);