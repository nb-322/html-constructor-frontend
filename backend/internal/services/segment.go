package services

import (
	"errors"
	"opd-backend/internal/models"
	"opd-backend/internal/repositories"
	"opd-backend/internal/dto"
)

type SegmentService struct {
	repo *repositories.SegmentRepository
}

func NewSegmentService(repo *repositories.SegmentRepository) *SegmentService {
	return &SegmentService{repo: repo}
}

func (s *SegmentService) CreateSegment(name, description string) (*models.Segment, error) {
	if name == "" {
		return nil, errors.New("name is required")
	}

	segment := &models.Segment{
		Name:      name,
		Description:  description,
	}

	return s.repo.Create(segment)
}

func (s *SegmentService) GetAllSegments() ([]*models.Segment, error) {
	return s.repo.GetAll()
}

func (s *SegmentService) UpdateSegment(
	name string,
	req dto.UpdateSegmentRequest,
) (*models.Segment, error) {

	segment, err := s.repo.GetByName(name)
	if err != nil {
		return nil, err
	}

	// PATCH логика
	if req.Description != nil {
		segment.Description = *req.Description
	}

	return s.repo.Update(segment)
}

func (s *SegmentService) ArchiveSegment(name string) (*models.Segment, error) {
	segment, err := s.repo.GetByNameWithDeleted(name)
	if err != nil {
		return nil, err
	}

	if !segment.IsActive {
		return nil, errors.New("сегмент уже архивирован")
	}

	return s.repo.Archive(name)
}

func (s *SegmentService) RestoreSegment(name string) (*models.Segment, error) {
    segment, err := s.repo.GetByNameWithDeleted(name)
    if err != nil {
        return nil, err
    }

    if segment.IsActive {
        return nil, errors.New("сегмент не архивирован")
    }

    return s.repo.Restore(name)
}

func (s *SegmentService) GetAllDeletedSegments() ([]*models.Segment, error) {
	return s.repo.GetAllDeleted()
}