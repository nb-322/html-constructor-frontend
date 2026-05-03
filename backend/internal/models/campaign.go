package models

import "time"

type Campaign struct {
	ID 				int64     `json:"id" db:"id"`
	TemplateID 	int64     `json:"tpl_id" db:"tpl_id"`
	Segment 		string    `json:"segment" db:"segment"`
	ScheduledAt 	time.Time `json:"scheduled_at" db:"scheduled_at"`
	Status 		string    `json:"status" db:"status"`
	CreatedAt 	time.Time `json:"created_at" db:"created_at"`
	CreatedBy 	int64     `json:"created_by" db:"created_by"`
	IsDeleted bool     `json:"is_deleted" db:"is_deleted"`
  DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
  DeletedBy int64     `json:"deleted_by" db:"deleted_by"`
}