package handlers

import (
	"net/http"
	"opd-backend/internal/dto"
	"opd-backend/internal/services"
	"opd-backend/internal/utils"

	"strconv"

	"github.com/gin-gonic/gin"
)

type CampaignHandler struct {
	service *services.CampaignService
}

func NewCampaignHandler(service *services.CampaignService) *CampaignHandler {
	return &CampaignHandler{service: service}
}

// CreateCampaign godoc
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

	userID, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	campaign, err := h.service.CreateCampaign(req, userID)
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

// GetCampaignByID godoc
// @Summary Получить кампанию по ID
// @Tags campaigns
// @Produce json
// @Param id path int true "ID кампании"
// @Success 200 {object} dto.CampaignResponse
// @Router /api/campaigns/{id} [get]
func (h *CampaignHandler) GetCampaignByID(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    campaign, err := h.service.GetCampaignByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "campaign not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "campaign": campaign,
    })
}

// ArchiveCampaign godoc
// @Summary Архивировать кампанию
// @Tags campaigns
// @Produce json
// @Param id path int true "ID кампании"
// @Success 200 {object} dto.ArchiveCampaignResponse
// @Router /api/campaigns/{id}/archive [patch]
func (h *CampaignHandler) ArchiveCampaign(c *gin.Context) {
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

    campaign, err := h.service.ArchiveCampaign(id, userID)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "кампания архивирована",
        "campaign": campaign,
    })
}

// RestoreCampaign godoc
// @Summary Восстановить кампанию из архива
// @Tags campaigns
// @Produce json
// @Param id path int true "ID кампании"
// @Success 200 {object} dto.RestoreCampaignResponse
// @Router /api/campaigns/{id}/restore [patch]
func (h *CampaignHandler) RestoreCampaign(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    campaign, err := h.service.RestoreCampaign(id)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "кампания восстановлена",
        "campaign": campaign,
    })
}