package models

import "time"

type Clients struct {
	ID           int64     `json: "id" db:"id`
	Email        string    `json: "email" db:"email"`
	Segment      string    `json: "segment" db:"segment"`
	Consetn_flag bool      `json: "consent_flag" db:"consent_flag"`
	CreatedAt    time.Time `json: "created_at" db:"created_at"`
	UpdatedAt    time.Time `json: "updated_at" db:"updated_at"`
}
