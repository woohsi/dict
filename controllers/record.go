package controllers

import (
	"github.com/gin-gonic/gin"
	"dict/models"
	. "dict/utils"
)

func FindOne(c *gin.Context)  {
	title := c.Param("title")
	record := &models.Record{}
	err := record.FindTitle(title)
	if err != nil {
		RES(c, ERROR, gin.H{})
	} else {
		RES(c, SUCCESS, gin.H{
			"data": record,
		})
	}
}