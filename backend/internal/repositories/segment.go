package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type SegmentRepository struct {
	db *storage.Postgres
}

func NewSegmentRepository(db *storage.Postgres) *SegmentRepository {
	return &SegmentRepository{db: db}
}

func (r *SegmentRepository) Create(segment *models.Segment) (*models.Segment, error) {
	query := `
	INSERT INTO segments (name, description, is_active)
	VALUES ($1, $2, TRUE)
	RETURNING name, description, is_active`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		segment.Name,
		segment.Description,
		segment.IsActive,
	).Scan(
		&segment.Name,
		&segment.Description,
		&segment.IsActive,
	)

	if err != nil {
		return nil, err
	}

	return segment, nil
}

func (r *SegmentRepository) GetAll() ([]*models.Segment, error) {
	query := `
	SELECT name, description, is_active
	FROM segments
	WHERE is_active = true
	ORDER BY name DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var segments []*models.Segment
	for rows.Next() {
		var s models.Segment
		err := rows.Scan(
			&s.Name,
			&s.Description,
			&s.IsActive,
		)
		if err != nil {
			return nil, err
		}
		segments = append(segments, &s)
	}

	return segments, nil
}

func (r *SegmentRepository) GetByIDWithDeleted(name string) (*models.Segment, error) {
    query := `
        SELECT name, description, is_active
				FROM segments
				WHERE is_active = $1`

    var s models.Segment
    err := r.db.Pool.QueryRow(
			context.Background(),
			query,
			name,
			).Scan(
        &s.Name,
				&s.Description,
				&s.IsActive,
    )
    if err != nil {
        return nil, err
    }
    return &s, nil
}

func (r *SegmentRepository) Update(segment *models.Segment) (*models.Segment, error) {
	query := `
		UPDATE segments
		SET description = $1
		WHERE name = $2
		RETURNING name, description, is_active`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		segment.Description,
		segment.Name,
	).Scan(
		&segment.Name,
		&segment.Description,
		&segment.IsActive,
	)

	if err != nil {
		return nil, err
	}

	return segment, nil
}