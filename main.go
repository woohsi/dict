package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/gocolly/colly"
)

type Record struct {
	Id int `json:"id"`
	Title string `json:"title"`
	Definitions []Definition `json:"definitions"`
}

type Definition struct {
	Id int `json:"id"`
	Type string `json:"type"`
	Meaning string `json:"meaning"`
	Examples []string `json:"examples"`
}

func main() {
	crawl()
	
}
func crawl() {
	fName := "t.json"
	file, err := os.Create(fName)
	if err != nil {
		log.Fatalf("Cannot create file %q: %s", fName, err)
		return
	}
	defer file.Close()

	c := colly.NewCollector(
		colly.AllowedDomains("tratu.soha.vn"),
	)

	var record Record

	c.OnHTML("#column-content", func(h *colly.HTMLElement) {
		fmt.Println("GET ^_^")
		heading := h.ChildText("#content .firstHeading>script")
		re := regexp.MustCompile(`strHtml='(.*)'`)
		m := re.FindStringSubmatch(heading)
		title := strings.ToLower(m[1])
		fmt.Println(strings.ToLower(m[1]))
		
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
					Type: tp,
					Meaning: meaning,
					Examples: examples,
				}
				definitions = append(definitions, definition)
				//fmt.Println("flag2 ", examples)
			})
		})
		record = Record{
			Title: title,
			Definitions: definitions,
		}
	})
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})
	c.OnError(func(r *colly.Response, e error) {
		fmt.Println("Error", e)
	})
	title := url.QueryEscape("a")
	title = strings.Replace(title, "+", "_", -1)
	fmt.Println(title)
	c.Visit("http://tratu.soha.vn/dict/vn_vn/" + title)

	enc := json.NewEncoder(file)
	enc.SetIndent("", "  ")
	enc.Encode(&record)
}
func readJSON() {
	jsonFile, err := os.Open("record.json")
	if err != nil {
		panic(err)
	}
	defer jsonFile.Close()

	jsonData, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		panic(err)
	}
	var record Record
	json.Unmarshal(jsonData, &record)
	fmt.Printf("%+v\n\n", record)
	fmt.Printf("%#v\n", record)
}
func writeJSON(object interface{})  {
	output, err := json.MarshalIndent(&object, "", "\t")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("test_recourd.json", output, 0644)
	if err != nil {

	}
}
