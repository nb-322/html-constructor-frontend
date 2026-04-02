package services

import (
	"errors"
	"opd-backend/internal/models"
	"opd-backend/internal/repositories"
)

type TemplateService struct {
	repo *repositories.TemplateRepository
}

func NewTemplateService(repo *repositories.TemplateRepository) *TemplateService {
	return &TemplateService{repo: repo}
}

// CreateTemplate создаёт новый шаблон
func (s *TemplateService) CreateTemplate(name, htmlBody string, userID int64) (*models.Template, error) {
	if name == "" {
		return nil, errors.New("name is required")
	}
	if htmlBody == "" {
		return nil, errors.New("html_body is required")
	}

	template := &models.Template{
		Name:      name,
		HTMLBody:  htmlBody,
		CreatedBy: userID,
		UpdatedBy: userID,
	}

	return s.repo.Create(template)
}

// GetAllTemplates возвращает все шаблоны
func (s *TemplateService) GetAllTemplates() ([]*models.Template, error) {
	return s.repo.GetAll()
}

// GetTemplateByID возвращает шаблон по ID
func (s *TemplateService) GetTemplateByID(id int64) (*models.Template, error) {
	return s.repo.GetByID(id)
}

// UpdateTemplate обновляет шаблон
func (s *TemplateService) UpdateTemplate(id int64, name, htmlBody string, userID int64) (*models.Template, error) {
	template, err := s.repo.GetByID(id)
	if err != nil {
		return nil, errors.New("template not found")
	}

	template.Name = name
	template.HTMLBody = htmlBody
	template.UpdatedBy = userID

	return s.repo.Update(template)
}

// DeleteTemplate удаляет шаблон
func (s *TemplateService) DeleteTemplate(id int64) error {
	return s.repo.Delete(id)
}