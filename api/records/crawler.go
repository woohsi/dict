package records

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"time"

	//"regexp"
	"strconv"
	"strings"
	"dict/utils"
	"github.com/gocolly/colly"
)

func Crawl(word string) (record *Record){
	word = strings.Trim(word, " ")

	c := colly.NewCollector(
		colly.AllowedDomains("tratu.soha.vn"),
	)

	c.OnHTML("#column-content", func(h *colly.HTMLElement) {
		// heading := h.ChildText("#content .firstHeading>script")
		// re := regexp.MustCompile(`strHtml='(.*)'`)
		// m := re.FindStringSubmatch(heading)
		// title := strings.ToLower(m[1])
		// use(title)
		title0 := h.Request.Ctx.Get("title")
		title0, _ = url.QueryUnescape(title0)

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

		// 处理没有词性的单词
		if len(definitions) == 0 {
			tp := ""
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
		}

		record = &Record{
			Title: title0,
			Definitions: definitions,
			CreateAt: time.Now(),
		}
		
		utils.InfoLogger.Printf("Get %v in OnHTML: %v\n", word, record)

	})

	c.OnRequest(func(r *colly.Request) {
		utils.InfoLogger.Println("Visiting", r.URL)
	})

	c.OnError(func(r *colly.Response, e error) {
		utils.ErrorLogger.Println("Error: ", r.Ctx.Get("title"))
	})
	
	title := url.QueryEscape(word)
	title = strings.Replace(title, "+", "_", -1)
	u := "http://tratu.soha.vn/dict/vn_vn/" + title
	ctx := colly.NewContext()
	ctx.Put("title", word)
	c.Request("GET", u, nil, ctx, nil)
	utils.InfoLogger.Printf("Get %v in crawl func: %v\n", word, record)
	utils.InfoLogger.Println("crawl func finish")
	
	if record == nil || record.Definitions == nil || len(record.Definitions) == 0 {
		return nil
	}
	return record
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
