package router

import (
	"net/http"
	"time"
	"todo_app/model"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func GetTasksHandler(c echo.Context) error {
	tasks, err := model.GetTasks()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}
	return c.JSON(http.StatusOK, tasks)
}

type ReqTask struct {
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
	Status    model.Status
}

func AddTaskHandler(c echo.Context) error {
	var req struct {
		Name   string       `json:"name"`
		Status model.Status `json:"status"`
	}
	err := c.Bind(&req)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	taskID := uuid.New()

	task, err := model.AddTask(taskID, req.Name, req.Status)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create task")
	}

	return c.JSON(http.StatusOK, task)
}

func ChangeStatusTaskHandler(c echo.Context) error {
	taskIDStr := c.Param("taskID")

	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	var req struct {
		Status model.Status `json:"status"`
	}
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	err = model.ChangeStatus(taskID, req.Status)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Bad Request")
	}

	return c.NoContent(http.StatusNoContent)
}

func DeleteTaskHandler(c echo.Context) error {
	taskIDStr := c.Param("taskID")

	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid task ID")
	}

	err = model.DeleteTask(taskID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete task")
	}

	return c.NoContent(http.StatusNoContent)
}
