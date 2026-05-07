-- 000008_create_template_reviews_table.up.sql
CREATE TABLE IF NOT EXISTS template_reviews (
  id SERIAL PRIMARY KEY,
  tpl_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('одобрено', 'отклонено')),
  comment TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_template_reviews_tpl_id
      FOREIGN KEY (tpl_id)
      REFERENCES templates(tpl_id)
      ON DELETE CASCADE
      ON UPDATE RESTRICT,

    CONSTRAINT fk_template_reviews_admin_id
      FOREIGN KEY (admin_id)
      REFERENCES users(id)
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
)