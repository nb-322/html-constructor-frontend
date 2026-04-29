package services

import (
	"errors"
	"opd-backend/internal/dto"
	"opd-backend/internal/models"
	"opd-backend/internal/repositories"
)

type ClientService struct {
	repo *repositories.ClientRepository
}

func NewClientService(repo *repositories.ClientRepository) *ClientService {
	return &ClientService{repo: repo}
}

// CreateClient создаёт нового клиента
func (s *ClientService) CreateClient(email, segment string, consentFlag bool) (*models.Client, error) {
	if email == "" {
		return nil, errors.New("email is required")
	}

	if segment == "" {
		return nil, errors.New("segment is required")
	}

	client := &models.Client{
		Email: 			       email,
		Segment:       segment,
		ConsetnFlag: consentFlag,
	}

	return s.repo.Create(client)
}

// GetAllClients возвращает всех клиентов
func (s *ClientService) GetAllClients() ([]*models.Client, error) {
	return s.repo.GetAll()
}

// GetClientByID возвращает клиента по ID
// func (s *ClientService) GetClientByID(id int64) (*models.Client, error) {
// 	return s.repo.GetByID(id)
// }

// UpdateClient обновляет клиента (PATCH)
func (s *ClientService) UpdateClient(id int64, req dto.UpdateClientRequest) (*models.Client, error) {
	client, err := s.repo.GetByID(id)

	if err != nil {
		return  nil, errors.New("client not found")
	}

	if req.Email != nil {
		client.Email = *req.Email
	}

	if req.Segment != nil {
		client.Segment = *req.Segment
	}

	if req.ConsentFlag != nil {
		client.ConsetnFlag = *req.ConsentFlag
	}

	return s.repo.Update(client)
}

// DeleteClient удаляет клиента по ID
func (s *ClientService) DeleteClient(id int64) error {
	return s.repo.Delete(id)
}