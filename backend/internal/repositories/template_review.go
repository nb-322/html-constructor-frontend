package repositories

import (
    "context"
    "opd-backend/internal/models"
    "opd-backend/storage"
)

type TemplateReviewRepository struct {
    db *storage.Postgres
}

func NewTemplateReviewRepository(db *storage.Postgres) *TemplateReviewRepository {
    return &TemplateReviewRepository{db: db}
}

func (r *TemplateReviewRepository) Submit(tplID int64) (*models.Template, error) {
    query := `
        UPDATE templates
        SET status = 'на_рассмотрении', updated_at = NOW()
        WHERE tpl_id = $1 AND is_deleted = false
        RETURNING tpl_id, name, html_body, status, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by`

    var t models.Template
    err := r.db.Pool.QueryRow(context.Background(), query, tplID).Scan(
        &t.ID, &t.Name, &t.HTMLBody, &t.Status,
        &t.CreatedAt, &t.UpdatedAt, &t.CreatedBy, &t.UpdatedBy,
        &t.IsDeleted, &t.DeletedAt, &t.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &t, nil
}

func (r *TemplateReviewRepository) GetPending() ([]*models.Template, error) {
    query := `
        SELECT tpl_id, name, html_body, status, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
        FROM templates
        WHERE status = 'на_рассмотрении' AND is_deleted = false
        ORDER BY updated_at ASC`

    rows, err := r.db.Pool.Query(context.Background(), query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var templates []*models.Template
    for rows.Next() {
        var t models.Template
        err := rows.Scan(
            &t.ID, &t.Name, &t.HTMLBody, &t.Status,
            &t.CreatedAt, &t.UpdatedAt, &t.CreatedBy, &t.UpdatedBy,
            &t.IsDeleted, &t.DeletedAt, &t.DeletedBy,
        )
        if err != nil {
            return nil, err
        }
        templates = append(templates, &t)
    }
    return templates, nil
}

func (r *TemplateReviewRepository) Approve(tplID int64, adminID int64) (*models.Template, error) {
    tx, err := r.db.Pool.Begin(context.Background())
    if err != nil {
        return nil, err
    }
    defer tx.Rollback(context.Background())

    var t models.Template
    err = tx.QueryRow(context.Background(), `
        UPDATE templates
        SET status = 'одобрено', updated_at = NOW()
        WHERE tpl_id = $1 AND is_deleted = false
        RETURNING tpl_id, name, html_body, status, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by`,
        tplID,
    ).Scan(
        &t.ID, &t.Name, &t.HTMLBody, &t.Status,
        &t.CreatedAt, &t.UpdatedAt, &t.CreatedBy, &t.UpdatedBy,
        &t.IsDeleted, &t.DeletedAt, &t.DeletedBy,
    )
    if err != nil {
        return nil, err
    }

    _, err = tx.Exec(context.Background(), `
        INSERT INTO template_reviews (tpl_id, admin_id, status)
        VALUES ($1, $2, 'одобрено')`,
        tplID, adminID,
    )
    if err != nil {
        return nil, err
    }

    if err = tx.Commit(context.Background()); err != nil {
        return nil, err
    }

    return &t, nil
}

func (r *TemplateReviewRepository) Reject(tplID int64, adminID int64, comment string) (*models.Template, error) {
    tx, err := r.db.Pool.Begin(context.Background())
    if err != nil {
        return nil, err
    }
    defer tx.Rollback(context.Background())

    var t models.Template
    err = tx.QueryRow(context.Background(), `
        UPDATE templates
        SET status = 'отклонено', updated_at = NOW()
        WHERE tpl_id = $1 AND is_deleted = false
        RETURNING tpl_id, name, html_body, status, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by`,
        tplID,
    ).Scan(
        &t.ID, &t.Name, &t.HTMLBody, &t.Status,
        &t.CreatedAt, &t.UpdatedAt, &t.CreatedBy, &t.UpdatedBy,
        &t.IsDeleted, &t.DeletedAt, &t.DeletedBy,
    )
    if err != nil {
        return nil, err
    }

    _, err = tx.Exec(context.Background(), `
        INSERT INTO template_reviews (tpl_id, admin_id, status, comment)
        VALUES ($1, $2, 'отклонено', $3)`,
        tplID, adminID, comment,
    )
    if err != nil {
        return nil, err
    }

    if err = tx.Commit(context.Background()); err != nil {
        return nil, err
    }

    return &t, nil
}

func (r *TemplateReviewRepository) GetReviews(tplID int64) ([]*models.TemplateReview, error) {
    query := `
        SELECT id, tpl_id, admin_id, status, comment, reviewed_at
        FROM template_reviews
        WHERE tpl_id = $1
        ORDER BY reviewed_at DESC`

    rows, err := r.db.Pool.Query(context.Background(), query, tplID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var reviews []*models.TemplateReview
    for rows.Next() {
        var rv models.TemplateReview
        err := rows.Scan(&rv.ID, &rv.TplID, &rv.AdminID, &rv.Status, &rv.Comment, &rv.ReviewedAt)
        if err != nil {
            return nil, err
        }
        reviews = append(reviews, &rv)
    }
    return reviews, nil
}