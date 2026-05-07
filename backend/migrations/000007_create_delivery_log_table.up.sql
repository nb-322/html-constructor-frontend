-- 000007_create_delivery_log_table.up.sql
CREATE TABLE IF NOT EXISTS delivery_log (
  log_id SERIAL PRIMARY KEY,
    camp_id INTEGER,
    client_id INTEGER NOT NULL,
    status VARCHAR(255),
    ts TIMESTAMP,
    error TEXT,
    request_id VARCHAR(255),
    attempt INTEGER,

    CONSTRAINT fk_delivery_log_client 
        FOREIGN KEY (client_id) 
      REFERENCES clients(client_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_delivery_log_campaigns
      FOREIGN KEY (camp_id) 
        REFERENCES campaigns(camp_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);