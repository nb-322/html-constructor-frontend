package services

import (
    "errors"
    "opd-backend/internal/models"
    "opd-backend/internal/repositories"
)

type TemplateReviewService struct {
    repo         *repositories.TemplateReviewRepository
    templateRepo *repositories.TemplateRepository
}

func NewTemplateReviewService(
    repo *repositories.TemplateReviewRepository,
    templateRepo *repositories.TemplateRepository,
) *TemplateReviewService {
    return &TemplateReviewService{repo: repo, templateRepo: templateRepo}
}

func (s *TemplateReviewService) Submit(tplID int64) (*models.Template, error) {
    template, err := s.templateRepo.GetByID(tplID)
    if err != nil {
        return nil, errors.New("шаблон не найден")
    }
    if template.Status != "черновик" && template.Status != "отклонено" {
        return nil, errors.New("отправить на проверку можно только черновик или отклонённый шаблон")
    }
    return s.repo.Submit(tplID)
}

func (s *TemplateReviewService) GetPending() ([]*models.Template, error) {
    return s.repo.GetPending()
}

func (s *TemplateReviewService) Approve(tplID int64, adminID int64) (*models.Template, error) {
    template, err := s.templateRepo.GetByID(tplID)
    if err != nil {
        return nil, errors.New("шаблон не найден")
    }
    if template.Status != "на_рассмотрении" {
        return nil, errors.New("одобрить можно только шаблон на рассмотрении")
    }
    return s.repo.Approve(tplID, adminID)
}

func (s *TemplateReviewService) Reject(tplID int64, adminID int64, comment string) (*models.Template, error) {
    template, err := s.templateRepo.GetByID(tplID)
    if err != nil {
        return nil, errors.New("шаблон не найден")
    }
    if template.Status != "на_рассмотрении" {
        return nil, errors.New("отклонить можно только шаблон на рассмотрении")
    }
    return s.repo.Reject(tplID, adminID, comment)
}

func (s *TemplateReviewService) GetReviews(tplID int64) ([]*models.TemplateReview, error) {
    return s.repo.GetReviews(tplID)
}