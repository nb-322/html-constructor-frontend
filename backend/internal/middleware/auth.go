package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware проверяет JWT токен и достаёт user_id
func AuthMiddleware(jwtSecret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {

		// 1. Получаем заголовок Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "нет Authorization заголовка"})
			c.Abort()
			return
		}

		// 2. Проверяем формат: Bearer <token>
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный формат токена"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 3. Парсим токен
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "токен невалиден"})
			c.Abort()
			return
		}

		// 4. Достаём данные из токена
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ошибка claims"})
			c.Abort()
			return
		}

		// 5. Достаём user_id (ВАЖНО: float64!)
		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id не найден"})
			c.Abort()
			return
		}

		userID := int64(userIDFloat)

		// 6. Достаём роль (опционально)
		role, _ := claims["role"].(string)

		// 7. Кладём в контекст
		c.Set("user_id", userID)
		c.Set("role", role)

		// 8. Передаём дальше
		c.Next()
	}
}