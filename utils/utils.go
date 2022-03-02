package utils

import (
	"dict/api/history"
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
	if status, ok := obj["status"]; ok {
		if status.(bool) {
			h := &history.History{
				Title: obj["title"].(string),
				CreateAt: time.Now(),
			}
			InfoLogger.Printf("准备插入历史, %v\n", h)
			h.Insert()
		}
	}
	c.JSON(code, obj)
}