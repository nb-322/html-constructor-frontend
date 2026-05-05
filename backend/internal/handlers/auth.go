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