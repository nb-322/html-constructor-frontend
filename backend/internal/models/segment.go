package models

type Segment struct {
	Name string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
	IsActive bool `json:"is_active" db:"is_active"`
}