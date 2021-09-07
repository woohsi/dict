package main

import (
	"dict/db"
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Word struct {
	Id bson.ObjectId `json:"id,omitempty" bson:"id,omitempty"`
	Title string `json:"title" bson:"title"`
	Items []string `json:"items" bson:"items"`
}

var dbConnection *db.DBConnection
var collection *mgo.Collection

func init()  {
	dbConnection = db.NewConnection()
	collection = dbConnection.Use("dict", "vv30k")
}

func (r *Word)InsertOne() (id string, err error) {
	var t *Word = &Word{}
	err = collection.Insert(*r)
	if err != nil {
		return "", err
	} 
	collection.Find(bson.M{"title": r.Title}).One(t)
	return t.Id.Hex(), err
}

func main() {
	b, err := ioutil.ReadFile("vv30K.dict") // just pass the file name
	// b, err := ioutil.ReadFile("test.txt") // just pass the file name
	if err != nil {
			fmt.Print(err)
	}
	s := string(b)
	re := regexp.MustCompile("\n\n")
	words := re.Split(s, -1)

	
	for _, word := range words {
		r := regexp.MustCompile(`@(.+)\n- ([\w\W]+)`)
		matchs := r.FindStringSubmatch(word)
		var wd *Word
		
		if len(matchs) == 0 {
			fmt.Println("Unmatched: ", word)
		} else {
			title := matchs[1]
			items := matchs[2]
			its := strings.Split(items, "\n- ")
			wd = &Word{Title: title, Items: its}
			wd.InsertOne()
		}
		//use(wd)
		//fmt.Println(wd)
	}
	fmt.Println("Count: ", len(words))
}

func use(v interface{}) {

}