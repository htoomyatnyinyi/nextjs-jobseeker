"use client";

// Keep this, but it's now wrapped by the dynamic import
// Now, these imports will only be executed in the browser
import { Document, Page } from "react-pdf";

import { pdfjs } from "react-pdf";
// // Set the worker source (this is also client-side specific)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// ✅ ADD this line to serve the worker file locally
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker.min.js`;

// @ts-ignore - no type declarations for CSS side-effect import
import "react-pdf/dist/Page/AnnotationLayer.css";
// @ts-ignore - no type declarations for CSS side-effect import
import "react-pdf/dist/Page/TextLayer.css";

export default function PDFViewerContent(
  // { fileUrl }: { fileUrl: string },
  { fileUrl }: any,
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void,
  // onDocumentLoadError: ({ numPages }: { numPages: number }) => void,
  numPages: number
) {
  // console.log(fileUrl.fileName, "check");
  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-center mb-4">PDF Viewer</h2>
        {!fileUrl && <p>No PDF file provided.</p>}
        {fileUrl && (
          // <Document file={fileUrl}>
          //   <Page pageNumber={1} />
          // </Document>

          <Document
            file={fileUrl.filePath}
            // file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            // onLoadError={onDocumentLoadError}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
