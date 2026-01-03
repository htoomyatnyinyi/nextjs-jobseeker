import Link from "next/link";

interface JobListsProps {
  jobs: any[];
  selectedId?: string; // Optional: highlight the current job
}

const JobLists = ({ jobs, selectedId }: JobListsProps) => {
  return (
    <div className="flex flex-col gap-4 p-1">
      {jobs?.map((job) => {
        const isActive = selectedId === job.id;

        return (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className={`group relative flex flex-col p-5 border rounded-xl transition-all duration-200 
              ${
                isActive
                  ? "border-blue-500  shadow-md ring-1 ring-blue-500"
                  : "border-gray-200  hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
              }`}
          >
            {/* Header: Title and Category */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-bold  group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h2>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {job.category}
                </span>
              </div>
              {/* Optional: Salary Badge */}
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  ${(job.salaryMin / 1000).toFixed(0)}k - $
                  {(job.salaryMax / 1000).toFixed(0)}k
                </p>
              </div>
            </div>

            {/* Location & Type Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                {job.location}
              </span>
              <span className="flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                {job.employmentType.replace("_", " ")}
              </span>
            </div>

            {/* Description Summary */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
              {job.description}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Details →
              </span>
            </div>

            {/* Active Indicator Dot */}
            {isActive && (
              <div className="absolute top-4 -right-1 w-2 h-8 bg-blue-500 rounded-l-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default JobLists;
// import Link from "next/link";

// const JobLists = async ({ jobs }: any) => {
//   return (
//     <div>
//       {jobs?.map((job: any) => (
//         // 2. Wrap the entire job summary in the Link component
//         <Link
//           key={job.id}
//           href={`/jobs/${job.id}`} // <-- Use the dynamic route
//           className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-300 cursor-pointer gap-8"
//         >
//           <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
//           <p className="text-sm text-gray-500 mb-2">
//             {job.location} | {job.employmentType}
//           </p>
//           <p className="text-sm text-gray-500 mb-2"></p>

//           {/* Display a summary (or none at all) */}
//           <p className="text-gray-700 line-clamp-2">
//             {job.description.substring(0, 50)}...
//           </p>

//           {/* Remove detailed lists from the list view */}
//           {/* <div className="p-2 m-1">
//               {job?.requirements.map((req) => (
//                 <div key={req.id}>{req.requirement}</div>
//                 ))}
//                 </div> */}

//           <span className="text-blue-500 font-medium mt-2 block">
//             View Details →
//           </span>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default JobLists;

// // import { MapPin, Clock, Users, MoreVertical, Edit3, Trash2, ExternalLink } from "lucide-react";

// // const JobPostCard = ({ job }: any) => {
// //   // Mock data if no props provided
// //   const data = job || {
// //     title: "Senior Full Stack Engineer",
// //     type: "Full-time",
// //     location: "Remote / New York",
// //     applicants: 24,
// //     postedAt: "2 days ago",
// //     status: "Active",
// //     salary: "$120k - $150k"
// //   };

// //   return (
// //     <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-sky-200 transition-all">
// //       <div className="flex justify-between items-start mb-4">
// //         <div className="space-y-1">
// //           <div className="flex items-center gap-3">
// //             <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
// //               {data.title}
// //             </h3>
// //             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
// //               data.status === 'Active'
// //                 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
// //                 : 'bg-slate-50 text-slate-500 border border-slate-100'
// //             }`}>
// //               {data.status}
// //             </span>
// //           </div>
// //           <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
// //             <span className="flex items-center gap-1">
// //               <MapPin className="w-3.5 h-3.5" /> {data.location}
// //             </span>
// //             <span className="flex items-center gap-1">
// //               <Clock className="w-3.5 h-3.5" /> {data.postedAt}
// //             </span>
// //             <span className="font-medium text-sky-600/80">{data.salary}</span>
// //           </div>
// //         </div>

// //         <div className="flex gap-1">
// //           <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-sky-600 transition-colors">
// //             <Edit3 className="w-4 h-4" />
// //           </button>
// //           <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
// //             <Trash2 className="w-4 h-4" />
// //           </button>
// //         </div>
// //       </div>

// //       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
// //         <div className="flex items-center gap-4">
// //           <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
// //             <div className="bg-sky-50 p-1.5 rounded-md">
// //               <Users className="w-4 h-4 text-sky-600" />
// //             </div>
// //             {data.applicants} Applicants
// //           </div>
// //           <span className="bg-slate-100 h-1 w-1 rounded-full" />
// //           <span className="text-sm text-slate-500">{data.type}</span>
// //         </div>

// //         <button className="text-sm font-semibold text-sky-600 flex items-center gap-1 hover:underline">
// //           View Details <ExternalLink className="w-3 h-3" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };
