package dto

type CreateSegmentRequest struct {
	Name string `json:"name" binding:"required" example:"VIP"`
	Description string `json:"description" binding:"required" example:"VIP клиенты"`
}

type UpdateSegmentRequest struct {
	Description *string `json:"description"`
}

type SegmentResponse struct {
	Name string `json:"name" example:"VIP"`
	Description string `json:"description" example:"VIP клиенты"`
	IsActive bool `json:"is_active" example:"true"`
}

type CreateSegmentResponse struct {
	Message string `json:"message" example:"сегмент создан"`
	Segment SegmentResponse `json:"segment"`
}

type GetAllSegmentsResponse struct {
	Segments []SegmentResponse `json:"segments"`
}


type UpdateSegmentResponse struct {
	Message  string           `json:"message" example:"сегмент обновлён"`
	Segment SegmentResponse `json:"segment"`
}

type ArchiveSegmentResponse struct {
    Message  string           `json:"message" example:"сегмент архивирован"`
    Segment SegmentResponse `json:"segment"`
}

type RestoreSegmentResponse struct {
    Message  string           `json:"message" example:"сегмент восстановлен"`
    Segment SegmentResponse `json:"segment"`
}