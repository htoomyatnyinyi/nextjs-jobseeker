import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { DateFilter } from "@/lib/common/DateTime";
import JobForm from "./JobForm";
import { redirect } from "next/navigation";
import ActiveButton from "./ActiveButton";

const EmployerDashboard = async () => {
  const session = await verifySession();

  if (!session) {
    return redirect("/login");
  }

  const employerJobs = await prisma.jobPost.findMany({
    where: { employer: { userId: session?.userId } },
    orderBy: { postedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold ">Employer Dashboard</h1>
          <p className="">Manage your active job postings and recruitment.</p>
        </div>
        <div className="text-right">
          <span className=" text-sky-500 px-3 py-1 rounded-full text-sm font-medium">
            {employerJobs.length} Active Posts
          </span>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse ">
            <thead className=" border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold ">Job Title</th>
                <th className="p-4 font-semibold ">Category</th>
                <th className="p-4 font-semibold ">Salary Range</th>
                <th className="p-4 font-semibold ">Posted Date</th>
                <th className="p-4 font-semibold ">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employerJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium ">{job.title}</div>
                    <div className="text-xs ">
                      {job.location} • {job.employmentType}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{job.category}</td>
                  <td className="p-4 text-sm">
                    ${job.salaryMin.toLocaleString()} - $
                    {job.salaryMax?.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm">
                    {DateFilter({ date: job.postedAt })}
                  </td>
                  <td className="p-4 text-sm">
                    <ActiveButton jobId={job.id} isActive={job.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-slate-100" />

      <section className=" rounded-2xl">
        <JobForm />
      </section>
    </div>
  );
};

export default EmployerDashboard;

// import { verifySession } from "@/lib/session";
// // import JobPostForm from "./JobPostForm";
// import prisma from "@/lib/prisma";
// import { DateFilter } from "@/lib/common/DateTime";
// import JobForm from "./JobForm";

// const page = async () => {
//   const session = await verifySession();

//   // const employerJobs = await prisma.jobPost.findMany({
//   //   where: { employerId: session?.userId },
//   // });

//   const employerJobs = await prisma.jobPost.findMany({
//     where: { employer: { userId: session?.userId } },
//   });

//   return (
//     <div>
//       <h1>JobSection List</h1>

//       {employerJobs?.map((job) => (
//         <div key={job.id} className="flex flex-col p-2 m-1 border text-sky-400">
//           <p>{job.title}</p>
//           <p>{job.description}</p>
//           <p>{String(job.salaryMin)}</p>
//           <p>{String(job.salaryMax)}</p>
//           <p>{job.isActive}</p>
//           <p>{job.address}</p>
//           <p>{job.employmentType}</p>
//           <p>{job.location}</p>
//           <p>{job.category}</p>
//           <p>{DateFilter({ date: job.postedAt })}</p>
//           <p>{DateFilter({ date: job.applicationDeadLine })}</p>
//         </div>
//       ))}
//       <JobForm />
//       {/* <br />
//       <JobPostForm /> */}
//     </div>
//   );
// };

// export default page;
