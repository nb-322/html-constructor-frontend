package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type ClientRepository struct {
	db *storage.Postgres
}

func NewClientRepository(db *storage.Postgres) *ClientRepository {
	return &ClientRepository{db: db}
}

// Создаёт нового клиента
func (r *ClientRepository) Create(client *models.Client) (*models.Client, error) {
	query := `
		INSERT INTO clients (email, segment, consent_flag, created_at, updated_at)
		VALUES ($1, $2, $3, NOW(), NOW())
		RETURNING id, email, segment, consent_flag, created_at, updated_at`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		client.Email,
		client.Segment,
		client.ConsentFlag,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsentFlag,
		&client.CreatedAt,
		&client.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return client, nil
}

// GetAll возвращает всех клиентов
func (r *ClientRepository) GetAll() ([]*models.Client, error) {
	query := `
	SELECT id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by
	FROM clients
	WHERE is_deleted = false
	ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var clients []*models.Client
	for rows.Next() {
		var client models.Client
		err := rows.Scan(
			&client.ID,
			&client.Email,
			&client.Segment,
			&client.ConsentFlag,
			&client.CreatedAt,
			&client.UpdatedAt,
			&client.IsDeleted,
			&client.DeletedAt,
			&client.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		clients = append(clients, &client)
	}

	return clients, nil
}

// GetByID возвращает клиента по ID
func (r *ClientRepository) GetByID(id int64) (*models.Client, error) {
	query := `
	SELECT id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by
	FROM clients
	WHERE id = $1 AND is_deleted = false`

	var client models.Client
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsentFlag,
		&client.CreatedAt,
		&client.UpdatedAt,
		&client.IsDeleted,
		&client.DeletedAt,
		&client.DeletedBy,
	)
		if err != nil {
			return nil, err
		}

		return &client, nil
}

func (r *ClientRepository) GetByIDWithDeleted(id int64) (*models.Client, error) {
    query := `
        SELECT id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by
				FROM clients
        WHERE id = $1`

    var client models.Client
    err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsentFlag,
		&client.CreatedAt,
		&client.UpdatedAt,
		&client.IsDeleted,
		&client.DeletedAt,
		&client.DeletedBy,
	)
		if err != nil {
			return nil, err
		}
    return &client, nil
}

// Update обновляет данные клиента
func (r *ClientRepository) Update(client *models.Client) (*models.Client, error) {
	query := `
	UPDATE clients
	SET email = $1, segment = $2, consent_flag = $3, updated_at = NOW()
	WHERE id = $4
	RETURNING id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		client.Email,
		client.Segment,
		client.ConsentFlag,
		client.ID,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsentFlag,
		&client.CreatedAt,
		&client.UpdatedAt,
		&client.IsDeleted,
		&client.DeletedAt,
		&client.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return client, nil

}

func (r *ClientRepository) Archive(id int64, deletedBy int64) (*models.Client, error) {
    query := `
        UPDATE clients
        SET is_deleted = true, deleted_at = NOW(), deleted_by = $1
        WHERE id = $2 AND is_deleted = false
        RETURNING id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by`

    var client models.Client
    err := r.db.Pool.QueryRow(
        context.Background(),
        query,
        deletedBy,
        id,
    ).Scan(
    		&client.ID,
				&client.Email,
				&client.Segment,
				&client.ConsentFlag,
				&client.CreatedAt,
				&client.UpdatedAt,
				&client.IsDeleted,
				&client.DeletedAt,
				&client.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &client, nil
}

func (r *ClientRepository) Restore(id int64) (*models.Client, error) {
    query := `
        UPDATE clients
        SET is_deleted = false, deleted_at = NULL, deleted_by = NULL
        WHERE id = $1 AND is_deleted = true
        RETURNING id, email, segment, consent_flag, created_at, updated_at, is_deleted, deleted_at, deleted_by`

    var client models.Client
    err := r.db.Pool.QueryRow(
        context.Background(),
        query,
        id,
    ).Scan(
        &client.ID,
				&client.Email,
				&client.Segment,
				&client.ConsentFlag,
				&client.CreatedAt,
				&client.UpdatedAt,
				&client.IsDeleted,
				&client.DeletedAt,
				&client.DeletedBy,
    )
    if err != nil {
        return nil, err
    }
    return &client, nil
}