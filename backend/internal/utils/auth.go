package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
)

// GetUserID достаёт user_id из контекста Gin
func GetUserID(c *gin.Context) (int64, error) {

	userIDValue, exists := c.Get("user_id")
	if !exists {
		return 0, errors.New("user_id not found in context")
	}

	userID, ok := userIDValue.(int64)
	if !ok {
		return 0, errors.New("user_id has wrong type")
	}

	return userID, nil
}

// GetUserRole достаёт user_role из контекста Gin
func GetUserRole(c *gin.Context) (string, error) {

	roleValue, exists := c.Get("role")
	if !exists {
		return "", errors.New("role not found in context")
	}

	role, ok := roleValue.(string)
	if !ok {
		return "", errors.New("role has invalid type")
	}

	return role, nil
}