package repositories

import (
	"context"
	"opd-backend/internal/models"
	"opd-backend/storage"
)

type UserRepository struct {
	db *storage.Postgres
}

func NewUserRepository(db *storage.Postgres) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) (*models.User, error) {
	query := `
		INSERT INTO users (login, password_hash, role)
		VALUES ($1, $2, $3)
		RETURNING id, login, role, created_at`

	// Используем pgx API: QueryRow + Scan
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		user.Login,
		user.Password, // ⚠️ см. примечание ниже про поле модели
		user.Role,
	).Scan(&user.ID, &user.Login, &user.Role, &user.CreatedAt)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByLogin(login string) (*models.User, error) {
	var user models.User

	query := `
		SELECT id, login, password_hash, role, created_at
		FROM users
		WHERE login = $1`

	// Используем pgx API: QueryRow + Scan
	err := r.db.Pool.QueryRow(context.Background(), query, login).
		Scan(&user.ID, &user.Login, &user.Password, &user.Role, &user.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &user, nil
}