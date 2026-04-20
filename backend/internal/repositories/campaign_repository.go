package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type CampaignRepository struct {
	db *storage.Postgres
}

func NewCampaignRepository(db *storage.Postgres) *CampaignRepository {
	return &CampaignRepository{db: db}
}

// Create создаёт новую кампанию
func (r *CampaignRepository) Create(campaign *models.Campaign) (*models.Campaign, error) {
	query := `
	INSERT INTO campaigns (tpl_id, segment, scheduled_at, status, created_by, created_at)
	VALUES ($1, $2, $3, $4, $5, NOW())
	RETURNING id, tpl_id, segment, scheduled_at, status, created_by, created_at`
	
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		campaign.TemplateID,
		campaign.Segment,
		campaign.ScheduledAt,
		campaign.Status,
		campaign.CreatedBy,
	).Scan(
		&campaign.ID,
		&campaign.TemplateID,
		&campaign.Segment,
		&campaign.ScheduledAt,
		&campaign.Status,
		&campaign.CreatedBy,
		&campaign.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return campaign, nil
}