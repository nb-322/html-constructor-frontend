package dto

type UpdateUserRequest struct {
	Login     *string    `json:"login"`
  Role      *string    `json:"role"`
}

type UserResponse struct {
	ID        int       `json:"id" example:"1"`
  Login     string    `json:"login" example:"mirea@example.com"`
  Role      string    `json:"role" example:"маркетолог"`
  CreatedAt string `json:"created_at" example:"2024-06-01T12:00:00Z"`
  IsDeleted bool     `json:"is_deleted" example:"false"`
  DeletedAt string `json:"deleted_at" example:"2024-06-01T12:00:00Z"`
  DeletedBy int64     `json:"deleted_by" example:"2"`
}

type GetAllUsersResponse struct {
	Users []UserResponse `json:"users"`
}

type UpdateUserResponse struct {
	Message  string           `json:"message" example:"пользователь обновлён"`
	User UserResponse `json:"user"`
}

type ArchiveUserResponse struct {
    Message  string           `json:"message" example:"пользователь архивирован"`
    User UserResponse `json:"user"`
}

type RestoreUserResponse struct {
    Message  string           `json:"message" example:"пользователь восстановлен"`
    User UserResponse `json:"user"`
}