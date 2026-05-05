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

// GetAll возвращает все кампании
func (r *CampaignRepository) GetAll() ([]*models.Campaign, error) {
    query := `
        SELECT id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by
        FROM campaigns
        WHERE is_deleted = false
        ORDER BY created_at DESC`

    rows, err := r.db.Pool.Query(context.Background(), query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var campaigns []*models.Campaign
    for rows.Next() {
        var campaign models.Campaign
        err := rows.Scan(
            &campaign.ID,
            &campaign.TemplateID,
            &campaign.Segment,
            &campaign.ScheduledAt,
            &campaign.Status,
            &campaign.CreatedBy,
            &campaign.CreatedAt,
            &campaign.IsDeleted,
            &campaign.DeletedAt,
            &campaign.DeletedBy,
        )
        if err != nil {
            return nil, err
        }
        campaigns = append(campaigns, &campaign)
    }

    return campaigns, nil
}

// GetByID возвращает кампанию по ID
func (r *CampaignRepository) GetByID(id int64) (*models.Campaign, error) {
    query := `
        SELECT id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by
        FROM campaigns
        WHERE id = $1 AND is_deleted = false`

    var campaign models.Campaign
    err := r.db.Pool.QueryRow(context.Background(), query, id).Scan(
        &campaign.ID,
        &campaign.TemplateID,
        &campaign.Segment,
        &campaign.ScheduledAt,
        &campaign.Status,
        &campaign.CreatedBy,
        &campaign.CreatedAt,
        &campaign.IsDeleted,
        &campaign.DeletedAt,
        &campaign.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &campaign, nil
}

func (r *CampaignRepository) GetByIDWithDeleted(id int64) (*models.Campaign, error) {
    query := `
        SELECT id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by
        FROM campaigns
        WHERE id = $1`

    var campaign models.Campaign
    err := r.db.Pool.QueryRow(context.Background(), query, id).Scan(
        &campaign.ID, &campaign.TemplateID, &campaign.Segment, &campaign.ScheduledAt,
        &campaign.Status, &campaign.CreatedBy, &campaign.CreatedAt,
        &campaign.IsDeleted, &campaign.DeletedAt, &campaign.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &campaign, nil
}

// UpdateStatus обновляет статус кампании
func (r *CampaignRepository) UpdateStatus(id int64, status string) (*models.Campaign, error) {
    query := `
        UPDATE campaigns
        SET status = $1
        WHERE id = $2
        RETURNING id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by`

    var campaign models.Campaign
    err := r.db.Pool.QueryRow(
        context.Background(),
        query,
        status,
        id,
    ).Scan(
        &campaign.ID,
        &campaign.TemplateID,
        &campaign.Segment,
        &campaign.ScheduledAt,
        &campaign.Status,
        &campaign.CreatedBy,
        &campaign.CreatedAt,
        &campaign.IsDeleted,
        &campaign.DeletedAt,
        &campaign.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &campaign, nil
}

func (r *CampaignRepository) Archive(id int64, deletedBy int64) (*models.Campaign, error) {
    query := `
        UPDATE campaigns
        SET is_deleted = true, deleted_at = NOW(), deleted_by = $1
        WHERE id = $2 AND is_deleted = false
        RETURNING id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by`

    var campaign models.Campaign
    err := r.db.Pool.QueryRow(
        context.Background(),
        query,
        deletedBy,
        id,
    ).Scan(
        &campaign.ID,
        &campaign.TemplateID,
        &campaign.Segment,
        &campaign.ScheduledAt,
        &campaign.Status,
        &campaign.CreatedBy,
        &campaign.CreatedAt,
        &campaign.IsDeleted,
        &campaign.DeletedAt,
        &campaign.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &campaign, nil
}

func (r *CampaignRepository) Restore(id int64) (*models.Campaign, error) {
    query := `
        UPDATE campaigns
        SET is_deleted = false, deleted_at = NULL, deleted_by = NULL
        WHERE id = $1 AND is_deleted = true
        RETURNING id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by`

    var campaign models.Campaign
    err := r.db.Pool.QueryRow(
        context.Background(),
        query,
        id,
    ).Scan(
        &campaign.ID,
        &campaign.TemplateID,
        &campaign.Segment,
        &campaign.ScheduledAt,
        &campaign.Status,
        &campaign.CreatedBy,
        &campaign.CreatedAt,
        &campaign.IsDeleted,
        &campaign.DeletedAt,
        &campaign.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &campaign, nil
}

// GetAllDeleted возвращает все архивированные кампании
func (r *CampaignRepository) GetAllDeleted() ([]*models.Campaign, error) {
    query := `
        SELECT id, tpl_id, segment, scheduled_at, status, created_by, created_at, is_deleted, deleted_at, deleted_by
        FROM campaigns
        WHERE is_deleted = true
        ORDER BY created_at DESC`

    rows, err := r.db.Pool.Query(context.Background(), query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var campaigns []*models.Campaign
    for rows.Next() {
        var campaign models.Campaign
        err := rows.Scan(
            &campaign.ID,
            &campaign.TemplateID,
            &campaign.Segment,
            &campaign.ScheduledAt,
            &campaign.Status,
            &campaign.CreatedBy,
            &campaign.CreatedAt,
            &campaign.IsDeleted,
            &campaign.DeletedAt,
            &campaign.DeletedBy,
        )
        if err != nil {
            return nil, err
        }
        campaigns = append(campaigns, &campaign)
    }

    return campaigns, nil
}