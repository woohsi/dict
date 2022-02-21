package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/index", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"index": c.FullPath()})
	})

	router.GET("/redirect", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/index")
	})

	router.GET("/goindex", func(c *gin.Context) {
		c.Request.URL.Path = "/index"
		router.HandleContext(c)
	})

	// 匹配 /user/geektutu
	router.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	// 匹配users?name=xxx&role=xxx，role可选
	router.GET("/users", func(c *gin.Context) {
		name := c.Query("name")
		role := c.DefaultQuery("role", "teacher")
		c.String(http.StatusOK, "%s is a %s", name, role)
	})

	// POST
	router.POST("/form", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.DefaultPostForm("password", "000000") // 可设置默认值

		c.JSON(http.StatusOK, gin.H{
			"username": username,
			"password": password,
		})
	})

	// GET 和 POST 混合
	router.POST("/posts", func(c *gin.Context) {
		id := c.Query("id")
		page := c.DefaultQuery("page", "0")
		username := c.PostForm("username")
		password := c.DefaultPostForm("username", "000000") // 可设置默认值

		c.JSON(http.StatusOK, gin.H{
			"id":       id,
			"page":     page,
			"username": username,
			"password": password,
		})
	})

	router.POST("/post", func(c *gin.Context) {
		ids := c.QueryMap("ids")
		names := c.PostFormMap("names")

		c.JSON(http.StatusOK, gin.H{
			"ids":   ids,
			"names": names,
		})
	})

	// Simple group: v1
	v1 := router.Group("/v1")
	{
		v1.GET("/login", loginEndpoint)

	}

	// Simple group: v2
	v2 := router.Group("/v2")
	{
		v2.POST("/login", loginEndpoint)

	}

	router.Run(":8090")
}

func loginEndpoint(c *gin.Context) {
	c.JSON(200, gin.H{"msg": "Hello, world"})
}
