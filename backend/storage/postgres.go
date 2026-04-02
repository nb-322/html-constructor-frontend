package storage

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgres struct {
	Pool *pgxpool.Pool
}

func NewPostgres() (*Postgres, error) {
	// 1. Собираем строку подключения (DSN)
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	// 2. Настраиваем конфиг пула
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to parse DB config: %w", err)
	}

	config.ConnConfig.ConnectTimeout = 5 * time.Second

	// 3. Создаем пул соединений
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create DB pool: %w", err)
	}

	// 4. Проверяем связь с базой
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping DB: %w", err)
	}

	// 5. ЗАПУСКАЕМ МИГРАЦИИ
	if err := RunMigrations(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Database connected and migrated!")
	return &Postgres{Pool: pool}, nil
}

// RunMigrations применяет все новые миграции из папки
func RunMigrations() error {
	// 1. Собираем DSN в формате URL специально для migrate
	// Формат: postgres://user:password@host:port/dbname?options
	migrateDSN := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	// 2. Инициализируем миграции
	// Путь к папке: file://migrations (относительно точки запуска)
	m, err := migrate.New(
		"file://migrations",
		migrateDSN,
	)
	if err != nil {
		return fmt.Errorf("failed to init migrate: %w", err)
	}

	// 3. Применяем все доступные миграции
	// ErrNoChange — нормальная ситуация, если миграции уже применены
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	log.Println("Migrations applied successfully!")
	return nil
}

func (p *Postgres) Close() {
	if p.Pool != nil {
		p.Pool.Close()
	}
}
