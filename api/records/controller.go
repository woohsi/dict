package records

import (
	"time"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"

	"dict/utils"
	. "dict/utils"
)

//根据id查释义
func FindId(c *gin.Context) {
	id := c.Param("id")
	record := &Record{}
	err := record.FindId(id)
	if err != nil {
		utils.ErrorLogger.Printf("获取失败,id：%v\n", id)
		RES(c, ERROR, gin.H{})
		return
	}
	RES(c, SUCCESS, gin.H{
		"data": record,
	})
}

//根据单词查释义(Vietviet)
func FindVietVietOne(c *gin.Context) {
	title := c.Param("title")
	utils.InfoLogger.Printf("%v 正在获取：%v\n", c.ClientIP(), title)
	
	record := &Record{}
	record2 := &Record2{}

	err := record.FindTitle(title)
	record2.FindTitleInVV30K(title)
	if err != nil {
		utils.ErrorLogger.Printf("词库中暂无此单词：%v\n", title)
		utils.InfoLogger.Printf("正在从网络获取：%v\n", title)
		record = Crawl(title)
		if record == nil {
			utils.ErrorLogger.Printf("获取失败：%v\n", title)
		} else {
			utils.InfoLogger.Printf("获取成功：%v，准备写入词库\n", title)
			_, err = record.InsertOne()
			if err != nil {
				utils.ErrorLogger.Printf("插入失败：%v\n", err)
			}
		}
	}
	//更新lastSeenAt
	record.Update(bson.M{"title": title}, bson.M{"$set": bson.M{"lastSeenAt": time.Now()}})
	//返回报文
	RES(c, SUCCESS, gin.H{
		"data1": record,
		"data2": record2,
	})
}

//根据单词查释义(Hanviet/Viethan2)
func FindHanVietOne(c *gin.Context) {
	title := c.Param("title")
	utils.InfoLogger.Printf("%v 正在获取：%v\n", c.ClientIP(), title)
	
	record3 := &Record3{}
	err := record3.FindTitleInHanviet(title)
	if err != nil {
		utils.ErrorLogger.Printf("获取失败：%v\n", title)

	}
	//返回报文
	RES(c, SUCCESS, gin.H{
		"data": record3,
	})
}