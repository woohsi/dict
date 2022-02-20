package pages

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	//"github.com/pdfcpu/pdfcpu/pkg/api"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

var idxs = make([]Index, 0)

func init()  {
	//api.SplitFile("1001-1079.pdf", "1001-1079", 1, nil)
	f, _ := os.Open("./index.csv")
	r := csv.NewReader(f)
	r.LazyQuotes = true
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		record = Map(record, Trim)
		pg, _ := strconv.Atoi(record[0])
		idxs = append(idxs, Index{pg, record[1], record[2]})
	}
	fmt.Println("Load index.csv success")
}

type Index struct {
	Page  int
	Start string
	End   string
}

var cl = collate.New(language.Vietnamese)

func less(a, b string) bool {
	return cl.CompareString(strings.ReplaceAll(a, "-", " "), strings.ReplaceAll(b, "-", " ")) == -1
}

func myLess(a, b string) bool {
	s1 := strings.Split(a, " ")
	s2 := strings.Split(b, " ")
	len1, len2 := len(s1), len(s2)
	
	minLen := min(len1, len2)
	var i = 0
	for ; i < minLen; i++ {
		if less(s1[i], s2[i]) {
			return true
		}
		if less(s2[i], s1[i]) {
			return false
		}
	}
	if i < len1 {
		return false
	}
	if i < len2 {
		return true
	}
	return false // equal
}

func myLesse(a, b string) bool {
	a = strings.ReplaceAll(a, "-", " ")
	b = strings.ReplaceAll(b, "-", " ")
	return myLess(a, b) || equal(a, b)
}

func lesse(a, b string) bool {
	a, b = strings.ToLower(a), strings.ToLower(b)
	return less(a, b) || equal(a, b)
}

func great(a, b string) bool {
	return cl.CompareString(strings.ReplaceAll(a, "-", " "), strings.ReplaceAll(b, "-", " ")) == 1
}

func equal(a, b string) bool {
	return cl.CompareString(strings.ReplaceAll(a, "-", " "), strings.ReplaceAll(b, "-", " ")) == 0
}

func Find(target string) int {
	for _, idx := range idxs {
		if myLesse(idx.Start, target) && myLesse(target, idx.End) {
			return idx.Page
		}
	}
	return -1
}

func Map(vs []string, f func(string) string) []string {
	vsm := make([]string, len(vs))
	for i, v := range vs {
		vsm[i] = f(v)
	}
	return vsm
}

func Trim(s string) string {
	return strings.Trim(s, " ")
}

func min(a, b int) int {
	if a < b {
			return a
	}
	return b
}
