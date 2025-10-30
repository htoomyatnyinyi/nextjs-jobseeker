import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// This function will fetch all jobs and cache the result.
// Next.js uses the 'tags' for automatic invalidation.
export const getAllJobs = unstable_cache(
  async () => {
    // This is the database query
    const allJobs = await prisma.jobPost.findMany({
      include: {
        requirements: true,
        responsibilities: true,
      },
      // You might want to order this, e.g., orderBy: { createdAt: 'desc' }
    });
    console.log(
      "Fetching all jobs from DB... (This should only run once or after revalidation)"
    );
    return allJobs;
  },
  ["all-jobs"], // Key for the cache store
  { tags: ["job-posts"] } // Tags for on-demand revalidation
);

// For the single job fetch, keeping it inline in the component is fine,
// as the cache is per-route and per-request memoization handles deduplication.

// // 'use client' is not needed, it should remain a Server Component for data fetching.

// import prisma from "@/lib/prisma";
// import { JobLists } from "../_components/JobLists"; // Assuming this is still used somewhere
// import Link from "next/link";
// import { getAllJobs } from "@/lib/data"; // Import the cached function

// // Define the props for the dynamic page
// type JobDetailsPageProps = {
//   params: {
//     id: string; // The job ID from the URL (e.g., /jobs/123)
//   };
// };

// const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
//   const jobId = params.id;

//   // We fetch the two pieces of data:
//   // 1. The specific job (prisma.findUnique is not a high-traffic query, fine to run per-request)
//   // 2. The list of all jobs (which uses the unstable_cache function for persistence)
//   const [job, jobs] = await Promise.all([
//     // Fetch the single job details (no persistent cache needed here, Next.js memoizes it for the request)
//     prisma.jobPost.findUnique({
//       where: {
//         id: jobId,
//       },
//       include: {
//         requirements: true,
//         responsibilities: true,
//       },
//     }),
//     // Fetch all jobs using the cached function
//     getAllJobs(),
//   ]);

//   if (!job) {
//     return <div className="text-center p-8 text-xl font-medium">Job not found.</div>;
//   }

//   // --- Design Adjustments for a cleaner look ---
//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

//       {/* Main Job Details Column (2/3 width on large screens) */}
//       <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
//         <p className="text-lg text-indigo-600 mb-6 font-medium">
//           {job.location} | {job.employmentType}
//         </p>

//         <div className="space-y-8">
//           {/* Description Section */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Job Description</h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
//           </section>

//           {/* Responsibilities Section */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Key Responsibilities</h2>
//             <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
//               {job.responsibilities.map((res) => (
//                 <li key={res.id}>{res.responsibility}</li>
//               ))}
//             </ul>
//           </section>

//           {/* Requirements Section */}
//           <section>
//             <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Required Skills & Experience</h2>
//             <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
//               {job.requirements.map((req) => (
//                 <li key={req.id}>{req.requirement}</li>
//               ))}
//             </ul>
//           </section>
//         </div>

//         {/* Call to Action Button */}
//         <div className="mt-10 pt-6 border-t">
//           <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md">
//             Apply Now
//           </button>
//         </div>
//       </div>

//       {/* Sidebar (1/3 width on large screens) - for Related Jobs */}
//       <aside className="lg:col-span-1">
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
//           <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Other Open Positions</h2>

//           {/* Related Jobs List */}
//           <div className="space-y-3">
//             {jobs.filter(j => j.id !== jobId).slice(0, 5).map((job) => ( // Show up to 5 other jobs
//               <Link
//                 href={`/jobs/${job.id}`}
//                 key={job.id}
//                 className="block p-4 rounded-lg bg-gray-50 hover:bg-indigo-50 transition duration-150 border border-gray-200 hover:border-indigo-400 group"
//               >
//                 <p className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
//                   {job.title}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {job.location} · {job.employmentType}
//                 </p>
//               </Link>
//             ))}
//              {jobs.length <= 1 && (
//                 <p className="text-gray-500 italic">No other jobs available right now.</p>
//              )}
//           </div>

//           {/* Link to all jobs */}
//           {jobs.length > 5 && (
//             <Link href="/jobs" className="mt-4 block text-center text-indigo-600 hover:text-indigo-800 font-medium">
//               View All Jobs &rarr;
//             </Link>
//           )}
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default JobDetailsPage;
