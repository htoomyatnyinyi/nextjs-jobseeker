// "use client";

// import { useActionState } from "react";
// // Assuming 'jobPost' is your upsertJobPost action, import it correctly.
// // I'll use 'upsertJobPost' which matches the logic of the action you provided previously.
// import { jobPost } from "./actions"; // Adjust the path as necessary

// const JobPostForm = () => {
//   const mockFrontendJob = {
//     title: "Senior Frontend Developer",
//     description: "Lead the frontend development of our core SaaS product...",
//     salaryMin: "120000",
//     salaryMax: "160000",
//     location: "Remote (EST Timezone Preferred)",
//     address: "No.209, Main Road",
//     employmentType: "FULL_TIME",
//     category: "Software Engineering",
//     imageUrl: "https://example.com/images/dev_banner.jpg",
//     applicationDeadLine: "2025-12-31", // Note: The action uses 'z.coerce.date()', ensure format is acceptable
//     requirements: ["req1", "req2", "req3", "req4", "req5"],
//     responsibilites: ["resp1", "resp2", "resp3", "resp4", "resp5"],
//   };

//   // 1. Initialize useActionState
//   const [state, actionForm, pending] = useActionState(jobPost, {
//     success: false,
//     message: "",
//     errors: {},
//   });

//   // Helper for input styling
//   const inputClass =
//     "w-full p-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
//   const labelClass =
//     "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
//   const errorClass = "text-sm text-red-500 mt-1";

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
//         Post a New Job
//       </h2>

//       {/* Feedback Message */}
//       {/* {state.message && (
//         <div
//           className={`p-3 mb-4 rounded-md ${
//             state.success
//               ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
//               : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
//           }`}
//         >
//           {state.message}
//         </div>
//       )} */}

//       {/* 2. Form element using the actionForm function */}
//       <form action={actionForm} className="space-y-6">
//         {/* Hidden field for update (optional, but useful if this form is reused for editing) */}
//         {/* <input type="hidden" name="jobPostId" value={null} /> */}

//         {/* --- Row 1: Title and Category --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Job Title */}

//           <h2>User IDs</h2>

//           {/* Example 2: Array-like notation (though not strictly required for FormData) */}
//           <input
//             type="number"
//             name="userIds[]"
//             placeholder="User ID 1"
//             defaultValue="101"
//           />
//           <input
//             type="number"
//             name="userIds[]"
//             placeholder="User ID 2"
//             defaultValue="102"
//           />
//           <div>
//             <label htmlFor="title" className={labelClass}>
//               Job Title
//             </label>
//             <input
//               id="title"
//               name="title"
//               type="text"
//               required
//               placeholder="e.g., Senior Full Stack Developer"
//               className={inputClass}
//               defaultValue={mockFrontendJob.title}
//             />
//             {/* {state.errors?.title && (
//               <p className={errorClass}>{state.errors.title}</p>
//             )} */}
//           </div>

//           {/* Category */}
//           <div>
//             <label htmlFor="category" className={labelClass}>
//               Category
//             </label>
//             <input
//               id="category"
//               name="category"
//               type="text"
//               required
//               placeholder="e.g., Software Engineering"
//               className={inputClass}
//               defaultValue={mockFrontendJob.category}
//             />
//             {/* {state.errors?.category && (
//               <p className={errorClass}>{state.errors.category}</p>
//             )} */}
//           </div>
//         </div>

//         {/* --- Row 2: Salary and Type --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Salary Minimum */}
//           <div>
//             <label htmlFor="salaryMin" className={labelClass}>
//               Minimum Salary (USD)
//             </label>
//             <input
//               id="salaryMin"
//               name="salaryMin"
//               type="number"
//               min="0"
//               required
//               placeholder="e.g., 80000"
//               className={inputClass}
//               defaultValue={mockFrontendJob.salaryMin}
//             />
//             {/* {state.errors?.salaryMin && (
//               <p className={errorClass}>{state.errors.salaryMin}</p>
//             )} */}
//           </div>

