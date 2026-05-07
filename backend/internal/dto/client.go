package dto

type CreateClientRequest struct {
	Email string `json:"email" binding:"required" example:"mirea@mail.ru"`
	Segment string `json:"segment" binding:"required" example:"sport"`
	ConsentFlag bool `json:"consent_flag" example:"true"`
}

type UpdateClientRequest struct {
	Email *string `json:"email" example:"mirea@mail.ru"`
	Segment *string `json:"segment" example:"sport"`
	ConsentFlag *bool `json:"consent_flag" example:"true"`
}

type ClientResponse struct {
	ID int64 `json:"client_id" example:"1"`
	Email string `json:"email" example:"mirea@mail.ru"`
	Segment string `json:"segment" example:"sport"`
	ConsentFlag bool `json:"consent_flag" example:"true"`
	CreatedAt string `json:"created_at" example:"2024-06-01T12:00:00Z"`
	UpdatedAt string `json:"updated_at" example:"2026-11-05T12:00:00Z"`
	IsDeleted bool     `json:"is_deleted" example:"false"`
  DeletedAt string `json:"deleted_at" example:"2024-06-01T12:00:00Z"`
  DeletedBy int64     `json:"deleted_by" example:"2"`
}

type CreateClientResponse struct {
	Message string `json:"message" example:"клиент создан"`
	Client ClientResponse `json:"client"`
}

type GetAllClientsResponse struct {
	Clients []ClientResponse `json:"clients"`
}

type UpdateClientResponse struct {
	Message string `json:"message" example:"клиент обновлён"`
	Client ClientResponse `json:"client"`
}

type DeleteClientResponse struct {
	Message string `json:"message" example:"клиент удалён"`
}

type ArchiveClientResponse struct {
	Message  string           `json:"message" example:"клиент архивирован"`
  Client ClientResponse `json:"client"`
}

type RestoreClientResponse struct {
    Message  string           `json:"message" example:"клиент восстановлен"`
    Client ClientResponse `json:"client"`
}