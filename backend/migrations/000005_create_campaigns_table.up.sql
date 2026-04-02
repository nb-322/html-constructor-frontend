-- 000003_create_campaigns_table.up.sql
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    tpl_id INTEGER NOT NULL,
    segment VARCHAR(255),
    scheduled_at TIMESTAMP,
    status VARCHAR(255),
    created_at TIMESTAMP,
    created_by INTEGER NOT NULL,

    CONSTRAINT fk_campaigns_templates
        FOREIGN KEY (tpl_id) 
        REFERENCES templates(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_campaigns_users
      FOREIGN KEY (created_by) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);