package wash

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
)

func Wash()  {
	fName := "./viethan.txt"
	file, err := os.Open(fName)
	if err != nil {
		log.Fatalf("Cannot open file %q: %s", fName, err)
	}
	defer file.Close()
	
	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)
	var words []string
	for scanner.Scan() {
		line := scanner.Text()
		re := regexp.MustCompile(`^(.*?)\s<`)
		m := re.FindStringSubmatch(line)
		words = append(words, m[1])
	}
	
	wName := "./result.txt"
	wfile, err := os.OpenFile(wName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Cannot open file %q: %s", wName, err)
	}
	defer wfile.Close()
	w := bufio.NewWriter(wfile)
	successCount := 0
	errorCount := 0
	for _, word := range words {
		_, err = w.WriteString(word + "\n")
		if err != nil {
			log.Printf("Error writing [%v]", word)
			errorCount++
		} else {
			successCount++
		}
	}
	w.Flush()
	fmt.Printf("Total: %d, success: %d, failed: %d\n", len(words), successCount, errorCount)
}

func ImportWords() ([]string){
	fName := "./vv30K.txt"
	file, err := os.Open(fName)
	if err != nil {
		log.Fatalf("Cannot open file %q: %s", fName, err)
	}
	defer file.Close()
	
	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)
	var words []string
	for scanner.Scan() {
		line := scanner.Text()
		words = append(words, line)
	}
	return words
}