import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import {isMobile} from 'react-device-detect';
import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = '_pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDF(props) {
  const [, setNumPages] = useState(null);
  const [pageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError() {
    console.log('Load pdf failed');
  }

  let f = null;
  let host = null;
  // eslint-disable-next-line react/prop-types
  if (props.page) {
    // eslint-disable-next-line react/prop-types
    if (props.page <= 570) {
      // host = "https://protected-eyrie-67539.herokuapp.com"
      host = 'https://d.woohsi.top';
    } else {
      // host = "https://boiling-waters-71343.herokuapp.com"
      host = 'https://d.woohsi.top';
    }
    //host = 'http://localhost';
    // eslint-disable-next-line react/prop-types
    f = host + '/pdf/' + props.page + '.pdf';
  }
  
  let page = null;
  if (isMobile) {
    page = <Page renderMode="svg" renderTextLayer={false} scale="0.9" pageNumber={pageNumber} />;
  } else {
    page = <Page renderMode="svg" renderTextLayer={false} width={window.innerWidth*0.9} pageNumber={pageNumber} />;
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
