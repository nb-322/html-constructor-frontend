package dto

type RegisterRequest struct {
	Login    string `json:"login" binding:"required" example:"user123"`
	Password string `json:"password" binding:"required" example:"pass123"`
	Role     string `json:"role" binding:"required,oneof=marketer analyst admin" example:"marketer"`
}

type LoginRequest struct {
	Login    string `json:"login" binding:"required" example:"user123"`
	Password string `json:"password" binding:"required" example:"pass123"`
}

type RegisterResponse struct {
	Message string `json:"message" example:"пользователь создан"`
	UserID  int64  `json:"user_id" example:"1"`
	Login   string `json:"login" example:"user123"`
	Role    string `json:"role" example:"marketer"`
}

type LoginResponse struct {
	Message string `json:"message" example:"успешный вход"`
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
}