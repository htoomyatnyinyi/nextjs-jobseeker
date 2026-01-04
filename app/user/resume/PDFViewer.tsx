"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import FileUploadForm from "./FileUploadForm";
import DeleteResumeButton from "./DeleteResumeButton";

// // Dynamically import the content renderer (SSR disabled is correct)
// const PDFViewerContent = dynamic(
//   () =>
//     import("./PDFViewerContent").then((mod) => {
//       const Component = mod.default || mod;
//       return (props: any) =>
//         Component(props, props.onDocumentLoadSuccess, props.numPages);
//     }),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-96 flex items-center justify-center  border-2 border-dashed rounded-xl">
//         <div className="flex flex-col items-center gap-2">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm  font-medium">Loading PDF engine...</p>
//         </div>
//       </div>
//     ),
//   }
// );

// Dynamically import the content renderer (SSR disabled is correct)
const PDFViewerContent = dynamic(() => import("./PDFViewerContent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center  border-2 border-dashed rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm  font-medium">Loading PDF engine...</p>
      </div>
    </div>
  ),
});
interface Resume {
  id: string;
  filePath: string;
  fileName: string;
}

const PDFViewer = ({ fileUrl: resumes }: { fileUrl: Resume[] }) => {
  const [selectedFile, setSelectedFile] = useState<Resume | null>(
    resumes && resumes.length > 0 ? resumes[0] : null
  );

  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6  p-4 rounded-2xl shadow-sm border border-gray-100">
      {/* SIDEBAR: Resume Selection */}
      <div className="w-full lg:w-64 flex flex-col gap-3">
        <FileUploadForm />
        <br />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
          Your Documents
        </h3>
        <div className="flex flex-col gap-2">
          {resumes?.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                selectedFile?.id === file.id
                  ? "bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-sm"
                  : "bg-white border-gray-100 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-sm font-semibold truncate ${
                      selectedFile?.id === file.id
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {file.fileName}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    PDF Document
                  </p>
                </div>
              </div>
              <DeleteResumeButton id={file.id} />
            </div>
          ))}
        </div>
      </div>

      {/* VIEWER AREA */}
      <div className="flex-1  rounded-xl border border-gray-200 overflow-hidden min-h-175">
        {selectedFile ? (
          <div className="h-full flex flex-col">
            <div className="bg-white p-3 border-b flex justify-between items-center px-6">
              <p className="text-sm font-medium text-gray-600 truncate max-w-75">
                Viewing:{" "}
                <span className="text-gray-900">{selectedFile.fileName}</span>
              </p>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                {numPages} Pages
              </span>
            </div>

            <div className="flex-1 p-4 overflow-auto flex justify-center">
              <PDFViewerContent
                // fileUrl={selectedFile} // Pass the file path here
                fileUrl={selectedFile.filePath} // Pass the string path here
                onDocumentLoadSuccess={onDocumentLoadSuccess}
                numPages={numPages}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 italic">
            No document selected
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;

// "use client";

// import dynamic from "next/dynamic";
// import React, { useState } from "react";

// // // 1. Dynamically import the component that uses 'react-pdf'
// // const PDFViewerContent = dynamic(() => import("./PDFViewerContent"), {
// //   // 2. IMPORTANT: Set ssr to false to disable server-side rendering
// //   ssr: false,
// //   loading: () => <p>Loading PDF viewer...</p>, // Optional loading state
// // });

// const PDFViewerContent = dynamic(
//   async () => {
//     const mod = await import("./PDFViewerContent");
//     const Original = (mod as any).default ?? mod;

//     const Wrapped: React.FC<any> = (props) => {
//       // If the original export is a function that expects 3+ args (props, onDocumentLoadSuccess, numPages),
//       // call it as such; otherwise render it as a normal React component.
//       if (typeof Original === "function" && (Original as any).length >= 3) {
//         // console.log(props, "check at dynamics");
//         return (Original as any)(
//           props,
//           props.onDocumentLoadSuccess,
//           props.numPages
//         );
//       }
//       return <Original {...props} />;
//     };

//     return Wrapped;
//   },
//   {
//     // 2. IMPORTANT: Set ssr to false to disable server-side rendering
//     ssr: false,
//     loading: () => <p>Loading PDF viewer...</p>, // Optional loading state
//   }
// );

// // 3. Render the dynamically loaded component
// const PDFViewer = (props: any) => {
//   // console.log(props, " PDFViewer props");
//   const [file, setFile] = useState({});

//   // console.log(resume, "select resume directly from props");
//   const [numPages, setNumPages] = useState<number | null>(null);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//   };

//   const onDocumentLoadError = (error: Error) => {
//     console.error("Error while loading PDF:", error.message);
//   };

//   const handleSelectFile = (file: {
//     id: string;
//     filePath: string;
//     fileName: string;
//   }) => {
//     // console.log(file, "file on click");
//     setFile(file);
//   };

//   return (
//     <div>
//       <h1>Here is check point before dynamic rnder</h1>
//       <div>
//         {props?.fileUrl.map(
//           (file: { id: string; filePath: string; fileName: string }) => (
//             <div
//               key={file.id}
//               className="text-yellow-500 p-2 m-1 border"
//               onClick={() => handleSelectFile(file)}
//             >
//               <p>{file.id}</p>
//               <p>{file.filePath}</p>
//               <p>{file.fileName}</p>
//             </div>
//           )
//         )}
//       </div>
//       <PDFViewerContent
//         // {...props} // for default
//         onDocumentLoadSuccess={onDocumentLoadSuccess}
//         onDocumentLoadError={onDocumentLoadError}
//         numPages={numPages || 0}
//         fileUrl={file}
//       />
//     </div>
//   );
// };
// export default PDFViewer;

// // // working one
// // "use client";

// // import { Document, Page, pdfjs } from "react-pdf";
// // // import { pdfjs } from "react-pdf";

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// // // @ts-ignore - no type declarations for CSS side-effect import
// // import "react-pdf/dist/Page/AnnotationLayer.css";
// // // @ts-ignore - no type declarations for CSS side-effect import
// // import "react-pdf/dist/Page/TextLayer.css";

// // // // Set workerSrc for react-pdf
// // // because .js is not working only .mjs is working.
// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // export default function PDFViewer({ fileUrl }: { fileUrl: string | null }) {
// //   return (
// //     <div className="flex justify-center">
// //       <div>
// //         <h2 className="text-center mb-4">PDF Viewer</h2>
// //         {!fileUrl && <p>No PDF file provided.</p>}
// //         {fileUrl && (
// //           <Document file={fileUrl}>
// //             <Page pageNumber={1} />
// //           </Document>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
