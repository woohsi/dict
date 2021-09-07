package records

import (
	"dict/db"
	"dict/utils"
	"strings"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Record struct {
	Id bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Title string `json:"title" bson:"title"`
	Definitions []Definition `json:"definitions" bson:"definitions"`
	CreateAt time.Time `json:"createAt,omitempty" bson:"createAt,omitempty"`
	LastSeenAt time.Time `json:"lastSeenAt,omitempty" bson:"lastSeenAt,omitempty"`
}

type Definition struct {
	Id int `json:"id" bson:"id"`
	Type string `json:"type" bson:"type"`
	Meaning string `json:"meaning" bson:"meaning"`
	Examples []string `json:"examples" bson:"examples"`
}

type Word struct {
	Id bson.ObjectId `json:"id,omitempty" bson:"id,omitempty"`
	Title string `json:"title" bson:"title"`
	Items []string `json:"items" bson:"items"`
}

var dbConnection *db.DBConnection
var collection *mgo.Collection
var collection2 *mgo.Collection

func init()  {
	dbConnection = db.NewConnection()
	collection = dbConnection.Use("dict", "words")
	collection2 = dbConnection.Use("dict", "vv30k")
}

func (r *Record)Find() (list []Record, err error) {
	err = collection.Find(bson.M{"title": "hết"}).All(&list)
	return list, err
}

func (r *Record)FindId(id string) (err error) {
	err = collection.FindId(bson.ObjectIdHex(id)).One(&r)
	utils.InfoLogger.Println(r.Id.Hex())
	return err
}

func (r *Record)FindTitle(title string)(err error) {
	reg := bson.M{"$regex": bson.RegEx{Pattern: "^" + strings.Trim(title, " ") + "$", Options: "i"}}
	err = collection.Find(bson.M{"title": reg}).Select(bson.M{"_id": 1, "title": 1, "definitions": 1}).One(r)
	// if err != nil {
	// 	regex := bson.M{"$regex": bson.RegEx{Pattern: strings.Trim(title, " "), Options: "i"}}
	// 	err = collection.Find(bson.M{"title": regex}).One(r)
	// }
	utils.InfoLogger.Println(r.Id.Hex())
	return err
}

func (r *Word)FindTitleInVV30K(title string)(err error) {
	reg := bson.M{"$regex": bson.RegEx{Pattern: "^" + strings.Trim(title, " ") + "$", Options: "i"}}
	err = collection2.Find(bson.M{"title": reg}).Select(bson.M{"_id": 1, "title": 1, "items": 1}).One(r)
	// if err != nil {
	// 	regex := bson.M{"$regex": bson.RegEx{Pattern: strings.Trim(title, " "), Options: "i"}}
	// 	err = collection.Find(bson.M{"title": regex}).One(r)
	// }
	utils.InfoLogger.Println(r.Id.Hex())
	return err
}

func (r *Record)InsertOne() (id string, err error) {
	var t *Record = &Record{}
	err = collection.Insert(*r)
	if err != nil {
		return "", err
	} 
	collection.Find(bson.M{"title": r.Title}).One(t)
	return t.Id.Hex(), err
}

func (r *Record)Update(selector interface{}, update interface{}) (err error){
	return collection.Update(selector, update)
}