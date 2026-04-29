package handlers

import (
	"net/http"
	"opd-backend/internal/dto"
	"opd-backend/internal/services"
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
// @Param client body dto.CreateClientRequest true "Данные шаблона"
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
// @Param template body dto.UpdateClientRequest true "Данные шаблона"
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

// DeleteClient godoc
// @Summary Удалить шаблон
// @Tags templates
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.DeleteClientResponse
// @Router /api/templates/{id} [delete]
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
