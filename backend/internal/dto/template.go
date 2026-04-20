package dto

type CreateTemplateRequest struct {
	Name     string `json:"name" binding:"required" example:"Welcome template"`
	HTMLBody string `json:"html_body" binding:"required" example:"<h1>Hello</h1>"`
}

type UpdateTemplateRequest struct {
    Name     *string `json:"name"`
    HTMLBody *string `json:"html_body"`
}

type TemplateResponse struct {
	ID       int64  `json:"id" example:"1"`
	Name     string `json:"name" example:"Welcome template"`
	HTMLBody string `json:"html_body" example:"<h1>Hello</h1>"`
	CreatedBy   int64  `json:"created_by" example:"18"`
	CreatedAt   string `json:"created_at" example:"2024-06-01T12:00:00Z"`
	UpdatedBy   int64  `json:"updated_by" example:"18"`
	UpdatedAt   string `json:"updated_at" example:"2024-06-01T12:00:00Z"`
}

type CreateTemplateResponse struct {
	Message  string           `json:"message" example:"шаблон создан"`
	Template TemplateResponse `json:"template"`
}

type GetAllTemplatesResponse struct {
	Templates []TemplateResponse `json:"templates"`
}

type GetTemplateByIDResponse struct {
	Template TemplateResponse `json:"template"`
}

type UpdateTemplateResponse struct {
	Message  string           `json:"message" example:"шаблон обновлён"`
	Template TemplateResponse `json:"template"`
}

type DeleteTemplateResponse struct {
	Message string `json:"message" example:"шаблон удалён"`
}