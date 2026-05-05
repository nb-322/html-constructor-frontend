package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type TemplateRepository struct {
	db *storage.Postgres
}

func NewTemplateRepository(db *storage.Postgres) *TemplateRepository {
	return &TemplateRepository{db: db}
}

// Create создаёт новый шаблон
func (r *TemplateRepository) Create(template *models.Template) (*models.Template, error) {
	query := `
		INSERT INTO templates (name, html_body, created_by, updated_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id, name, html_body, created_at, updated_at, created_by, updated_by`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		template.Name,
		template.HTMLBody,
		template.CreatedBy,
		template.UpdatedBy,
	).Scan(
		&template.ID,
		&template.Name,
		&template.HTMLBody,
		&template.CreatedAt,
		&template.UpdatedAt,
		&template.CreatedBy,
		&template.UpdatedBy,
	)

	if err != nil {
		return nil, err
	}

	return template, nil
}

// GetAll возвращает все шаблоны, кроме удаленных
func (r *TemplateRepository) GetAll() ([]*models.Template, error) {
	query := `
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
		FROM templates
		WHERE is_deleted = false
		ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []*models.Template
	for rows.Next() {
		var t models.Template
		err := rows.Scan(
			&t.ID,
			&t.Name,
			&t.HTMLBody,
			&t.CreatedAt,
			&t.UpdatedAt,
			&t.CreatedBy,
			&t.UpdatedBy,
			&t.IsDeleted,
			&t.DeletedAt,
			&t.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		templates = append(templates, &t)
	}

	return templates, nil
}

// GetByID возвращает шаблон по ID
func (r *TemplateRepository) GetByID(id int64) (*models.Template, error) {
	query := `
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
		FROM templates
		WHERE id = $1 AND is_deleted = false`

	var t models.Template
	err := r.db.Pool.QueryRow(context.Background(), query, id).Scan(
		&t.ID,
		&t.Name,
		&t.HTMLBody,
		&t.CreatedAt,
		&t.UpdatedAt,
		&t.CreatedBy,
		&t.UpdatedBy,
		&t.IsDeleted,
		&t.DeletedAt,
		&t.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &t, nil
}

// GetByIDWithDeleted возвращает архивированный шаблон по id
func (r *TemplateRepository) GetByIDWithDeleted(id int64) (*models.Template, error) {
    query := `
        SELECT id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
        FROM templates
        WHERE id = $1`

    var t models.Template
    err := r.db.Pool.QueryRow(context.Background(), query, id).Scan(
        &t.ID, &t.Name, &t.HTMLBody, &t.CreatedAt, &t.UpdatedAt,
        &t.CreatedBy, &t.UpdatedBy, &t.IsDeleted, &t.DeletedAt, &t.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &t, nil
}

// GetByUserID возвращает шаблоны, созданные определённым пользователем
func (r *TemplateRepository) GetByUserID(userID int64) ([]*models.Template, error) {
	query := `
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
		FROM templates
		WHERE created_by = $1 AND is_deleted = false
		ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []*models.Template
	for rows.Next() {
		var t models.Template
		err := rows.Scan(
			&t.ID,
			&t.Name,
			&t.HTMLBody,
			&t.CreatedAt,
			&t.UpdatedAt,
			&t.CreatedBy,
			&t.UpdatedBy,
			&t.IsDeleted,
			&t.DeletedAt,
			&t.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		templates = append(templates, &t)
	}

	return templates, nil
}

// Update обновляет шаблон
func (r *TemplateRepository) Update(template *models.Template) (*models.Template, error) {
	query := `
		UPDATE templates
		SET name = $1, html_body = $2, updated_by = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING id, name, html_body, created_at, updated_at, created_by, updated_by`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		template.Name,
		template.HTMLBody,
		template.UpdatedBy,
		template.ID,
	).Scan(
		&template.ID,
		&template.Name,
		&template.HTMLBody,
		&template.CreatedAt,
		&template.UpdatedAt,
		&template.CreatedBy,
		&template.UpdatedBy,
	)

	if err != nil {
		return nil, err
	}

	return template, nil
}

// Archive архивирует шаблон
func (r *TemplateRepository) Archive(id int64, deletedBy int64) (*models.Template, error) {
	query := `
	UPDATE templates
	SET is_deleted = true, deleted_at = NOW(), deleted_by = $1
	WHERE id = $2 AND is_deleted = false
	RETURNING id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by`

	var template models.Template
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		deletedBy,
		id,
	).Scan(
		&template.ID,
		&template.Name,
		&template.HTMLBody,
		&template.CreatedAt,
		&template.UpdatedAt,
		&template.CreatedBy,
		&template.UpdatedBy,
		&template.IsDeleted,
		&template.DeletedAt,
		&template.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &template, nil
}

// Restore восстанавливает шаблон
func (r *TemplateRepository) Restore(id int64) (*models.Template, error) {
	query := `
	UPDATE templates
	SET is_deleted = false, deleted_at = NULL, deleted_by = NULL
	WHERE id = $1 AND is_deleted = true
	RETURNING id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by`

	var template models.Template
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&template.ID,
		&template.Name,
		&template.HTMLBody,
		&template.CreatedAt,
		&template.UpdatedAt,
		&template.CreatedBy,
		&template.UpdatedBy,
		&template.IsDeleted,
		&template.DeletedAt,
		&template.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &template, nil
}

// GetAllDeleted возвращает все архивированные шаблоны
func (r *TemplateRepository) GetAllDeleted() ([]*models.Template, error) {
	query := `
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by, is_deleted, deleted_at, deleted_by
		FROM templates
		WHERE is_deleted = true
		ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []*models.Template
	for rows.Next() {
		var t models.Template
		err := rows.Scan(
			&t.ID,
			&t.Name,
			&t.HTMLBody,
			&t.CreatedAt,
			&t.UpdatedAt,
			&t.CreatedBy,
			&t.UpdatedBy,
			&t.IsDeleted,
			&t.DeletedAt,
			&t.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		templates = append(templates, &t)
	}

	return templates, nil
}