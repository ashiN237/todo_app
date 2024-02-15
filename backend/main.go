package main

import (
	"todo_app/model"
	"todo_app/router"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	config := middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"}, 
		AllowHeaders: []string{echo.HeaderAuthorization, echo.HeaderContentType},
	}

	e.Use(middleware.CORSWithConfig(config))

	model.MigrateDB()

	e.GET("/api/data", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "Hello from the backend!"})
	})

	router.SetRouter(e)

	e.Logger.Fatal(e.Start(":8000"))
}