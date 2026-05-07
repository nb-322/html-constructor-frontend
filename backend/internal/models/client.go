package models

import "time"

type Client struct {
	ID                  int64         `json:"client_id" db:"client_id"`
	Email             string        `json:"email" db:"email"`
	Segment       string        `json:"segment" db:"segment"`
	ConsentFlag bool         `json:"consent_flag" db:"consent_flag"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
	IsDeleted bool     `json:"is_deleted" db:"is_deleted"`
  DeletedAt *time.Time `json:"deleted_at" db:"deleted_at"`
  DeletedBy *int64     `json:"deleted_by" db:"deleted_by"`
}
