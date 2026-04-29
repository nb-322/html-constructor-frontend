package dto

import "time"

type CreateCampaignRequest struct {
	TemplateID 	int64     `json:"tpl_id" binding:"required" example:"1"`
	Segment 		string    `json:"segment" binding:"required" example:"sport"`
	ScheduledAt 	time.Time `json:"scheduled_at" binding:"required" example:"2023-10-10T10:00:00Z"`
	CreatedBy 	int64     `json:"created_by" binding:"required" example:"2"`
}

type UpdateCampaignRequest struct {
	Status 		string    `json:"status,omitempty" example:"active"`
}

type CampaignResponse struct {
	ID          int64     `json:"id" example:"1"`
	TemplateID 	int64     `json:"tpl_id" example:"1"`
	Segment 		string    `json:"segment" example:"sport"`
	ScheduledAt 	time.Time `json:"scheduled_at" example:"2023-10-10T10:00:00Z"`
	Status 		string    `json:"status" example:"active"`
	CreatedAt 	time.Time `json:"created_at" example:"2023-10-10T10:00:00Z"`
	CreatedBy 	int64     `json:"created_by" example:"2"`
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