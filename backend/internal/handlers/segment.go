package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"opd-backend/internal/services"
	"opd-backend/internal/dto"
)

type SegmentHandler struct {
	service *services.SegmentService
}

func NewSegmentHandler(service *services.SegmentService) *SegmentHandler {
	return &SegmentHandler{service: service}
}

// CreateSegment godoc
// @Summary Создать сегмент
// @Tags segments
// @Accept json
// @Produce json
// @Param segment body dto.CreateSegmentRequest true "Данные сегмента"
// @Success 201 {object} dto.CreateSegmentResponse
// @Router /api/segments [post]
func (h *SegmentHandler) CreateSegment(c *gin.Context) {
	var req dto.CreateSegmentRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	segment, err := h.service.CreateSegment(req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "сегмент создан",
		"segment": segment,
	})
}