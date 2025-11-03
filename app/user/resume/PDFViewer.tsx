"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";

// // 1. Dynamically import the component that uses 'react-pdf'
// const PDFViewerContent = dynamic(() => import("./PDFViewerContent"), {
//   // 2. IMPORTANT: Set ssr to false to disable server-side rendering
//   ssr: false,
//   loading: () => <p>Loading PDF viewer...</p>, // Optional loading state
// });

const PDFViewerContent = dynamic(
  async () => {
    const mod = await import("./PDFViewerContent");
    const Original = (mod as any).default ?? mod;

    const Wrapped: React.FC<any> = (props) => {
      // If the original export is a function that expects 3+ args (props, onDocumentLoadSuccess, numPages),
      // call it as such; otherwise render it as a normal React component.
      if (typeof Original === "function" && (Original as any).length >= 3) {
        // console.log(props, "check at dynamics");
        return (Original as any)(
          props,
          props.onDocumentLoadSuccess,
          props.numPages
        );
      }
      return <Original {...props} />;
    };

    return Wrapped;
  },
  {
    // 2. IMPORTANT: Set ssr to false to disable server-side rendering
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>, // Optional loading state
  }
);

// 3. Render the dynamically loaded component
const PDFViewer = (props: any) => {
  // console.log(props, " PDFViewer props");
  const [file, setFile] = useState({});

  // console.log(resume, "select resume directly from props");
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error while loading PDF:", error.message);
  };

  const handleSelectFile = (file: {
    id: string;
    filePath: string;
    fileName: string;
  }) => {
    // console.log(file, "file on click");
    setFile(file);
  };

  return (
    <div>
      <h1>Here is check point before dynamic rnder</h1>
      <div>
        {props?.fileUrl.map(
          (file: { id: string; filePath: string; fileName: string }) => (
            <div
              key={file.id}
              className="text-yellow-500 p-2 m-1 border"
              onClick={() => handleSelectFile(file)}
            >
              <p>{file.id}</p>
              <p>{file.filePath}</p>
              <p>{file.fileName}</p>
            </div>
          )
        )}
      </div>
      <PDFViewerContent
        // {...props} // for default
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onDocumentLoadError={onDocumentLoadError}
        numPages={numPages || 0}
        fileUrl={file}
      />
    </div>
  );
};
export default PDFViewer;

// // working one
// "use client";

// import { Document, Page, pdfjs } from "react-pdf";
// // import { pdfjs } from "react-pdf";

// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// // @ts-ignore - no type declarations for CSS side-effect import
// import "react-pdf/dist/Page/AnnotationLayer.css";
// // @ts-ignore - no type declarations for CSS side-effect import
// import "react-pdf/dist/Page/TextLayer.css";

// // // Set workerSrc for react-pdf
// // because .js is not working only .mjs is working.
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export default function PDFViewer({ fileUrl }: { fileUrl: string | null }) {
//   return (
//     <div className="flex justify-center">
//       <div>
//         <h2 className="text-center mb-4">PDF Viewer</h2>
//         {!fileUrl && <p>No PDF file provided.</p>}
//         {fileUrl && (
//           <Document file={fileUrl}>
//             <Page pageNumber={1} />
//           </Document>
//         )}
//       </div>
//     </div>
//   );
// }
