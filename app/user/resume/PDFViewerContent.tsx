"use client";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// @ts-ignore - no type declarations for CSS side-effect import
import "react-pdf/dist/Page/AnnotationLayer.css";
// @ts-ignore - no type declarations for CSS side-effect import
import "react-pdf/dist/Page/TextLayer.css";

interface PDFViewerContentProps {
  fileUrl: string | { filePath: string };
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  numPages: number;
}

export default function PDFViewerContent({
  fileUrl,
  onDocumentLoadSuccess,
  numPages,
}: PDFViewerContentProps) {
  // Extract the string path regardless of whether a string or object was passed
  const source = typeof fileUrl === "string" ? fileUrl : fileUrl?.filePath;

  return (
    <div className="flex flex-col items-center w-full  p-4 rounded-lg">
      {!source ? (
        <div className="p-10 text-gray-400 italic">No PDF source detected.</div>
      ) : (
        <Document
          file={source}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center gap-2 p-10">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Rendering PDF...</p>
            </div>
          }
        >
          {/* Logic: If numPages > 0, we map through and render all pages. 
            If not, we render at least the first page once loaded.
          */}
          {numPages > 0 ? (
            Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} className="shadow-lg mb-4">
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={600} // Adjust width to fit your container
                />
              </div>
            ))
          ) : (
            <Page pageNumber={1} width={600} />
          )}
        </Document>
      )}
    </div>
  );
}

// "use client";

// // Keep this, but it's now wrapped by the dynamic import
// // Now, these imports will only be executed in the browser
// import { Document, Page } from "react-pdf";

// import { pdfjs } from "react-pdf";
// // // Set the worker source (this is also client-side specific)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// // ADD this line to serve the worker file locally
// // pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker.min.js`;

// // @ts-ignore - no type declarations for CSS side-effect import
// import "react-pdf/dist/Page/AnnotationLayer.css";
// // @ts-ignore - no type declarations for CSS side-effect import
// import "react-pdf/dist/Page/TextLayer.css";

// export default function PDFViewerContent(
//   // { fileUrl }: { fileUrl: string },
//   { fileUrl }: any,
//   onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void,
//   // onDocumentLoadError: ({ numPages }: { numPages: number }) => void,
//   numPages: number
// ) {
//   // console.log(fileUrl.fileName, "check");
//   return (
//     <div className="flex justify-center">
//       <div>
//         <h2 className="text-center mb-4">PDF Viewer</h2>
//         {!fileUrl && <p>No PDF file provided.</p>}
//         {fileUrl && (
//           // <Document file={fileUrl}>
//           // <Page pageNumber={1} />
//           // </Document>

//           <Document
//             // file={fileUrl.filePath} // if only path string is passed
//             file={fileUrl} // assuming fileUrl is the full file object
//             onLoadSuccess={onDocumentLoadSuccess}
//             // onLoadError={onDocumentLoadError}
//           >
//             {Array.from(new Array(numPages), (el, index) => (
//               <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//             ))}

//             <Page
//               // pageNumber={1}
//               renderTextLayer={false}
//               renderAnnotationLayer={false}
//             />
//           </Document>
//         )}
//       </div>
//     </div>
//   );
// }
