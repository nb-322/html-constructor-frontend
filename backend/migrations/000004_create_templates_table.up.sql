-- 000005_create_templates_table.up.sql
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    html_body TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER NOT NULL,
    updated_by INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    deleted_by INTEGER NULL,

    CONSTRAINT fk_temlates_users_created
        FOREIGN KEY (created_by) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_temlates_users_update
      FOREIGN KEY (updated_by) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);