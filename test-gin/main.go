package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Simple group: v1
	v1 := router.Group("/v1")
	{
		v1.POST("/login", loginEndpoint)
	
	}

	// Simple group: v2
	v2 := router.Group("/v2")
	{
		v2.POST("/login", loginEndpoint)

	}

	router.Run(":8080")
}

func loginEndpoint(c *gin.Context) {
	c.JSON(200, gin.H{"msg": "Hello, world"})
}
