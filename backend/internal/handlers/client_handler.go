package handlers

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"opd-backend/internal/services"	
)

type ClientHandler struct {
	service *services.ClientService
}

func NewClientHandler(service *services.ClientService) *ClientHandler {
	return &ClientHandler{service: service}
}

//  CreateClient - создаёт нового клиента
func (h *ClientHandler) CreateClient(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
		Segment string `json:"segment" binding:"required"`
		ConsentFlag bool `json:"consent_flag"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	client, err := h.service.CreateClient(req.Email, req.Segment, req.ConsentFlag)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}


	c.JSON(http.StatusCreated, gin.H{
		"message": "клиент создан",
		"client": client,
	})
	
}

// GetAllClients - возвращает всех клиентов
func (h *ClientHandler) GetAllClients(c *gin.Context) {

	clients, err := h.service.GetAllClients()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"clients": clients,
	})
}

// UpdateClient - обновляет клиента
func (h *ClientHandler) UpdateClient(c *gin.Context) {

	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid id",
		})
		return
	}

	var req struct {
		Email string `json:"email" binding:"required"`
		Segment string `json:"segment" binding:"required"`
		ConsentFlag bool `json:"consent_flag"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	client, err := h.service.UpdateClient(id, req.Email, req.Segment, req.ConsentFlag)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "клиент обновлён",
		"client": client,
	})
}

// DeleteClient - удаляет клиента
func (h *ClientHandler) DeleteClient(c *gin.Context) {

	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid id",
		})
		return
	}

	if err := h.service.DeleteClient(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "клиент удалён",
	})
}