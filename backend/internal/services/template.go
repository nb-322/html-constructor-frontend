package services

import (
	"errors"
	"opd-backend/internal/models"
	"opd-backend/internal/repositories"
	"opd-backend/internal/dto"
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

// GetAllTemplates возвращает все не архивированные шаблоны
func (s *TemplateService) GetAllTemplates() ([]*models.Template, error) {
	return s.repo.GetAll()
}

// GetTemplateByID возвращает шаблон по ID
func (s *TemplateService) GetTemplateByID(id int64) (*models.Template, error) {
	return s.repo.GetByID(id)
}

// GetTemplatesByUserID возвращает шаблоны, созданные определённым пользователем
func (s *TemplateService) GetTemplatesByUserID(userID int64) ([]*models.Template, error) {
	return s.repo.GetByUserID(userID)
}

// UpdateTemplate обновляет шаблон
func (s *TemplateService) UpdateTemplate(
	id int64,
	req dto.UpdateTemplateRequest,
	userID int64,
) (*models.Template, error) {

	template, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// PATCH логика
	if req.Name != nil {
		template.Name = *req.Name
	}

	if req.HTMLBody != nil {
		template.HTMLBody = *req.HTMLBody
	}

	template.UpdatedBy = userID

	return s.repo.Update(template)
}

// ArchiveTemplate архивирует шаблон
func (s *TemplateService) ArchiveTemplate(id int64, userID int64) (*models.Template, error) {
	template, err := s.repo.GetByIDWithDeleted(id)
	if err != nil {
		return nil, err
	}

	if template.IsDeleted {
		return nil, errors.New("шаблон уже архивирован")
	}

	return s.repo.Archive(id, userID)
}

// RestoreTemplate архивирует шаблон
func (s *TemplateService) RestoreTemplate(id int64) (*models.Template, error) {
    template, err := s.repo.GetByIDWithDeleted(id)
    if err != nil {
        return nil, err
    }

    if !template.IsDeleted {
        return nil, errors.New("шаблон не архивирован")
    }

    return s.repo.Restore(id)
}

// GetAllDeleted возвращает все архивированные шаблоны
func (s *TemplateService) GetAllDeletedTemplates() ([]*models.Template, error) {
	return s.repo.GetAllDeleted()
}