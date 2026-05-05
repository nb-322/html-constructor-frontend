package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"opd-backend/internal/services"
	"opd-backend/internal/utils"
	"opd-backend/internal/dto"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{service: service}
}

// Register godoc
// @Summary Регистрация пользователя
// @Tags users
// @Accept json
// @Produce json
// @Param input body dto.RegisterRequest true "Данные регистрации"
// @Success 200 {object} dto.RegisterResponse
// @Router /api/users/register [post]
func (h *UserHandler) Register(c *gin.Context) {
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

// GetAllUsers godoc
// @Summary Получить всех не архивированных пользователей
// @Tags users
// @Produce json
// @Success 200 {object} dto.GetAllUsersResponse
// @Router /api/users [get]
func (h *UserHandler) GetAllUsers(c *gin.Context) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

// UpdateUser godoc
// @Summary Обновить пользователя
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "ID пользователя"
// @Param user body dto.UpdateUserRequest true "Данные пользователя"
// @Success 200 {object} dto.UpdateUserResponse
// @Router /api/users/{id} [patch]
func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.UpdateUser(id, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "пользователь обновлён",
		"user": user,
	})
}

// ArchiveUser godoc
// @Summary Архивировать пользователя
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "ID пользователя"
// @Success 200 {object} dto.ArchiveUserResponse
// @Router /api/users/{id}/archive [patch]
func (h *UserHandler) ArchiveUser(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    userID, err := utils.GetUserID(c)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    user, err := h.service.ArchiveUser(id, userID)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "пользователь архивирован",
        "user": user,
    })
}

// RestoreUser godoc
// @Summary Восстановить пользователя из архива
// @Tags users
// @Produce json
// @Param id path int true "ID пользователя"
// @Success 200 {object} dto.RestoreUserResponse
// @Router /api/users/{id}/restore [patch]
func (h *UserHandler) RestoreUser(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    user, err := h.service.RestoreUser(id)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "пользователь восстановлен",
        "user": user,
    })
}

// GetAllDeletedUsers godoc
// @Summary Получить всех архивированных пользователей
// @Tags users
// @Produce json
// @Success 200 {object} dto.GetAllUsersResponse
// @Router /api/users/archive [get]
func (h *UserHandler) GetAllDeletedUsers(c *gin.Context) {
	users, err := h.service.GetAllDeletedUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}