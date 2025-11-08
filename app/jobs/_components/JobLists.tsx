// app/jobs/_components/JobLists.tsx
import Link from "next/link";
import { Heart, MapPin, Clock, Users } from "lucide-react";

export function JobLists({ jobs }: { jobs: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="group block  rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
        >
          <div className="p-6">
            {/* Company Logo + Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt=""
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  job.company?.name?.[0] || "J"
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-indigo-600 transition">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {job.company?.name || "Stealth Startup"}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {job.employmentType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <MapPin size={12} />
                {job.location}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {job.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {job._count.jobApplications} applied
                </span>
              </div>
              <Heart
                size={18}
                className="text-gray-400 group-hover:text-red-500 transition group-hover:fill-red-500"
              />
            </div>
          </div>

          {/* Hover bar */}
          <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
      ))}
    </div>
  );
}
// // app/jobs/_components/JobLists.tsx
// import Link from "next/link";
// import { Heart, MapPin, Clock, Users } from "lucide-react";

// export function JobLists({ jobs }: { jobs: any[] }) {
//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {jobs.map((job) => (
//         <Link
//           key={job.id}
//           href={`/jobs/${job.id}`}
//           className="group block  rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
//         >
//           <div className="p-6">
//             {/* Company Logo + Name */}
//             <div className="flex items-center gap-4 mb-4">
//               <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
//                 {job.company?.logo ? (
//                   <img
//                     src={job.company.logo}
//                     alt=""
//                     className="w-full h-full rounded-xl object-cover"
//                   />
//                 ) : (
//                   job.company?.name?.[0] || "J"
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg group-hover:text-indigo-600 transition">
//                   {job.title}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {job.company?.name || "Stealth Startup"}
//                 </p>
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="flex flex-wrap gap-2 mb-4">
//               <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
//                 {job.employmentType}
//               </span>
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
//                 <MapPin size={12} />
//                 {job.location}
//               </span>
//             </div>

//             {/* Description */}
//             <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//               {job.description}
//             </p>

//             {/* Footer */}
//             <div className="flex items-center justify-between text-xs text-gray-500">
//               <div className="flex items-center gap-4">
//                 <span className="flex items-center gap-1">
//                   <Clock size={14} />
//                   {new Date(job.createdAt).toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Users size={14} />
//                   {job._count.jobApplications} applied
//                 </span>
//               </div>
//               <Heart
//                 size={18}
//                 className="text-gray-400 group-hover:text-red-500 transition group-hover:fill-red-500"
//               />
//             </div>
//           </div>

//           {/* Hover bar */}
//           <div className="h-1 bg-linear-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
//         </Link>
//       ))}
//     </div>
//   );
// }
// // import Link from "next/link";

// // export const JobLists = async ({ jobs }: any) => {
// //   return (
// //     <div>
// //       {jobs?.map((job: any) => (
// //         // 2. Wrap the entire job summary in the Link component
// //         <Link
// //           key={job.id}
// //           href={`/jobs/${job.id}`} // <-- Use the dynamic route
// //           className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-300 cursor-pointer gap-8"
// //         >
// //           <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
// //           <p className="text-sm text-gray-500 mb-2">
// //             {job.location} | {job.employmentType}
// //           </p>
// //           <p className="text-sm text-gray-500 mb-2"></p>

// //           {/* Display a summary (or none at all) */}
// //           <p className="text-gray-700 line-clamp-2">
// //             {job.description.substring(0, 50)}...
// //           </p>

// //           {/* Remove detailed lists from the list view */}
// //           {/* <div className="p-2 m-1">
// //               {job?.requirements.map((req) => (
// //                 <div key={req.id}>{req.requirement}</div>
// //                 ))}
// //                 </div> */}

// //           <span className="text-blue-500 font-medium mt-2 block">
// //             View Details →
// //           </span>
// //         </Link>
// //       ))}
// //     </div>
// //   );
// // };
