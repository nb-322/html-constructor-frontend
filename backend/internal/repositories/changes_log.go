package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type ChangesLogRepository struct {
	db *storage.Postgres
}

func NewChangesLogRepository(db *storage.Postgres) *ChangesLogRepository {
	return &ChangesLogRepository{db: db}
}

func (r *ChangesLogRepository) Create(log *models.ChangeLog) (*models.ChangeLog, error) {
	query := `
    INSERT INTO template_changes_log (tpl_id, old_html, new_html, changed_by, changed_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, tpl_id, old_html, new_html, changed_by, changed_at`
	
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		log.TplID,
    log.OldHTML,
    log.NewHTML,
    log.ChangedBy,
	).Scan(
        &log.ID,
        &log.TplID,
        &log.OldHTML,
        &log.NewHTML,
        &log.ChangedBy,
        &log.ChangedAt,
    )

    if err != nil {
        return nil, err
    }

    return log, nil
}

func (r *ChangesLogRepository) GetByTemplateID(tplID int64) ([]*models.ChangeLog, error) {
	query := `
	SELECT id, tpl_id, old_html, new_html, changed_by, changed_at
	FROM template_changes_log
	WHERE tpl_id = $1
	ORDER BY changed_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query, tplID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*models.ChangeLog
	for rows.Next() {
		log := &models.ChangeLog{}
		err := rows.Scan(&log.ID, &log.TplID, &log.OldHTML, &log.NewHTML, &log.ChangedBy, &log.ChangedAt)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	return logs, nil
}