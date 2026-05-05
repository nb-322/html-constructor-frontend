package services

import (
    "errors"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "opd-backend/internal/models"
    "opd-backend/internal/repositories"
    "opd-backend/internal/dto"
)

type UserService struct {
    repo       *repositories.UserRepository
    jwtSecret  []byte
    jwtExpires time.Duration
}

func NewUserService(repo *repositories.UserRepository, jwtSecret string) *UserService {
    return &UserService{
        repo:       repo,
        jwtSecret:  []byte(jwtSecret),
        jwtExpires: 24 * time.Hour, // токен живёт 24 часа
    }
}

// Register — регистрация нового пользователя
func (s *UserService) Register(login, password, role string) (*models.User, error) {
    if login == "" || password == "" {
        return nil, errors.New("логин и пароль обязательны")
    }

    // Хешируем пароль
    hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    user := &models.User{
        Login:    login,
        Password: string(hashed),
        Role:     role,
    }

    return s.repo.Create(user)
}

// Login — авторизация и выдача JWT
func (s *UserService) Login(login, password string) (string, error) {
    user, err := s.repo.GetByLogin(login)
    if err != nil {
        return "", errors.New("неверный логин или пароль")
    }

    // Проверяем пароль
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return "", errors.New("неверный логин или пароль")
    }

    // Создаём JWT токен
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "login":   user.Login,
        "role":    user.Role,
        "exp":     time.Now().Add(s.jwtExpires).Unix(),
    })

    tokenString, err := token.SignedString(s.jwtSecret)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

func (s *UserService) GetAllUsers() ([] *models.User, error) {
    return s.repo.GetAll()
}


func (s *UserService) UpdateUser(
	id int64,
	req dto.UpdateUserRequest,
) (*models.User, error) {

	user, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// PATCH логика
	if req.Login != nil {
		user.Login = *req.Login
	}

	if req.Role != nil {
		user.Role = *req.Role
	}

	return s.repo.Update(user)
}


func (s *UserService) ArchiveUser(id int64, userID int64) (*models.User, error) {
	user, err := s.repo.GetByIDWithDeleted(id)
	if err != nil {
		return nil, err
	}

	if user.IsDeleted {
		return nil, errors.New("пользователь уже архивирован")
	}

	return s.repo.Archive(id, userID)
}

func (s *UserService) RestoreUser(id int64) (*models.User, error) {
    user, err := s.repo.GetByIDWithDeleted(id)
    if err != nil {
        return nil, err
    }

    if !user.IsDeleted {
        return nil, errors.New("пользователь не архивирован")
    }

    return s.repo.Restore(id)
}

func (s *UserService) GetAllDeletedUsers() ([]*models.User, error) {
	return s.repo.GetAllDeleted()
}