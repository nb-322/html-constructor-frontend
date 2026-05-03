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
		client.ConsetnFlag,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsetnFlag,
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
	SELECT id, email, segment, consent_flag, created_at, updated_at
	FROM clients
	ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var clients []*models.Client

	for rows.Next() {

		var c models.Client

		err := rows.Scan(
			&c.ID,
			&c.Email,
			&c.Segment,
			&c.ConsetnFlag,
			&c.CreatedAt,
			&c.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		clients = append(clients, &c)
	}

	return clients, nil

}

// GetByID возвращает клиента по ID
func (r *ClientRepository) GetByID(id int64) (*models.Client, error) {
	query := `
	SELECT id, email, segment, consent_flag, created_at, updated_at
	FROM clients
	WHERE id = $1`

	var c models.Client

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&c.ID,
		&c.Email,
		&c.Segment,
		&c.ConsetnFlag,
		&c.CreatedAt,
		&c.UpdatedAt)

		if err != nil {
			return nil, err
		}

		return &c, nil
}

// Update обновляет данные клиента
func (r *ClientRepository) Update(client *models.Client) (*models.Client, error) {
	query := `
	UPDATE clients
	SET email = $1, segment = $2, consent_flag = $3, updated_at = NOW()
	WHERE id = $4
	RETURNING id, email, segment, consent_flag, created_at, updated_at`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		client.Email,
		client.Segment,
		client.ConsetnFlag,
		client.ID,
	).Scan(
		&client.ID,
		&client.Email,
		&client.Segment,
		&client.ConsetnFlag,
		&client.CreatedAt,
		&client.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return client, nil

}