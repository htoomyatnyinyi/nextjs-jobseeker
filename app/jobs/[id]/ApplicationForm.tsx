"use client";

import { useActionState } from "react";
import { applicationJob } from "./actions";
import Link from "next/link";

const ApplicationForm = ({
  jobPostId,
  // resumeId,
  resumes,
}: {
  jobPostId: string;
  // resumeId: string;
  resumes: any[];
}) => {
  // 1. Hook for handling the server action state
  const [state, applicationAction, pending] = useActionState(applicationJob, {
    success: false,
    message: "",
  });

  // 2. Defensive check for resumes
  if (!resumes || resumes.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
        <p className="text-amber-800 text-sm font-medium mb-3">
          Please upload a resume before applying.
        </p>
        <Link
          href="/profile/resumes/upload"
          className="text-xs bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors inline-block"
        >
          Upload Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 3. Success State UI */}
      {state?.success ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center font-bold animate-in fade-in zoom-in duration-300">
          🎉 {state.message || "Applied successfully!"}
        </div>
      ) : (
        <form action={applicationAction} className="flex flex-col gap-4">
          {/* Hidden inputs for form data */}
          <input type="hidden" name="jobPostId" value={jobPostId} />
          <input
            type="hidden"
            name="jobSeekerId"
            value={resumes[0]?.jobSeekerId}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">
              Select Your Resume
            </label>
            <select
              name="resumeId"
              defaultValue={resumes[0]?.id}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
            >
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  📄 {resume.fileName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-100
              ${
                pending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Apply Now"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplicationForm;
// "use client";

// import { useActionState } from "react";
// import { applicationJob } from "./actions";
// import Link from "next/link";

// const ApplicationForm = ({
//   jobPostId,
//   resumes,
// }: // resumeId,
// {
//   jobPostId: string;
//   resumes: any[];
//   // resumeId: string;
// }) => {
//   const [state, applicationAction, pending] = useActionState(applicationJob, {
//     success: false,
//     message: "",
//   });

//   if (resumes.length === 0) {
//     return (
//       <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
//         <p className="text-amber-800 text-sm font-medium mb-3">
//           No resume found in your profile.
//         </p>
//         <Link
//           href="/profile"
//           className="text-xs bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors inline-block"
//         >
//           Upload Resume
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {state?.success ? (
//         <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center font-medium">
//           🎉 {state.message || "Application submitted!"}
//         </div>
//       ) : (
//         <form action={applicationAction} className="flex flex-col gap-4">
//           <input type="hidden" name="jobPostId" value={jobPostId} />

//           <div>
//             <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
//               Select Resume
//             </label>
//             <select
//               name="resumeId"
//               required
//               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
//             >
//               {resumes.map((resume) => (
//                 <option key={resume.id} value={resume.id}>
//                   {resume.fileName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={pending}
//             className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
//               ${
//                 pending
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
//               }`}
//           >
//             {pending ? "Submitting..." : "Apply Now"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ApplicationForm;
// // "use client";

// // import { useActionState } from "react";
// // import { applicationJob } from "./actions";
// // import { redirect } from "next/dist/server/api-utils";

// // const ApplicationForm = ({
// //   jobPostId,
// //   resumeId,
// //   // savedJobsList,
// //   resumes,
// // }: {
// //   jobPostId: string;
// //   resumeId: string;
// //   resumes: any[];
// //   // savedJobsList: any[];
// // }) => {
// //   const [state, applicationAction, pending] = useActionState(applicationJob, {
// //     success: false,
// //     message: "",
// //   });

// //   if (resumes.length === 0) {
// //     return (
// //       <div className="text-red-500 p-2 m-1">
// //         <h1>Please upload a resume before applying for this job.</h1>
// //         {/* {redirect("/profile/resumes/upload")} */}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="text-sky-500 p-2 m-1">
// //       <h1>ApplicationForm</h1>
// //       <form action={applicationAction}>
// //         <input type="text" name="resumeId" defaultValue={resumeId} hidden />
// //         <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />
// //         <input
// //           type="text"
// //           name="jobSeekerId"
// //           defaultValue={resumes[0].jobSeekerId}
// //           hidden
// //         />
// //         {/* <select name="resumeId" defaultValue={resumeId}> */}
// //         {/* <select className="text-pink-500"> */}
// //         <br />
// //         <p>Please Select Your Resume</p>
// //         <select
// //           name="resumeId"
// //           // defaultValue={resumeId}
// //           className="text-pink-500"
// //         >
// //           {resumes.map((resume) => (
// //             <option key={resume.id} value={resume.id}>
// //               {resume.fileName}
// //             </option>
// //           ))}
// //         </select>
// //         <button type="submit" className="hover:bg-amber-300">
// //           Apply Now
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default ApplicationForm;

// // // // logic change for use action state, please check this before delete
// // // "use client";

// // // import { useActionState } from "react";
// // // import { applicationJob } from "./actions";

// // // const ApplicationForm = ({
// // //   jobPostId,
// // //   resumeId,
// // //   // savedJobsList,
// // //   resumes,
// // // }: {
// // //   jobPostId: string;
// // //   resumeId: string;
// // //   resumes: any[];
// // //   // savedJobsList: any[];
// // // }) => {
// // //   const [state, applicationAction, pending] = useActionState(applicationJob, {
// // //     jobPostIdInState: jobPostId,
// // //     resumeIdInState: resumeId,
// // //     jobSeekerProfileIdInState: resumes[0]?.jobSeekerId,
// // //   });

// // //   return (
// // //     <div className="text-sky-500 p-2 m-1">
// // //       <h1>ApplicationForm</h1>
// // //       <form action={applicationAction}>
// // //         {/* <input type="text" name="resumeId" defaultValue={resumeId} /> */}
// // //         <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />
// // //         <input
// // //           type="text"
// // //           name="jobSeekerId"
// // //           defaultValue={resumes[0].jobSeekerId}
// // //           hidden
// // //         />
// // //         {/* <select name="resumeId" defaultValue={resumeId}> */}
// // //         {/* <select className="text-pink-500"> */}
// // //         <br />
// // //         <p>Please Select Your Resume</p>
// // //         <select
// // //           name="resumeId"
// // //           // defaultValue={resumeId}
// // //           className="text-pink-500"
// // //         >
// // //           {resumes.map((resume) => (
// // //             <option key={resume.id} value={resume.id}>
// // //               {resume.fileName}
// // //             </option>
// // //           ))}
// // //         </select>
// // //         <button type="submit">Apply Now</button>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default ApplicationForm;