//           {/* Salary Maximum */}
//           <div>
//             <label htmlFor="salaryMax" className={labelClass}>
//               Maximum Salary (Optional)
//             </label>
//             <input
//               id="salaryMax"
//               name="salaryMax"
//               type="number"
//               min="0"
//               placeholder="e.g., 120000"
//               className={inputClass}
//               defaultValue={mockFrontendJob.salaryMax}
//             />
//             {/* {state.errors?.salaryMax && (
//               <p className={errorClass}>{state.errors.salaryMax}</p>
//             )} */}
//           </div>

//           {/* Employment Type */}
//           <div>
//             <label htmlFor="employmentType" className={labelClass}>
//               Employment Type
//             </label>
//             <select
//               id="employmentType"
//               name="employmentType"
//               required
//               className={inputClass}
//               defaultValue={mockFrontendJob.employmentType}
//             >
//               <option value="FULL_TIME">Full-Time</option>
//               <option value="PART_TIME">Part-Time</option>
//               <option value="CONTRACT">Contract</option>
//               <option value="TEMPORARY">Temporary</option>
//               <option value="INTERNSHIP">Internship</option>
//             </select>
//             {/* {state.errors?.employmentType && (
//               <p className={errorClass}>{state.errors.employmentType}</p>
//             )} */}
//           </div>
//         </div>

//         {/* --- Row 3: Location and Deadline --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Location */}
//           <div>
//             <label htmlFor="location" className={labelClass}>
//               Location
//             </label>
//             <input
//               id="location"
//               name="location"
//               type="text"
//               required
//               placeholder="e.g., Remote or New York, NY"
//               className={inputClass}
//               defaultValue={mockFrontendJob.location}
//             />
//             {/* {state.errors?.location && (
//               <p className={errorClass}>{state.errors.location}</p>
//             )} */}
//           </div>

//           {/* Application Deadline */}
//           <div>
//             <label htmlFor="applicationDeadLine" className={labelClass}>
//               Application Deadline
//             </label>
//             <input
//               id="applicationDeadLine"
//               name="applicationDeadLine"
//               type="date"
//               required
//               className={inputClass}
//               defaultValue={mockFrontendJob.applicationDeadLine}
//             />
//             {/* {state.errors?.applicationDeadLine && (
//               <p className={errorClass}>{state.errors.applicationDeadLine}</p>
//             )} */}
//           </div>
//         </div>

//         {/* Address (Optional) */}
//         <div>
//           <label htmlFor="address" className={labelClass}>
//             Full Address (Optional)
//           </label>
//           <input
//             id="address"
//             name="address"
//             type="text"
//             placeholder="Full Street Address"
//             className={inputClass}
//             defaultValue={mockFrontendJob.address}
//           />
//           {/* {state.errors?.address && (
//             <p className={errorClass}>{state.errors.address}</p>
//           )} */}
//         </div>

//         {/* Description */}
//         <div>
//           <label htmlFor="description" className={labelClass}>
//             Job Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             rows={5}
//             required
//             placeholder="Provide a detailed description of the role and its context..."
//             className={inputClass}
//             defaultValue={mockFrontendJob.description}
//           ></textarea>
//           {/* {state.errors?.description && (
//             <p className={errorClass}>{state.errors.description}</p>
//           )} */}
//         </div>

//         {/* Image URL (Optional) */}
//         <div>
//           <label htmlFor="imageUrl" className={labelClass}>
//             Image/Banner URL (Optional)
//           </label>
//           <input
//             id="imageUrl"
//             name="imageUrl"
//             type="url"
//             placeholder="e.g., https://yourcompany.com/job-banner.png"
//             className={inputClass}
//             defaultValue={mockFrontendJob.imageUrl}
//           />
//           {/* {state.errors?.imageUrl && (
//             <p className={errorClass}>{state.errors.imageUrl}</p>
//           )} */}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={pending}
//           className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150 disabled:bg-green-400 dark:disabled:bg-green-700"
//         >
//           {pending ? "Posting..." : "Post Job"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default JobPostForm;
