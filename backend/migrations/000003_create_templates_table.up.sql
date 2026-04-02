-- 000005_create_templates_table.up.sql
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    html_body TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER NOT NULL,
    updated_by INTEGER NOT NULL,

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