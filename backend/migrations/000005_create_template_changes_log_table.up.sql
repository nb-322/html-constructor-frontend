-- 000003_create_template_changes_log_table.up.sql
CREATE TABLE IF NOT EXISTS template_changes_log (
    id SERIAL PRIMARY KEY,
    tpl_id INTEGER NOT NULL,
    old_html TEXT,
    new_html TEXT,
    changed_by INTEGER NOT NULL,
    changed_at TIMESTAMP,

    CONSTRAINT fk_template_changes_log_templates
        FOREIGN KEY (tpl_id) 
        REFERENCES templates(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_template_changes_log_users
      FOREIGN KEY (changed_by) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);