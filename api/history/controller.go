package history

import (
	"time"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	h := &History{}
	l, err := h.Find()
	if err != nil {
		// utils.ErrorLogger.Fatalln("历史记录查询失败")
		c.JSON(200, gin.H{"message": "历史记录查询失败", "code": 43})
		return
	}
	c.JSON(200, gin.H{"data": l, "code": 0})
}

func FindHistory(c *gin.Context) {
	title := c.Param("title")
	h, err := Find(title)
	if err != nil {
		c.JSON(200, gin.H{"message": "从记忆库中获取该词失败", "code": 43})
		return
	}
	c.JSON(200, gin.H{"data": h, "code": 0})
}

func Create(c *gin.Context) {
	title := c.PostForm("title")
	note := c.PostForm("note")

	h := &History{
			Title: title,
			Note: note,
			CreateAt: time.Now(),
		}
	h.Insert()
	c.JSON(200, gin.H{"code": 0, "message": "添加成功"})
}

