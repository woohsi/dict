package db

import (
	"os"
	"time"

	"github.com/joho/godotenv"
	"gopkg.in/mgo.v2"
)

type DBConnection struct {
	session *mgo.Session
}

func NewConnection() (conn *DBConnection) {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}
	
	mongo_host := os.Getenv("MONGO_HOST")
	mongo_user := os.Getenv("MONGO_USER")
	//mongo_passwd := os.Getenv("MONGO_PASSWD")
	mongo_passwd := "BestOfYear2021"
	info := &mgo.DialInfo{
		Addrs: []string{mongo_host},
		Timeout: 20 * time.Second,
		Username: mongo_user,
		Password: mongo_passwd,
		Database: "test",
		Source: "admin",
	}
	session, err := mgo.DialWithInfo(info)
	if err != nil {
		panic(err)
	}
	session.SetMode(mgo.Monotonic, true)
	conn = &DBConnection{session}

	return conn
}

func (conn *DBConnection) Use(dbName, tableName string) (collection *mgo.Collection) {
	return conn.session.DB(dbName).C(tableName)

}

func (conn *DBConnection) Close() {
	conn.session.Close()
}
