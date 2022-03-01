package pages

import (
	"github.com/gin-gonic/gin"
	. "dict/utils"
)

//根据单词返回页码
func FindPage(c *gin.Context) {
	title := c.Param("title")
	page := Find(title)
	m := map[string]interface{} {
		"page": page, 
		"status": page != -1,
	}
	RES(c, SUCCESS, gin.H{
		"data": m,
	})
}