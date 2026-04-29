package services

import (
	"errors"
	"opd-backend/internal/dto"
	"opd-backend/internal/models"
	"opd-backend/internal/repositories"
)

type CampaignService struct {
	repo *repositories.CampaignRepository
}

func NewCampaignService(repo *repositories.CampaignRepository) *CampaignService {
	return &CampaignService{repo: repo}
}

// CreateCampaign создаёт новую кампанию
func (s *CampaignService) CreateCampaign(req dto.CreateCampaignRequest) (*models.Campaign, error) {
	if req.TemplateID == 0 {
		return nil, errors.New("template_id is required")
	}
	if req.Segment == "" {
		return nil, errors.New("segment is required")
	}
	if req.ScheduledAt.IsZero() {
		return nil, errors.New("scheduled_at is required")
	}
	if req.CreatedBy == 0 {
		return nil, errors.New("created_by is required")
	}

	campaign := &models.Campaign{
		TemplateID: req.TemplateID,
		Segment: req.Segment,
		ScheduledAt: req.ScheduledAt,
		CreatedBy: req.CreatedBy,
	}

	return s.repo.Create(campaign)
}

// GetAllCampaigns возвращает все кампании
func (s *CampaignService) GetAllCampaigns() ([]*models.Campaign, error) {
	return s.repo.GetAll()
}

// UpdateStatus обновляет статус кампании (PATCH)
func (s *CampaignService) UpdateStatus(id int64, status string) (*models.Campaign, error) {
	campaign, err := s.repo.GetByID(id)
	if err != nil {
		return nil, errors.New("campaign not found")
	}
	
	err = s.repo.UpdateStatus(id, status)
	if err != nil {
		return nil, err
	}

	return campaign, nil
}

// DeleteCampaign удаляет кампанию
func (s *CampaignService) DeleteCampaign(id int64) error {
	return s.repo.Delete(id)
}