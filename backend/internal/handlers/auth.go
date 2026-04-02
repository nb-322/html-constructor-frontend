package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "opd-backend/internal/services"
)

type AuthHandler struct {
    service *services.UserService
}

func NewAuthHandler(service *services.UserService) *AuthHandler {
    return &AuthHandler{service: service}
}

type RegisterRequest struct {
    Login    string `json:"login" binding:"required"`
    Password string `json:"password" binding:"required"`
    Role     string `json:"role" binding:"required,oneof=marketer analyst admin"`
}

type LoginRequest struct {
    Login    string `json:"login" binding:"required"`
    Password string `json:"password" binding:"required"`
}

// Register godoc
// @Summary Регистрация пользователя
func (h *AuthHandler) Register(c *gin.Context) {
    var req RegisterRequest
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
// @Summary Авторизация и получение JWT
func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
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
        "message": "успешная авторизация",
    })
}