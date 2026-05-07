package models

import "time"

type TemplateReview struct {
	ID         int64     `json:"id" db:"id"`
    TplID      int64     `json:"tpl_id" db:"tpl_id"`
    AdminID    int64     `json:"admin_id" db:"admin_id"`
    Status     string    `json:"status" db:"status"`
    Comment    *string   `json:"comment" db:"comment"`
    ReviewedAt time.Time `json:"reviewed_at" db:"reviewed_at"`
}