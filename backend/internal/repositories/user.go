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

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		user.Login,
		user.Password,
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

	err := r.db.Pool.QueryRow(context.Background(), query, login).
		Scan(&user.ID, &user.Login, &user.Password, &user.Role, &user.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetAll() ([]*models.User, error) {
	query := `
	SELECT id, login, role, created_at, is_deleted, deleted_at, deleted_by
	FROM users
	WHERE is_deleted = false
	ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(
			&u.ID,
			&u.Login,
			&u.Role,
			&u.CreatedAt,
			&u.IsDeleted,
			&u.DeletedAt,
			&u.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, &u)
	}

	return users, nil
}

func (r *UserRepository) GetByID(id int64) (*models.User, error) {
	query := `
		SELECT id, login, role, created_at, is_deleted, deleted_at, deleted_by
		FROM users
		WHERE id = $1 AND is_deleted = false`

	var u models.User
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&u.ID,
		&u.Login,
		&u.Role,
		&u.CreatedAt,
		&u.IsDeleted,
		&u.DeletedAt,
		&u.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &u, nil
}

func (r *UserRepository) GetByIDWithDeleted(id int64) (*models.User, error) {
	query := `
        SELECT id, login, role, created_at, is_deleted, deleted_at, deleted_by
				FROM users
				WHERE id = $1`

	var u models.User
	err := r.db.Pool.QueryRow(context.Background(),
		query,
		id,
	).Scan(
		&u.ID,
		&u.Login,
		&u.Role,
		&u.CreatedAt,
		&u.IsDeleted,
		&u.DeletedAt,
		&u.DeletedBy,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) Update(user *models.User) (*models.User, error) {
	query := `
		UPDATE users
		SET login = $1, role = $2
		WHERE id = $3
		RETURNING id, login, role, created_at, is_deleted, deleted_at, deleted_by`

	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		user.Login,
		user.Role,
		user.ID,
	).Scan(
		&user.ID,
		&user.Login,
		&user.Role,
		&user.CreatedAt,
		&user.IsDeleted,
		&user.DeletedAt,
		&user.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) Archive(id int64, deletedBy int64) (*models.User, error) {
	query := `
	UPDATE users
	SET is_deleted = true, deleted_at = NOW(), deleted_by = $1
	WHERE id = $2 AND is_deleted = false
	RETURNING id, login, role, created_at, is_deleted, deleted_at, deleted_by`

	var user models.User
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		deletedBy,
		id,
	).Scan(
		&user.ID,
		&user.Login,
		&user.Role,
		&user.CreatedAt,
		&user.IsDeleted,
		&user.DeletedAt,
		&user.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) Restore(id int64) (*models.User, error) {
	query := `
	UPDATE users
	SET is_deleted = false, deleted_at = NULL, deleted_by = NULL
	WHERE id = $1 AND is_deleted = true
	RETURNING id, login, role, created_at, is_deleted, deleted_at, deleted_by`

	var user models.User
	err := r.db.Pool.QueryRow(
		context.Background(),
		query,
		id,
	).Scan(
		&user.ID,
		&user.Login,
		&user.Role,
		&user.CreatedAt,
		&user.IsDeleted,
		&user.DeletedAt,
		&user.DeletedBy,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetAllDeleted() ([]*models.User, error) {
	query := `
	SELECT id, login, role, created_at, is_deleted, deleted_at, deleted_by
	FROM users
	WHERE is_deleted = true
	ORDER BY deleted_at DESC`

	rows, err := r.db.Pool.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(
			&u.ID,
			&u.Login,
			&u.Role,
			&u.CreatedAt,
			&u.IsDeleted,
			&u.DeletedAt,
			&u.DeletedBy,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, &u)
	}

	return users, nil
}
