// components/PDFViewer.tsx
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";

// ---- 1. POINT TO THE LOCAL WORKER ----
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const onLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
    setError(null);
  };

  const onLoadError = (err: any) => {
    console.error(err);
    setError("Failed to load PDF");
  };

  return (
    <div className="pdf-container">
      {error && <p className="error">{error}</p>}

      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={<div>Loading PDF…</div>}
      >
        <Page pageNumber={pageNumber} />
      </Document>

      {numPages && (
        <div className="controls">
          <p>
            Page {pageNumber} / {numPages}
          </p>
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}

      <style jsx>{`
        .pdf-container {
          max-width: 800px;
          margin: 2rem auto;
        }
        .error {
          color: #c33;
          text-align: center;
        }
        .controls {
          margin-top: 1rem;
          text-align: center;
        }
        button {
          margin: 0 0.5rem;
          padding: 0.4rem 0.8rem;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} // "use client";
// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // ✅ Set worker source (use latest version)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// interface PDFViewerProps {
//   fileUrl: string;
// }

// const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//     setLoading(false);
//     setError(null);
//   };

//   const onDocumentLoadError = (error: any) => {
//     setError("Failed to load PDF");
//     setLoading(false);
//     console.error("PDF load error:", error);
//   };

//   return (
//     <div className="pdf-viewer">
//       {loading && <div className="loading">Loading PDF...</div>}
//       {error && <div className="error">Error: {error}</div>}

//       <Document
//         file={fileUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={onDocumentLoadError}
//         loading={<div>Loading PDF...</div>}
//         error={<div>Failed to load PDF</div>}
//       >
//         <Page pageNumber={pageNumber} />
//       </Document>

//       {numPages && (
//         <div className="pdf-controls">
//           <p>
//             Page {pageNumber} of {numPages}
//           </p>
//           {numPages > 1 && (
//             <div className="navigation-buttons">
//               <button
//                 onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
//                 disabled={pageNumber <= 1}
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setPageNumber((prev) => Math.min(numPages!, prev + 1))
//                 }
//                 disabled={pageNumber >= numPages!}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       <style jsx>{`
//         .pdf-viewer {
//           max-width: 800px;
//           margin: 0 auto;
//         }
//         .loading,
//         .error {
//           text-align: center;
//           padding: 20px;
//           font-size: 16px;
//         }
//         .loading {
//           color: #666;
//         }
//         .error {
//           color: #e74c3c;
//         }
//         .pdf-controls {
//           text-align: center;
//           margin-top: 10px;
//         }
//         .navigation-buttons {
//           margin-top: 10px;
//         }
//         .navigation-buttons button {
//           margin: 0 10px;
//           padding: 8px 16px;
//           border: 1px solid #ddd;
//           background: white;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .navigation-buttons button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }
//         .navigation-buttons button:hover:not(:disabled) {
//           background: #f5f5f5;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PDFViewer; // "use client";

// // import { useState } from "react";
// // import { Document, Page } from "react-pdf";
// // import { pdfjs } from "react-pdf";

// // // Set the worker source for pdfjs
// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// // const PDFViewer = ({ fileUrl }: any) => {
// //   const [numPages, setNumPages] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);

// //   function onDocumentLoadSuccess({ numPages }) {
// //     setNumPages(numPages);
// //   }

// //   return (
// //     <div>
// //       <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
// //         <Page pageNumber={pageNumber} />
// //       </Document>
// //       <p>
// //         Page {pageNumber} of {numPages}
// //       </p>
// //       {numPages > 1 && (
// //         <div>
// //           <button
// //             onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
// //           >
// //             Previous
// //           </button>
// //           <button
// //             onClick={() =>
// //               setPageNumber((prev) => Math.min(numPages, prev + 1))
// //             }
// //           >
// //             Next
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PDFViewer;
