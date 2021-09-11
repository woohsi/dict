package main

import (
	"dict/db"
	"fmt"
	"io/ioutil"
	"regexp"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Word2 struct {
	Id bson.ObjectId `json:"id,omitempty" bson:"id,omitempty"`
	Title string `json:"title" bson:"title"`
	Definition string `json:"definition" bson:"definition"`
}


var dbConnection *db.DBConnection
var collection *mgo.Collection

func init()  {
	dbConnection = db.NewConnection()
	collection = dbConnection.Use("dict", "hanviet")
}

func (r *Word2)InsertOne() (id string, err error) {
	var t *Word2 = &Word2{}
	err = collection.Insert(*r)
	if err != nil {
		return "", err
	} 
	collection.Find(bson.M{"title": r.Title}).One(t)
	return t.Id.Hex(), err
}

func main() {
	b, err := ioutil.ReadFile("../hanviet.html") // just pass the file name
	// b, err := ioutil.ReadFile("test.txt") // just pass the file name
	if err != nil {
			fmt.Print(err)
	}
	s := string(b)
	re := regexp.MustCompile("<hr/>\r\n")
	words := re.Split(s, -1)

	
	for _, word := range words {
		r := regexp.MustCompile(`^<DIV.+?>(.+?)</DIV>\r\n(<TABLE [\w\W]+?</TABLE>)`)
		matchs := r.FindStringSubmatch(word)
		var wd *Word2
		
		if len(matchs) == 0 {
			fmt.Println("Unmatched: ", word)
		} else {
			title := matchs[1]
			definition := matchs[2]

			wd = &Word2{Title: title, Definition: definition}
			wd.InsertOne()
		}
		//use(wd)
		//fmt.Println(wd)
	}
	fmt.Println("Count: ", len(words))
}

func use(v interface{}) {

}