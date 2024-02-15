package router

import (
	"os"
	"github.com/labstack/echo/v4/middleware"
	_ "net/http"
	"github.com/labstack/echo/v4"
)

func SetRouter(e *echo.Echo) error {

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${time_rfc3339_nano} ${host} ${method} ${uri} ${status} ${header}\n",
		Output: os.Stdout,
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	api := e.Group("/api")
	{
		apiTasks := api.Group("/tasks")
		{
			apiTasks.GET("", GetTasksHandler)
			apiTasks.POST("", AddTaskHandler)
			apiTasks.PUT("/:taskID", ChangeStatusTaskHandler)
			apiTasks.DELETE("/:taskID", DeleteTaskHandler)
		}
	}

	err := e.Start(":8000")
	return err
}