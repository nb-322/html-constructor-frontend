package models

import "time"

type User struct {
    ID        int       `json:"id" db:"id"`
    Login     string    `json:"login" db:"login"`
    Password  string    `json:"-" db:"password_hash"`
    Role      string    `json:"role" db:"role"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    IsDeleted bool     `json:"is_deleted" db:"is_deleted"`
    DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
    DeletedBy int64     `json:"deleted_by" db:"deleted_by"`
}