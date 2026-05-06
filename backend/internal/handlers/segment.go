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

// GetAllSegments godoc
// @Summary Получить все не архивированные сегменты
// @Tags segments
// @Produce json
// @Success 200 {object} dto.GetAllSegmentsResponse
// @Router /api/segments [get]
func (h *SegmentHandler) GetAllSegments(c *gin.Context) {
	segments, err := h.service.GetAllDeletedSegments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"segments": segments,
	})
}

// UpdateSegment godoc
// @Summary Обновить шаблон
// @Tags segments
// @Accept json
// @Produce json
// @Param id path int true "Название сегмента"
// @Param segment body dto.UpdateSegmentRequest true "Данные сегмента"
// @Success 200 {object} dto.UpdateSegmentResponse
// @Router /api/segments/{id} [patch]
func (h *SegmentHandler) UpdateSegment(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name"})
		return
	}

	var req dto.UpdateSegmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	segment, err := h.service.UpdateSegment(name, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "сегмент обновлён",
		"segment": segment,
	})
}

// ArchiveSegment godoc
// @Summary Архивировать сегмент
// @Tags segments
// @Accept json
// @Produce json
// @Param id path int true "Название сегмента"
// @Success 200 {object} dto.ArchiveSegmentResponse
// @Router /api/segments/{id}/archive [patch]
func (h *SegmentHandler) ArchiveSegment(c *gin.Context) {
  name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name"})
		return
	}

    segment, err := h.service.ArchiveSegment(name)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "сегмент архивирован",
        "segment": segment,
    })
}

// @Summary Восстановить шаблон из архива
// @Tags templates
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.RestoreTemplateResponse
// @Router /api/templates/{id}/restore [patch]
func (h *SegmentHandler) RestoreSegment(c *gin.Context) {
  name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name"})
		return
	}

    segment, err := h.service.RestoreSegment(name)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "сегмент восстановлен",
        "segment": segment,
    })
}


// Добавить ещё