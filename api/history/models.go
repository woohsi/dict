package history

import (
	"dict/db"
	"fmt"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type History struct {
	Id bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Title string `json:"title" bson:"title"`
	Note string `json:"note,omitempty" bson:"note,omitempty"`
	CreateAt time.Time `json:"createAt,omitempty" bson:"createAt,omitempty"`
}

var dbConnection *db.DBConnection
var collection *mgo.Collection

func init()  {
	dbConnection = db.NewConnection()
	collection = dbConnection.Use("dict", "history")
}

func (h *History)Find() (list []History, err error) {
	err = collection.Find(nil).Sort("-createAt").All(&list)
	return list, err
}

func Find(title string) (h *History, err error) {
	h = &History{}
	err = collection.Find(bson.M{"$and": []bson.M{{"title": title}, {"note": bson.M{"$exists": true}}}}).One(h)
	if err != nil {
		return nil, err
	}
	return h, err
}

func (h *History)Insert() (id string, err error) {
	var t *History = &History{}
	if h.Note == "" {
		err = collection.Insert(*h)
		if err != nil {
			return "", err
		}
	} else {
		changeInfo, err := collection.Upsert(bson.M{"$and": []bson.M{{"title": h.Title}, {"note": bson.M{"$exists": true}}}}, bson.M{"$set": bson.M{"note": h.Note, "createAt": time.Now()}})
		fmt.Println(changeInfo)
		if err != nil {
			return "", err
		}
	}
	collection.Find(bson.M{"title": h.Title}).One(t)
	return t.Id.Hex(), err
}