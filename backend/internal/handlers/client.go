package handlers

import (
	"net/http"
	"opd-backend/internal/dto"
	"opd-backend/internal/services"
	"opd-backend/internal/utils"

	"strconv"

	"github.com/gin-gonic/gin"
)

type ClientHandler struct {
	service *services.ClientService
}

func NewClientHandler(service *services.ClientService) *ClientHandler {
	return &ClientHandler{service: service}
}

// CreateClient godoc
// @Summary Создать клиента
// @Tags clients
// @Accept json
// @Produce json
// @Param client body dto.CreateClientRequest true "Данные клиента"
// @Success 201 {object} dto.CreateClientResponse
// @Router /api/clients [post]
func (h *ClientHandler) CreateClient(c *gin.Context) {
	var req dto.CreateClientRequest

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
		"client":  client,
	})

}

// GetAllClients godoc
// @Summary Получить всех клиентов
// @Tags clients
// @Produce json
// @Success 200 {object} dto.GetAllClientsResponse
// @Router /api/clients [get]
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

// UpdateClient godoc
// @Summary Обновить клиента
// @Tags clients
// @Accept json
// @Produce json
// @Param id path int true "ID клиента"
// @Param client body dto.UpdateClientRequest true "Данные клиента"
// @Success 200 {object} dto.UpdateClientResponse
// @Router /api/clients/{id} [patch]
func (h *ClientHandler) UpdateClient(c *gin.Context) {

	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid id",
		})
		return
	}

	var req dto.UpdateClientRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	client, err := h.service.UpdateClient(id, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "клиент обновлён",
		"client":  client,
	})
}

// GetClientByID godoc
// @Summary Получить клиента по ID
// @Tags clients
// @Produce json
// @Param id path int true "ID клиента"
// @Success 200 {object} dto.ClientResponse
// @Router /api/clients/{id} [get]
func (h *ClientHandler) GetClientByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid  id"})
		return
	}

	client, err := h.service.GetClientByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "client not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"client": client,
	})
}

// ArchiveClient godoc
// @Summary Архивировать клиента
// @Tags clients
// @Produce json
// @Param id path int true "ID клиента"
// @Success 200 {object} dto.ArchiveClientResponse
// @Router /api/clients/{id}/archive [patch]
func (h *ClientHandler) ArchiveClient(c *gin.Context) {
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

	client, err := h.service.ArchiveClient(id, userID)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "клиент архивирован",
		"client": client,
	})
}

// RestoreClient godoc
// @Summary Восстановить клиента из архива
// @Tags clients
// @Produce json
// @Param id path int true "ID клиента"
// @Success 200 {object} dto.RestoreClientResponse
// @Router /api/clients/{id}/restore [patch]
func (h *ClientHandler) RestoreClient(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	client, err := h.service.RestoreClient(id)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "клиент восстановлен",
		"client": client,
	})
}

// GetAllDeeltedClients godoc
// @Summary Получить всех архивированных клиентов
// @Tags clients
// @Produce json
// @Success 200 {object} dto.GetAllClientsResponse
// @Router /api/clients/archive [get]
func (h *ClientHandler) GetAllDeeltedClients(c *gin.Context) {

	clients, err := h.service.GetAllDeletedClients()
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