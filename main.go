package main

import (
	"dict/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Group("/api")
	{
		router.GET("/records/:title", controllers.FindOne)
	}
	router.Run()
}