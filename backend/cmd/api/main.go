package main

// @title Email Campaign API
// @version 1.0
// @description API для конструктора email-рассылок
// @host localhost:8081
// @BasePath /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

// @security BearerAuth

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"opd-backend/internal/handlers"
	"opd-backend/internal/repositories"
	"opd-backend/internal/middleware"
	"opd-backend/internal/services"
	"opd-backend/storage"

	_ "opd-backend/docs"
  swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	// 1. Загружаем переменные окружения
	if err := godotenv.Load("../.env"); err != nil {
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
	clientRepo := repositories.NewClientRepository(db)
	campaignRepo := repositories.NewCampaignRepository(db)

	// 4. Инициализируем сервисы
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is not set in .env file")
	}

	userService := services.NewUserService(userRepo, jwtSecret)
	templateService := services.NewTemplateService(templateRepo)
	clientService := services.NewClientService(clientRepo)
	campaignService := services.NewCampaignService(campaignRepo)

	// 5. Инициализируем обработчики (handlers)
	authHandler := handlers.NewAuthHandler(userService)
	templateHandler := handlers.NewTemplateHandler(templateService)
	clientHandler := handlers.NewClientHandler(clientService)
	campaignHandler := handlers.NewCampaignHandler(campaignService)

	// 6. Настраиваем роутер Gin
	r := gin.Default()

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.Use(func(c *gin.Context) {
    c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
    c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
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
		// Публичные маршруты (без авторизации)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)   // POST /api/auth/register
			auth.POST("/login", authHandler.Login)         // POST /api/auth/login
		}

		// Защищённые маршруты (требуют авторизации)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware([]byte(jwtSecret)))
		{

			templates := protected.Group("/templates")
			{
				templates.POST("", templateHandler.CreateTemplate)       // POST /api/templates
				templates.GET("", templateHandler.GetAllTemplates)       // GET /api/templates
				templates.GET("/:id", templateHandler.GetTemplateByID)   // GET /api/templates/:id
				templates.GET("/user", templateHandler.GetTemplatesByUserID) // GET /api/templates/user
				templates.PATCH("/:id", templateHandler.UpdateTemplate)    // PATCH /api/templates/:id
				templates.DELETE("/:id", templateHandler.DeleteTemplate) // DELETE /api/templates/:id
			}

			clients := protected.Group("/clients")
			{
				clients.POST("", clientHandler.CreateClient)       // POST /api/clients
				clients.GET("", clientHandler.GetAllClients)       // GET /api/clients
				clients.PATCH("/:id", clientHandler.UpdateClient)		// PATCH /api/clients/:id
				clients.DELETE("/:id", clientHandler.DeleteClient)	// DELETE /api/clients/:id
			}

			campaign := protected.Group("/campaigns")
			{
				campaign.POST("", campaignHandler.CreateCampaign)       // POST /api/campaigns
				campaign.GET("", campaignHandler.GetAllCampaigns)       // GET /api/campaigns
				campaign.PATCH("/:id", campaignHandler.UpdateStatus)	// PATCH /api/campaigns/:id
				campaign.DELETE("/:id", campaignHandler.DeleteCampaign)	// DELETE /api/campaigns/:id
			}

		}
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