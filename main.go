package main

import (
	"dict/api/history"
	"dict/api/pages"
	"dict/api/records"
	"io"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	// Disable Console Color, you don't need console color when writing the logs to file.
	gin.DisableConsoleColor()

	// Logging to a file.
	f, _ := os.OpenFile("./logs/gin.log", os.O_CREATE | os.O_WRONLY | os.O_APPEND, 0666)
	//gin.DefaultWriter = io.MultiWriter(f)

	// Use the following code if you need to write the logs to file and console at the same time.
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	router := gin.Default()
	api := router.Group("/api")
	{
		api.GET("/records/vietviet/:title", records.FindVietVietOne)
		api.GET("/records/hanviet/:title", records.FindHanVietOne)
		api.GET("/record/:id", records.FindId)
		api.GET("/pages/:title", pages.FindPage)
		api.GET("/history", history.List)
		api.GET("/history/:title", history.FindHistory)
		api.POST("/history", history.Create)
	}
	router.Run(":8080")
}
