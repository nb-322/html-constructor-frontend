package models

import "time"

type ChangeLog struct {
	ID        int64  `json:"id" db:"id"`
	TplID     int64  `json:"tpl_id" db:"tpl_id"`
	OldHTML   string `json:"old_html" db:"old_html"`
	NewHTML   string `json:"new_html" db:"new_html"`
	ChangedBy int64  `json:"changed_by" db:"changed_by"`
	ChangedAt time.Time `json:"changed_at" db:"changed_at"`
}