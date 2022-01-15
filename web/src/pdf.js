import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import {isMobile} from 'react-device-detect';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '_pdf.worker.min.js';
export default function PDF(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError() {
    console.log("Load pdf failed")
  }

  let f = null
  let host = null
  if (props.page) {
    if (props.page <= 570) {
      host = "https://protected-eyrie-67539.herokuapp.com"
    } else {
      host = "https://boiling-waters-71343.herokuapp.com"
    }
    f = host + "/pdf/" + props.page + ".pdf"
  }
  
  let page = null
  if (isMobile) {
    page = <Page renderMode="svg" scale="0.9" pageNumber={pageNumber} />
  } else {
    page = <Page pageNumber={pageNumber} />
  }
  return (
    <div>
      <Document
        file={f}
        loading="Please wait, loading..."
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {page}
      </Document>
      {/* <p>Page {pageNumber} of {numPages}</p> */}
    </div>
  );
}
