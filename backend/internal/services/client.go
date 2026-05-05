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
		return nil, errors.New("требуется почта")
	}

	if segment == "" {
		return nil, errors.New("требуется сегмент")
	}

	client := &models.Client{
		Email: 			       email,
		Segment:       segment,
		ConsentFlag: consentFlag,
	}

	return s.repo.Create(client)
}

// GetAllClients возвращает всех клиентов
func (s *ClientService) GetAllClients() ([]*models.Client, error) {
	return s.repo.GetAll()
}

// GetClientByID возвращает клиента по ID
func (s *ClientService) GetClientByID(id int64) (*models.Client, error) {
	return s.repo.GetByID(id)
}

// UpdateClient обновляет клиента (PATCH)
func (s *ClientService) UpdateClient(id int64, req dto.UpdateClientRequest) (*models.Client, error) {
	client, err := s.repo.GetByID(id)
	if err != nil {
		return  nil, errors.New("клиент не найден")
	}
	if req.Email != nil {
		client.Email = *req.Email
	}
	if req.Segment != nil {
		client.Segment = *req.Segment
	}
	if req.ConsentFlag != nil {
		client.ConsentFlag = *req.ConsentFlag
	}

	return s.repo.Update(client)
}

// ArchiveClient архивирует кампанию
func (s *ClientService) ArchiveClient(id int64, userID int64) (*models.Client, error) {
	client, err := s.repo.GetByIDWithDeleted(id)
	if err != nil {
		return nil, errors.New("клиент не найден")
	}

	if client.IsDeleted {
		return nil, errors.New("клиент уже архивирован")
	}

	return s.repo.Archive(id, userID)
}

// RestoreClient восстанавливает кампанию из архива
func (s *ClientService) RestoreClient(id int64) (*models.Client, error) {
    client, err := s.repo.GetByIDWithDeleted(id)
    if err != nil {
        return nil, errors.New("клиент не найден")
    }

    if !client.IsDeleted {
        return nil, errors.New("клиент не архивирован")
    }

    return s.repo.Restore(id)
}

// GetAllDeletedClients возвращает всех архивированных клиентов
func (s *ClientService) GetAllDeletedClients() ([]*models.Client, error) {
	return s.repo.GetAllDeleted()
}