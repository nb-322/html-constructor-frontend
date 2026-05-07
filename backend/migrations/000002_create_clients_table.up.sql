-- 000002_create_clients_table.up.sql
CREATE TABLE IF NOT EXISTS clients (
    client_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    segment VARCHAR(255),
    consent_flag BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    deleted_by INTEGER NULL,

    CONSTRAINT fk_clients_segment
        FOREIGN KEY (segment)
        REFERENCES segments(name)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);