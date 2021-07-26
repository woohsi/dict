import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

//import file from './x.pdf';
export default function PDF(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState("");

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError() {
    console.log("Load pdf failed")
  }

  let f = null
  if (props.page) {
    f = "./pdf/" + props.page + ".pdf"
  }
  return (
    <div>
      <Document
        file={f}
        loading="Please wait, loading..."
        width="200px"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}

      >
        <Page pageNumber={pageNumber} />
      </Document>
      {/* <p>Page {pageNumber} of {numPages}</p> */}
    </div>
  );
}