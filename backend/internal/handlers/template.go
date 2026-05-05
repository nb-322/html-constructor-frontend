package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"opd-backend/internal/services"
	"opd-backend/internal/utils"
	"opd-backend/internal/dto"
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
// @Param template body dto.CreateTemplateRequest true "Данные шаблона"
// @Success 201 {object} dto.CreateTemplateResponse
// @Router /api/templates [post]
func (h *TemplateHandler) CreateTemplate(c *gin.Context) {
	var req dto.CreateTemplateRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получение userID из токена
	userID, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	template, err := h.service.CreateTemplate(req.Name, req.HTMLBody, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "шаблон создан",
		"template": template,
	})
}

// GetAllTemplates godoc
// @Summary Получить все не архивированные шаблоны
// @Tags templates
// @Produce json
// @Success 200 {object} dto.GetAllTemplatesResponse
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
// @Success 200 {object} dto.GetTemplateByIDResponse
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

// GetTemplatesByUserID godoc
// @Summary Получить шаблоны, созданные пользователем
// @Tags templates
// @Produce json
// @Success 200 {object} dto.GetTemplatesByUserIDResponse
// @Router /api/templates/user [get]
func (h *TemplateHandler) GetTemplatesByUserID(c *gin.Context) {
	
	// Получение userID из токена
	userID, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	templates, err := h.service.GetTemplatesByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"templates": templates,
	})
}

// UpdateTemplate godoc
// @Summary Обновить шаблон
// @Tags templates
// @Accept json
// @Produce json
// @Param id path int true "ID шаблона"
// @Param template body dto.UpdateTemplateRequest true "Данные шаблона"
// @Success 200 {object} dto.UpdateTemplateResponse
// @Router /api/templates/{id} [patch]
func (h *TemplateHandler) UpdateTemplate(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// userID только из токена
	userID, err := utils.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	template, err := h.service.UpdateTemplate(id, req, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "шаблон обновлён",
		"template": template,
	})
}

// ArchiveTemplate godoc
// @Summary Архивировать шаблон
// @Tags templates
// @Accept json
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.ArchiveTemplateResponse
// @Router /api/templates/{id}/archive [patch]
func (h *TemplateHandler) ArchiveTemplate(c *gin.Context) {
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

    template, err := h.service.ArchiveTemplate(id, userID)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "шаблон архивирован",
        "template": template,
    })
}

// RestoreTemplate godoc
// @Summary Восстановить шаблон из архива
// @Tags templates
// @Produce json
// @Param id path int true "ID шаблона"
// @Success 200 {object} dto.RestoreTemplateResponse
// @Router /api/templates/{id}/restore [patch]
func (h *TemplateHandler) RestoreTemplate(c *gin.Context) {
    id, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }

    template, err := h.service.RestoreTemplate(id)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "шаблон восстановлен",
        "template": template,
    })
}

// GetAllDeletedTemplates godoc
// @Summary Получить все архивированные шаблоны
// @Tags templates
// @Produce json
// @Success 200 {object} dto.GetAllTemplatesResponse
// @Router /api/templates/archive [get]
func (h *TemplateHandler) GetAllDeletedTemplates(c *gin.Context) {
	templates, err := h.service.GetAllDeletedTemplates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"templates": templates,
	})
}