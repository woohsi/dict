package utils

import (
	"time"
	"github.com/gin-gonic/gin"
)

func RES(c *gin.Context, code int, obj gin.H) {
	if _, ok := obj["message"]; !ok {
		obj["message"] = GetMessage(code)
	}
	obj["timestamp"] = time.Now().Format("2006-01-02 15:04:05")
	c.JSON(code, obj)
}