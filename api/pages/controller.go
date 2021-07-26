package pages

import (
	"github.com/gin-gonic/gin"
	. "dict/utils"
)

//根据单词返回页码
func FindPage(c *gin.Context) {
	title := c.Param("title")
	page := Find(title)
	RES(c, SUCCESS, gin.H{"page": page})
}