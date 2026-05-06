package dto

type CreateSegmentRequest struct {
	Name string `json:"name" binding:"required" example:"VIP"`
	Description string `json:"description" binding:"required" example:"VIP клиенты"`
}

type UpdateSegmentRequest struct {
	Description *string `json:description`
}

type SegmentRespone struct {
	Name string `json:"name" example:"VIP"`
	Description string `json:"description" example:"VIP клиенты"`
	IsActive bool `json:"is_active" example:"true"`
}