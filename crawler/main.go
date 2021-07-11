package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"

	//"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"dict/wash"

	"github.com/gocolly/colly"
	//"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Record struct {
	Id int `json:"id" bson:"id"`
	Title string `json:"title" bson:"title"`
	Definitions []Definition `json:"definitions" bason:"definitions"`
}

type Definition struct {
	Id int `json:"id" bson:"id"`
	Type string `json:"type" bson:"type"`
	Meaning string `json:"meaning" bson:"meaning"`
	Examples []string `json:"examples" bson:"examples"`
}

type DBWriter struct {
	mutex sync.Mutex
}

var (
	wg sync.WaitGroup
	collection *mongo.Collection
	writer *DBWriter
	success int = 0
	notfound int = 0
	errors []string
)

func NewDBWriter() *DBWriter {
	return &DBWriter{mutex: sync.Mutex{}}
}

func (w *DBWriter) Write (coll *mongo.Collection, v interface{}) error {
	w.mutex.Lock()
	_, err := coll.InsertOne(context.TODO(), v)
	// opts := options.Update().SetUpsert(true)
	// _, err := coll.UpdateOne(context.TODO(), v, bson.D{{"$set", v}}, opts)
	if err != nil {
		fmt.Printf("Error inserting: %s", err)
	}
	defer w.mutex.Unlock()
	return err
}

func init()  {
	collection = ConnectDB()
	writer = NewDBWriter()
}

func main() {
	crawl()
	//wash.Wash()
	//ConnetToMongo()
	//readJSON()	
}

func ConnectDB() *mongo.Collection {
	uri := "mongodb://mongo:mongo@139.9.118.67:27017"
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	// defer func ()  {
	// 	if err = client.Disconnect(ctx); err != nil {
	// 		panic(err)
	// 	}	
	// }()

	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected and pinged.")

	collection := client.Database("dict").Collection("words2")
	return collection
}

// func ConnetToMongo()  {
// 	uri := "mongodb://mongo:mongo@139.9.118.67:27017"
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()
	
// 	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
// 	defer func ()  {
// 		if err = client.Disconnect(ctx); err != nil {
// 			panic(err)
// 		}	
// 	}()

// 	if err = client.Ping(ctx, readpref.Primary()); err != nil {
// 		panic(err)
// 	}

// 	fmt.Println("Successfully connected and pinged.")

// 	collection := client.Database("dict").Collection("user")
// 	// find many
// 	cur, err := collection.Find(ctx, bson.D{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer cur.Close(ctx)
// 	for cur.Next(ctx) {
// 		var result bson.D
// 		if err := cur.Decode(&result); err != nil {
// 			log.Fatal(err)
// 		}
// 		fmt.Println(result)
// 	}
// 	if err = cur.Err(); err != nil {
// 		log.Fatal(err)
// 	}

// 	// find one
// 	var res struct {
// 		Name string
// 		Country string
// 	}
// 	filter := bson.D{{"name", "Zhang"}}
// 	err = collection.FindOne(ctx, filter).Decode(&res)
// 	if err == mongo.ErrNoDocuments {
// 		fmt.Println("record does not exit")
// 	} else if err != nil {
// 		log.Fatal(err)
// 	}
// 	fmt.Println(res)

// 	// insert one
// 	collection = client.Database("dict").Collection("words")
// 	record := readJSON()
// 	writer := NewDBWriter()
// 	writer.Write(collection, &record)
	
// }
func crawl() {
	// fName := "t.json"
	// file, err := os.Create(fName)
	// if err != nil {
	// 	log.Fatalf("Cannot create file %q: %s", fName, err)
	// 	return
	// }
	// defer file.Close()

	c := colly.NewCollector(
		colly.AllowedDomains("tratu.soha.vn"),
	)

	//records := make([]Record, 0)

	c.OnHTML("#column-content", func(h *colly.HTMLElement) {
		// heading := h.ChildText("#content .firstHeading>script")
		// re := regexp.MustCompile(`strHtml='(.*)'`)
		// m := re.FindStringSubmatch(heading)
		// title := strings.ToLower(m[1])
		// use(title)
		title0 := h.Request.Ctx.Get("title")
		title0, _ = url.QueryUnescape(title0)
		//fmt.Println(title0, " -- ", title)
		// if title == "Kết quả tìm" {
		// 	log.Println("Missed 1 word")
		// }
		//fmt.Println("Get " + strings.ToLower(m[1]))
		
		definitions := make([]Definition, 0)
		// for each type (noun, verb, ...)
		h.ForEach("#bodyContent > div#content-3",func(i int, h *colly.HTMLElement) {
			tp := strings.Trim(h.ChildText("h3 > span.mw-headline"), " ")
			// for each definition of the type "tp"
			h.ForEach("div#content-5", func(i int, h *colly.HTMLElement) {
				meaning := h.ChildText("h5 > span.mw-headline")
				examples := make([]string, 0)
				// for each e.g.
				h.ForEach("div#content-5 > dl > dd > i", func(i int, h *colly.HTMLElement) {
					examples = append(examples, strconv.Itoa(i+1) + ". " + h.Text)
				})
				definition := Definition{
					Id: i,
					Type: tp,
					Meaning: meaning,
					Examples: examples,
				}
				definitions = append(definitions, definition)
				//fmt.Println("flag2 ", examples)
			})
		})
		if len(definitions) == 0 {
			notfound++
			return
		}
		record := Record{
			Title: title0,
			Definitions: definitions,
		}
		//fmt.Println(record)
		writer.Write(collection, &record)
		success++
		//use(record)
		//records	= append(records, record)
	})
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})
	c.OnError(func(r *colly.Response, e error) {
		fmt.Println("Error: ", r.Ctx.Get("title"))
		errors = append(errors, r.Ctx.Get("title"))
	})
	words := wash.ImportWords()
	//words := []string{"a"}
	taskLoad := len(words)
	tasks := make(chan string, taskLoad)
	// populate tasks in chan
	for _, word := range words {
		//fmt.Println(title)
		tasks <- word
	}
	close(tasks)
	workerCount := 100
	
	for i := 1; i <= workerCount; i++ {
		wg.Add(1)
		go func (tasks chan string, worker int)  {
			fmt.Printf("Workder %d: Started\n", worker)
			for task := range tasks {
				title := url.QueryEscape(task)
				title = strings.Replace(title, "+", "_", -1)
				u := "http://tratu.soha.vn/dict/vn_vn/" + title
				ctx := colly.NewContext()
				ctx.Put("title", task)
				c.Request("GET", u, nil, ctx, nil)
			}
			fmt.Printf("Workder %d finished\n", worker)
			wg.Done()
		}(tasks, i)
	}

	wg.Wait()
	fmt.Println("Errors: ", len(errors))
	writeJSON("errors.json", errors)
	// enc := json.NewEncoder(file)
	// enc.SetIndent("", "  ")
	// enc.Encode(&records)
}

func readJSON(fName string, object interface{}) interface{} {
	jsonFile, err := os.Open(fName)
	if err != nil {
		panic(err)
	}
	defer jsonFile.Close()

	jsonData, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		panic(err)
	}
	json.Unmarshal(jsonData, &object)
	return object
}

func writeJSON(fName string, object interface{})  {
	
	output, err := json.MarshalIndent(&object, "", "\t")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile(fName, output, 0644)
	if err != nil {
		log.Fatalf("Error writing JSON to file %q: %s", fName, err)
	}
}

func use(v interface{}) {

}
