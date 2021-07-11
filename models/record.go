package models

import (
	"dict/db"
	"strings"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Record struct {
	Id bson.ObjectId `json:"_id" bson:"_id"`
	Title string `json:"title" bson:"title"`
	Definitions []Definition `json:"definitions" bson:"definitions"`
}

type Definition struct {
	Id int `json:"id" bson:"id"`
	Type string `json:"type" bson:"type"`
	Meaning string `json:"meaning" bson:"meaning"`
	Examples []string `json:"examples" bson:"examples"`
}

var dbConnection *db.DBConnection
var collection *mgo.Collection

func init()  {
	dbConnection = db.NewConnection()
	collection = dbConnection.Use("dict", "words")
}

func (r *Record)Find() (list []Record, err error) {
	err = collection.Find(bson.M{"title": "hết"}).All(&list)
	return list, err
}

func (r *Record)FindId(id string) (record Record, err error) {
	err = collection.FindId(bson.ObjectIdHex(id)).One(&record)
	return record, err
}

func (r *Record)FindTitle(title string)(err error) {
	reg := bson.M{"$regex": bson.RegEx{Pattern: "^" + strings.Trim(title, " ") + "$", Options: "i"}}
	err = collection.Find(bson.M{"title": reg}).One(r)
	if err != nil {
		regex := bson.M{"$regex": bson.RegEx{Pattern: strings.Trim(title, " "), Options: "i"}}
		err = collection.Find(bson.M{"title": regex}).One(r)
	}
	return err
}