package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"opd-backend/internal/services"
)

type TemplateHandler struct {
	service *services.TemplateService
}

func NewTemplateHandler(service *services.TemplateService) *TemplateHandler {
	return &TemplateHandler{service: service}
}

// CreateTemplate godoc
// @Summary Создать шаблон
// @Tags templates
// @Accept json
// @Produce json
// @Param template body object true "Данные шаблона"
// @Success 201 {object} object
// @Router /api/templates [post]
func (h *TemplateHandler) CreateTemplate(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		HTMLBody string `json:"html_body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Получить userID из токена (сейчас заглушка)
	userID := int64(1)

	template, err := h.service.CreateTemplate(req.Name, req.HTMLBody, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "шаблон создан",
		"template": template,
	})
}

// GetAllTemplates godoc
// @Summary Получить все шаблоны
// @Tags templates
// @Produce json
// @Success 200 {array} object
// @Router /api/templates [get]
func (h *TemplateHandler) GetAllTemplates(c *gin.Context) {
	templates, err := h.service.GetAllTemplates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"templates": templates,
	})
}

// GetTemplateByID godoc
// @Summary Получить шаблон по ID
// @Tags templates
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} object
// @Router /api/templates/{id} [get]
func (h *TemplateHandler) GetTemplateByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	template, err := h.service.GetTemplateByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "template not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"template": template,
	})
}

// UpdateTemplate godoc
// @Summary Обновить шаблон
// @Tags templates
// @Accept json
// @Produce json
// @Param id path int true "ID шаблона"
// @Param template body object true "Данные шаблона"
// @Success 200 {object} object
// @Router /api/templates/{id} [put]
func (h *TemplateHandler) UpdateTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req struct {
		Name     string `json:"name" binding:"required"`
		HTMLBody string `json:"html_body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Получить userID из токена
	userID := int64(1)

	template, err := h.service.UpdateTemplate(id, req.Name, req.HTMLBody, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "шаблон обновлён",
		"template": template,
	})
}

// DeleteTemplate godoc
// @Summary Удалить шаблон
// @Tags templates
// @Param id path int true "ID шаблона"
// @Success 200 {object} object
// @Router /api/templates/{id} [delete]
func (h *TemplateHandler) DeleteTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.DeleteTemplate(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "шаблон удалён",
	})
}