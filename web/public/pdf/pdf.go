package main

import (
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

func main() {
		api.SplitFile("viethan.pdf", "./", 1, nil)
}
