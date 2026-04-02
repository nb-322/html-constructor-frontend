package models

import "time"

type Template struct {
    ID        int64     `json:"id" db:"id"`
    Name      string    `json:"name" db:"name"`
    HTMLBody  string    `json:"html_body" db:"html_body"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
    CreatedBy int64     `json:"created_by" db:"created_by"`
    UpdatedBy int64     `json:"updated_by" db:"updated_by"`
}