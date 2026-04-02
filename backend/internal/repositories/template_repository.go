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

// GetAll возвращает все шаблоны
func (r *TemplateRepository) GetAll() ([]*models.Template, error) {
	query := `
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by
		FROM templates
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
		SELECT id, name, html_body, created_at, updated_at, created_by, updated_by
		FROM templates
		WHERE id = $1`

	var t models.Template
	err := r.db.Pool.QueryRow(context.Background(), query, id).Scan(
		&t.ID,
		&t.Name,
		&t.HTMLBody,
		&t.CreatedAt,
		&t.UpdatedAt,
		&t.CreatedBy,
		&t.UpdatedBy,
	)

	if err != nil {
		return nil, err
	}

	return &t, nil
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

// Delete удаляет шаблон
func (r *TemplateRepository) Delete(id int64) error {
	query := `DELETE FROM templates WHERE id = $1`
	_, err := r.db.Pool.Exec(context.Background(), query, id)
	return err
}