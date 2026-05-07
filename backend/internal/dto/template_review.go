package dto

type RejectTemplateRequest struct {
    Comment string `json:"comment" binding:"required"`
}

type TemplateReviewResponse struct {
    ID         int64   `json:"id"`
    TplID      int64   `json:"tpl_id"`
    AdminID    int64   `json:"admin_id"`
    Status     string  `json:"status"`
    Comment    *string `json:"comment"`
    ReviewedAt string  `json:"reviewed_at"`
}

type GetTemplateReviewsResponse struct {
    Reviews []TemplateReviewResponse `json:"reviews"`
}

type GetPendingTemplatesResponse struct {
    Templates []TemplateResponse `json:"templates"`
}