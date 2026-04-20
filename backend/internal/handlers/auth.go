package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "opd-backend/internal/services"
    "opd-backend/internal/dto"
)

type AuthHandler struct {
    service *services.UserService
}

func NewAuthHandler(service *services.UserService) *AuthHandler {
    return &AuthHandler{service: service}
}

// Register godoc
// @Summary Регистрация пользователя
// @Tags auth
// @Accept json
// @Produce json
// @Param input body dto.RegisterRequest true "Данные регистрации"
// @Success 200 {object} dto.RegisterResponse
// @Router /api/auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
    var req dto.RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user, err := h.service.Register(req.Login, req.Password, req.Role)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "пользователь создан",
        "user_id": user.ID,
        "login":   user.Login,
        "role":    user.Role,
    })
}

// Login godoc
// @Summary Логин
// @Tags auth
// @Accept json
// @Produce json
// @Param input body dto.LoginRequest true "Логин данные"
// @Success 200 {object} dto.LoginResponse
// @Router /api/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
    var req dto.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, err := h.service.Login(req.Login, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": token,
        "message": "успешный вход",
    })
}