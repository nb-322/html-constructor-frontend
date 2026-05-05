-- 000003_create_campaigns_table.up.sql
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    tpl_id INTEGER NOT NULL,
    segment VARCHAR(255),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    deleted_by INTEGER NULL,

    CONSTRAINT fk_campaigns_templates
        FOREIGN KEY (tpl_id) 
        REFERENCES templates(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_campaigns_users
      FOREIGN KEY (created_by) 
      REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    
    CONSTRAINT fk_campaigns_segment
      FOREIGN KEY (segment)
      REFERENCES segments(name)
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
);