import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Button from '@mui/material/Button';

// Configure pdfjs worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdfPath, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div>
      <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
      <Button onClick={() => setPageNumber(prevPageNumber => prevPageNumber - 1)} disabled={pageNumber <= 1}>Previous</Button>
      <Button onClick={() => setPageNumber(prevPageNumber => prevPageNumber + 1)} disabled={pageNumber >= numPages}>Next</Button>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default PDFViewer;
