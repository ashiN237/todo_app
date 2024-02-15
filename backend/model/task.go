package model

import (
	"time"

	"github.com/google/uuid"
)

type Status int

const (
	NotStarted Status = iota
	InProgress
	Completed
)

type Task struct {
	ID        uuid.UUID `gorm:"type:char(36);primaryKey"`
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
	Status    Status
}

func GetTasks() ([]Task, error) {
	var tasks []Task
	err := db.Find(&tasks).Error
	return tasks, err
}

func AddTask(id uuid.UUID, name string, status Status) (*Task, error) {
	task := Task{
		ID:        id,
		Name:      name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Status:    status,
	}

	err := db.Create(&task).Error

	return &task, err
}

func ChangeStatus(taskID uuid.UUID, status Status) error {
	err := db.Model(&Task{}).Where("id = ?", taskID).Update("status", status).Error
	return err
}

func DeleteTask(taskID uuid.UUID) error {
	err := db.Where("id = ?", taskID).Delete(&Task{}).Error
	return err
}

func GetTasksByUserID(userID uuid.UUID) ([]Task, error) {
	var tasks []Task
	err := db.Where("user_id = ?", userID).Find(&tasks).Error
	return tasks, err
}

