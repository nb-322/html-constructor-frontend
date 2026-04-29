package handlers

import (
	"net/http"
	"opd-backend/internal/dto"
	"opd-backend/internal/services"

	"github.com/gin-gonic/gin"
	"strconv"
)

type CampaignHandler struct {
	service *services.CampaignService
}

func NewCampaignHandler(service *services.CampaignService) *CampaignHandler {
	return &CampaignHandler{service: service}
}

// CreateCampaigngodoc
// @Summary Создать кампанию
// @Tags campaigns
// @Accept json
// @Produce json
// @Param campaign body dto.CreateCampaignRequest true "Данные кампании"
// @Success 201 {object} dto.CreateCampaignResponse
// @Router /api/campaigns [post]
func (h *CampaignHandler) CreateCampaign(c *gin.Context) {
	var req dto.CreateCampaignRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	campaign, err := h.service.CreateCampaign(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message":  "кампания создана",
		"campaign": campaign,
	})
}

// GetAllCampaigns godoc
// @Summary Получить все кампании
// @Tags campaigns
// @Produce json
// @Success 200 {object} dto.GetAllCampaignsResponse
// @Router /api/campaigns [get]
func (h *CampaignHandler) GetAllCampaigns(c *gin.Context) {
	campaigns, err := h.service.GetAllCampaigns()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"campaigns": campaigns,
	})
}

// UpdateStatus godoc
// @Summary Обновить статус кампании
// @Tags campaigns
// @Accept json
// @Produce json
// @Param id path int true "ID кампании"
// @Param status body dto.UpdateCampaignRequest true "Новый статус кампании"
// @Success 200 {object} dto.CampaignResponse
// @Router /api/campaigns/{id} [patch]
func (h *CampaignHandler) UpdateStatus(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid campaign ID",
		})
		return
	}

	var req dto.UpdateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	campaign, err := h.service.UpdateStatus(id, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"campaign": campaign,
	})
}

// DeleteCampaign godoc
// @Summary Удалить кампанию
// @Tags campaigns
// @Param id path int true "ID кампании"
// @Success 200 {object} dto.DeleteCampaignResponse
// @Router /api/campaigns/{id} [delete]
func (h *CampaignHandler) DeleteCampaign(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid campaign ID",
		})
		return
	}
	err = h.service.DeleteCampaign(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "кампания удалена",
	})
}