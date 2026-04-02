package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"opd-backend/internal/handlers"
	"opd-backend/internal/repositories"
	"opd-backend/internal/services"
	"opd-backend/storage"
)

func main() {
	// 1. Загружаем переменные окружения
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// 2. Подключаемся к базе данных
	db, err := storage.NewPostgres()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// 3. Инициализируем репозитории
	userRepo := repositories.NewUserRepository(db)
	templateRepo := repositories.NewTemplateRepository(db)
	// 4. Инициализируем сервисы
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is not set in .env file")
	}

	userService := services.NewUserService(userRepo, jwtSecret)
	templateService := services.NewTemplateService(templateRepo)
	// 5. Инициализируем обработчики (handlers)
	authHandler := handlers.NewAuthHandler(userService)
	templateHandler := handlers.NewTemplateHandler(templateService)
	// 6. Настраиваем роутер Gin
	r := gin.Default()

	r.Use(func(c *gin.Context) {
    c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
    c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if c.Request.Method == "OPTIONS" {
        c.AbortWithStatus(204)
        return
    }

    c.Next()
})

	// Группа всех API маршрутов
	api := r.Group("/api")
	{
		// ======================
		// Публичные маршруты (без авторизации)
		// ======================
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)   // POST /api/auth/register
			auth.POST("/login", authHandler.Login)         // POST /api/auth/login
		}

		templates := api.Group("/templates")
		{
			templates.POST("", templateHandler.CreateTemplate)       // POST /api/templates
			templates.GET("", templateHandler.GetAllTemplates)       // GET /api/templates
			templates.GET("/:id", templateHandler.GetTemplateByID)   // GET /api/templates/:id
			templates.PUT("/:id", templateHandler.UpdateTemplate)    // PUT /api/templates/:id
			templates.DELETE("/:id", templateHandler.DeleteTemplate) // DELETE /api/templates/:id
		}

		// Сюда позже добавим защищённые маршруты (шаблоны, кампании и т.д.)
		// protected := api.Group("/").Use(middleware.AuthMiddleware(userService))
	}

	// Простой маршрут для проверки, что сервер живой
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "ok",
		})
	})

	// 7. Запускаем сервер
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}