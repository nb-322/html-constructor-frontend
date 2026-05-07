package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "opd-backend/internal/dto"
    "opd-backend/internal/services"
    "opd-backend/internal/utils"
)

type TemplateReviewHandler struct {
    service *services.TemplateReviewService
}

func NewTemplateReviewHandler(service *services.TemplateReviewService) *TemplateReviewHandler {
    return &TemplateReviewHandler{service: service}
}

// SubmitTemplateForReview godoc
// @Summary Отправить шаблон на рассмотрение
// @Tags template-reviews
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.UpdateTemplateResponse
// @Router /api/templates/{id}/submit [patch]
func (h *TemplateReviewHandler) SubmitTemplateForReview(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    template, err := h.service.Submit(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "шаблон отправлен на рассмотрение",
        "template": template,
    })
}

// GetPendingTemplates godoc
// @Summary Получить шаблоны на рассмотрении
// @Tags template-reviews
// @Produce json
// @Success 200 {object} dto.GetPendingTemplatesResponse
// @Router /api/templates/pending [get]
func (h *TemplateReviewHandler) GetPendingTemplates(c *gin.Context) {
    templates, err := h.service.GetPending()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "templates": templates,
    })
}

// ApproveTemplate godoc
// @Summary Одобрить шаблон
// @Tags template-reviews
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.UpdateTemplateResponse
// @Router /api/templates/{id}/approve [patch]
func (h *TemplateReviewHandler) ApproveTemplate(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    adminID, err := utils.GetUserID(c)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    template, err := h.service.Approve(id, adminID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "шаблон одобрен",
        "template": template,
    })
}

// RejectTemplate godoc
// @Summary Отклонить шаблон
// @Tags template-reviews
// @Accept json
// @Produce json
// @Param id path int true "ID шаблона"
// @Param body body dto.RejectTemplateRequest true "Комментарий"
// @Success 200 {object} dto.UpdateTemplateResponse
// @Router /api/templates/{id}/reject [patch]
func (h *TemplateReviewHandler) RejectTemplate(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    adminID, err := utils.GetUserID(c)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    var req dto.RejectTemplateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    template, err := h.service.Reject(id, adminID, req.Comment)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "шаблон отклонён",
        "template": template,
    })
}

// GetTemplateReviews godoc
// @Summary Получить историю решений по шаблону
// @Tags template-reviews
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.GetTemplateReviewsResponse
// @Router /api/templates/{id}/reviews [get]
func (h *TemplateReviewHandler) GetTemplateReviews(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    reviews, err := h.service.GetReviews(id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "reviews": reviews,
    })
}