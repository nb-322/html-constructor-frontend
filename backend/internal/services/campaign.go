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
func (s *CampaignService) CreateCampaign(req dto.CreateCampaignRequest, userID int64) (*models.Campaign, error) {
    campaign := &models.Campaign{
        TemplateID:  req.TemplateID,
        Segment:     req.Segment,
        ScheduledAt: req.ScheduledAt,
        CreatedBy:   userID,
    }
    return s.repo.Create(campaign)
}

// GetAllCampaigns возвращает все кампании
func (s *CampaignService) GetAllCampaigns() ([]*models.Campaign, error) {
	return s.repo.GetAll()
}

// UpdateStatus обновляет статус кампании (PATCH)
func (s *CampaignService) UpdateStatus(id int64, status string) (*models.Campaign, error) {
    campaign, err := s.repo.UpdateStatus(id, status)
    if err != nil {
        return nil, errors.New("компания не найдена")
    }
    return campaign, nil
}

func (s *CampaignService) GetCampaignByID(id int64) (*models.Campaign, error) {
    return s.repo.GetByID(id)
}

// ArchiveCampaign архивирует кампанию
func (s *CampaignService) ArchiveCampaign(id int64, userID int64) (*models.Campaign, error) {
    campaign, err := s.repo.GetByIDWithDeleted(id)
    if err != nil {
        return nil, errors.New("кампания не найдена")
    }

    if campaign.IsDeleted {
        return nil, errors.New("кампания уже архивирована")
    }

    return s.repo.Archive(id, userID)
}

// RestoreCampaign восстанавливает кампанию из архива
func (s *CampaignService) RestoreCampaign(id int64) (*models.Campaign, error) {
    campaign, err := s.repo.GetByIDWithDeleted(id)
    if err != nil {
        return nil, errors.New("компания не найдена")
    }

    if !campaign.IsDeleted {
        return nil, errors.New("кампания не архивирована")
    }

    return s.repo.Restore(id)
}