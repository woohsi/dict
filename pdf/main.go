package main

import (
	"os"
	
	"github.com/unidoc/unipdf/v3/common/license"
	"github.com/unidoc/unipdf/v3/model"
	"github.com/joho/godotenv"
)

func init() {
	// Make sure to load your metered License API key prior to using the library.
	// If you need a key, you can sign up and create a free one at https://cloud.unidoc.io
	godotenv.Load(".env")
	err := license.SetMeteredKey(os.Getenv(`UNIDOC_LICENSE_API_KEY`))
	if err != nil {
		panic(err)
	}
}

func main() {
	splitPdf("./x.pdf", "./1.pdf", 1, 2)
}

func splitPdf(inputPath string, outputPath string, pageFrom int, pageTo int) error {
	pdfWriter := model.NewPdfWriter()
	pdfReader, f, err := model.NewPdfReaderFromFile(inputPath, nil)
	if err != nil {
		return err
	}
	defer f.Close()

	numPages, err := pdfReader.GetNumPages()
	if err != nil {
		return err
	}

	if numPages < pageTo {
		return err
	}

	for i := pageFrom; i <= pageTo; i++ {
		pageNum := i

		page, err := pdfReader.GetPage(pageNum)
		if err != nil {
			return err
		}

		err = pdfWriter.AddPage(page)
		if err != nil {
			return err
		}
	}

	fWrite, err := os.Create(outputPath)
	if err != nil {
		return err
	}

	defer fWrite.Close()

	err = pdfWriter.Write(fWrite)
	if err != nil {
		return err
	}

	return nil
}
