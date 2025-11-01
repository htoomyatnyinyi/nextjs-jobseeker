import prisma from "@/lib/prisma";
import FileUploadForm from "./FileUploadForm";
import PDFViewer from "./PDFViewer";
import { verifySession } from "@/lib/session";

const FileUpload = async () => {
  const session = await verifySession();
  const profileResume = await prisma.jobSeekerProfile.findFirst({
    where: { userId: session.userId },
    include: { resumes: true },
  });

  // ✅ Correct way: Use Next.js public folder URL
  const pdfFile = "/uploads/1761834076890-sample.pdf"; // Note: NO "../../../public"

  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quo
        voluptatum a odit cumque et consequatur saepe fugit labore porro.
      </p>
      <br />
      <FileUploadForm />
      <br />
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          error eaque deserunt totam velit eligendi possimus dicta explicabo
          molestias officia amet, aperiam eum fugit ducimus.
        </p>
        {profileResume && profileResume.resumes.length > 0 && (
          <div>
            <div className="text-pink-500">
              {profileResume.resumes.map((r) => (
                <div key={r.id} className="border p-2 m-1">
                  <p>{r.fileName}</p>
                  <p>{r.filePath}</p>
                  <p>{r.fileType}</p>
                </div>
              ))}
            </div>
            <PDFViewer fileUrl={profileResume.resumes[0].filePath} />
          </div>
        )}
        <PDFViewer fileUrl={pdfFile} />
      </div>
    </div>
  );
};

export default FileUpload;
// import prisma from "@/lib/prisma";
// import FileUploadForm from "./FileUploadForm";
// // import ResumeUploadForm from "./ResumeUploadForm";
// import Preview from "./Preview";
// import PDFViewer from "./PDFViewer";
// // import file from "../../../public/1761834076890-sample.pdf";
// // import dynamic from "next/dynamic";

// // const DynamicPdfViewer = dynamic(
// //   () => import("./PDFViewer"),
// //   { ssr: false } // Disable server-side rendering for this component
// // );

// const FileUpload = async () => {
//   // const data = await prisma.resume.findFirst();
//   // console.log(data, " data");
//   const pdfFile = "../../../public/1761834076890-sample.pdf";
//   return (
//     <div>
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quo
//         voluptatum a odit cumque et consequatur saepe fugit labore porro. Cum et
//         quasi tenetur ea, assumenda quae sint voluptatum. Nesciunt.
//       </p>
//       <br />
//       <FileUploadForm />

//       <br />
//       {/* <ResumeUploadForm /> */}
//       <div>
//         <p>
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
//           error eaque deserunt totam velit eligendi possimus dicta explicabo
//           molestias officia amet, aperiam eum fugit ducimus. Fugit voluptatibus
//           et sequi perspiciatis?
//         </p>
//         {/* <Preview /> */}
//         <PDFViewer fileUrl={pdfFile} />
//         {/* <DynamicPdfViewer fileUrl={pdfFile} /> */}
//       </div>
//     </div>
//   );
// };
// export default FileUpload;
