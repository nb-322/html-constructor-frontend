package dto

import "time"

type CreateCampaignRequest struct {
	TemplateID 	int64     `json:"tpl_id" binding:"required" example:"1"`
	Segment 		string    `json:"segment" binding:"required" example:"sport"`
	ScheduledAt 	time.Time `json:"scheduled_at" binding:"required" example:"2023-10-10T10:00:00Z"`
}

type UpdateCampaignRequest struct {
    Status string `json:"status" binding:"required" example:"scheduled"`
}

type CampaignResponse struct {
    ID          int64  `json:"id" example:"1"`
    TemplateID  int64  `json:"tpl_id" example:"1"`
    Segment     string `json:"segment" example:"sport"`
    ScheduledAt string `json:"scheduled_at" example:"2023-10-10T10:00:00Z"`
    Status      string `json:"status" example:"scheduled"`
    CreatedAt   string `json:"created_at" example:"2023-10-10T10:00:00Z"`
    CreatedBy   int64  `json:"created_by" example:"2"`
    IsDeleted bool     `json:"is_deleted" example:"false"`
    DeletedAt string `json:"deleted_at" example:"2024-06-01T12:00:00Z"`
    DeletedBy int64     `json:"deleted_by" example:"2"`
}

type CreateCampaignResponse struct {
	Message 	string `json:"message" example:"кампания создана"`
	Campaign 	*CampaignResponse `json:"campaign"`
}

type GetAllCampaignsResponse struct {
	Campaigns 	[]*CampaignResponse `json:"campaigns"`
}

type DeleteCampaignResponse struct {
	Message 	string `json:"message" example:"кампания удалена"`
}

type GetCampaignByIDResponse struct {
    Campaign CampaignResponse `json:"campaign"`
}

type UpdateCampaignResponse struct {
    Message  string           `json:"message" example:"статус обновлён"`
    Campaign CampaignResponse `json:"campaign"`
}

type ArchiveCampaignResponse struct {
    Message  string           `json:"message" example:"кампания архивирована"`
    Campaign CampaignResponse `json:"campaign"`
}

type RestoreCampaignResponse struct {
    Message  string           `json:"message" example:"кампания восстановлена"`
    Campaign CampaignResponse `json:"campaign"`
}