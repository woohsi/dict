package utils

import (
	"time"
	"github.com/gin-gonic/gin"
)

const chs = "àáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰự"

func RES(c *gin.Context, code int, obj gin.H) {
	if _, ok := obj["message"]; !ok {
		obj["code"] = code
		obj["message"] = GetMessage(code)
	}
	obj["timestamp"] = time.Now().Format("2006-01-02 15:04:05")
	c.JSON(code, obj)
}

func isWordInRange(word, start, end string) bool {
	return false
}

func compareChar(a, b string)  {
	
}